#Node - Memory
import itertools
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import statsmodels.api as sm
import matplotlib
from pandas import DataFrame
import requests
from datetime import timedelta
from pylab import rcParams
import pymongo
from pymongo import MongoClient
from sklearn.metrics import median_absolute_error
from sklearn.metrics import mean_absolute_error

url2 = 'http://34.72.63.188:3001/postPythonMemPercentage'

#mongo connection
client = pymongo.MongoClient("mongodb+srv://ayu:ayuadmin@cluster0.bmlds.mongodb.net/application-data?retryWrites=true&w=majority")

mydb = client["application-data"]
mycol = mydb["app2"]
df = pd.DataFrame(list(mycol.find()))
df['date'] = pd.to_datetime(df['date'], errors='coerce')
df['date'] = df['date'].dt.floor('Min')

dict2={}
uniquePodNames = df['pod_name'].unique()
sum_mem_usage_mse=0
sum_mem_usage_rmse=0
sum_mem_median_ae=0
sum_mem_mean_ae=0
for key in uniquePodNames:
    df1 = df[df['pod_name'] == key]
    
    df1=df1.set_index('date')
    
    all = pd.Series(data=pd.date_range(start=df1.index.min(), end=df1.index.max(), freq='2min'))
    mask = all.isin(df1.index.values)
    for miss_date in all[~mask]:
        miss_df = {'pod_name': key, 'date': miss_date, 'cpu_usage': 0, 'cpu' : 0, 'mem_usage' : 0, 'mem_percentage':0}
        df = df.append(miss_df, ignore_index = True)
    
    df1 = df[df['pod_name'] == key]
    
    y = df1.set_index('date')
    df1.index = pd.DatetimeIndex(df1.index)
    y = y['mem_percentage']
    y.sort_index(inplace= True)
    y.index = pd.DatetimeIndex(y.index.values,freq=y.index.inferred_freq)
    start=y.index.min()
    end=y.index.max()
    

    #decomposition = sm.tsa.seasonal_decompose(y, model='additive', period = 4)
    #fig = decomposition.plot()
    #plt.show()
    p = d = q = range(0, 2)
    trend_pdq = list(itertools.product(p, d, q))
    seasonal_pdq = [(x[0], x[1], x[2], 7) for x in list(itertools.product(p, d, q))]
    min=100000000
    for param in trend_pdq:
        for param_seasonal in seasonal_pdq:
            try:
                mod = sm.tsa.statespace.SARIMAX(y,order=param,seasonal_order=param_seasonal,enforce_stationarity=False,enforce_invertibility=False)
                results = mod.fit()
                if results.aic<min:
                    min=results.aic
                    param_selected=param
                    param_seasonal_selected=param_seasonal
            except:
                continue
    
    #create model
    model = sm.tsa.statespace.SARIMAX(y,order=param_selected,seasonal_order=param_seasonal_selected,enforce_stationarity=False,enforce_invertibility=False)
    
    #fit model
    results = model.fit()
 
    #get prediction
    pred = results.get_prediction(start=pd.to_datetime(start), end=pd.to_datetime(end), dynamic=False)
    
    #calculate rmse
    y_forecasted = pred.predicted_mean
    y_truth = y['2021-01-15':]
    mse = ((y_forecasted - y_truth) ** 2).mean()
    sum_mem_usage_mse= sum_mem_usage_mse + mse
    sum_mem_usage_rmse=sum_mem_usage_rmse +(round(np.sqrt(mse), 2))
    
    #calculate median absolute error
    sum_mem_median_ae=sum_mem_median_ae+(median_absolute_error(y_truth, y_forecasted))
    
    #calculate mean absolute error
    sum_mem_mean_ae=sum_mem_mean_ae+(mean_absolute_error(y_truth, y_forecasted))
    
    #get forecast
    forecast = results.get_forecast(steps=400)

    #create dictionary
    myobj2 = {'cluster_name': df1['pod_name'].iloc[0], 'observed': y.to_json(), 'forecast': forecast.predicted_mean.to_json()}
    dict2[df1['pod_name'].iloc[0]]=myobj2
print("Average MSE for memory_usage_node: ", sum_mem_usage_mse/uniquePodNames.size)
print("Average RMSE for memory_usage_node: ", sum_mem_usage_rmse/uniquePodNames.size)
print("Average Median Absolute Error for memory_usage_node: ", sum_mem_median_ae/uniquePodNames.size)
print("Average Mean Absolute Error for memory_usage_node: ", sum_mem_mean_ae/uniquePodNames.size)
#post data to node.js
x2 = requests.post(url2, json = dict2)
#print response from node.js
print(x2.text)