#Application - Memory
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
rcParams['figure.figsize'] = 18, 8
matplotlib.rcParams['axes.labelsize'] = 14
matplotlib.rcParams['xtick.labelsize'] = 12
matplotlib.rcParams['ytick.labelsize'] = 12
matplotlib.rcParams['text.color'] = 'k'
import pymongo
from pymongo import MongoClient
from sklearn.metrics import median_absolute_error
from sklearn.metrics import mean_absolute_error

url2 = 'http://localhost:3001/postApplicationMem'

#mongo connection
client = pymongo.MongoClient("mongodb+srv://ayu:ayuadmin@cluster0.bmlds.mongodb.net/application-data?retryWrites=true&w=majority")

mydb = client["application-data"]
mycol = mydb["sysData"]
df = pd.DataFrame(list(mycol.find()))
df['date'] = pd.to_datetime(df['date'], errors='coerce')
df['date'] = df['date'].dt.floor('Min')

dict2={}
uniqueAppNames = df['app_name'].unique()
sum_mem_usage_mse=0
sum_mem_usage_rmse=0
sum_mem_median_ae=0
sum_mem_mean_ae=0
for key in uniqueAppNames:
    df1 = df[df['app_name'] == key]
    start=df1['date'].iloc[0]
    end=df1['date'].iloc[df1.shape[0]-1]
    y = df1.set_index('date')
    df1.index = pd.DatetimeIndex(df1.index)
    y = y['mem_usage']
    y.sort_index(inplace= True)
    y.index = pd.DatetimeIndex(y.index.values,
                               freq=y.index.inferred_freq)
    

    decomposition = sm.tsa.seasonal_decompose(y, model='additive', period = 3)
    p = d = q = range(0, 2)
    pdq = list(itertools.product(p, d, q))
    seasonal_pdq = [(x[0], x[1], x[2], 12) for x in list(itertools.product(p, d, q))]
    min=100000000
    for param in pdq:
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
    mod = sm.tsa.statespace.SARIMAX(y,
                                order=param_selected,
                                seasonal_order=param_seasonal_selected,
                                enforce_stationarity=False,
                                enforce_invertibility=False)
    #fit model
    results = mod.fit()
 
    #get prediction
    pred = results.get_prediction(start=pd.to_datetime(start), end=pd.to_datetime(end), dynamic=False)
    
    #calculate rmse
    y_forecasted = pred.predicted_mean
    y_truth = y['2017-01-15':]
    mse = ((y_forecasted - y_truth) ** 2).mean()
    sum_mem_usage_mse= sum_mem_usage_mse + mse
    sum_mem_usage_rmse=sum_mem_usage_rmse +(round(np.sqrt(mse), 2))
    
    #calculate median absolute error
    sum_mem_median_ae=sum_mem_median_ae+(median_absolute_error(y_truth, y_forecasted))
    
    #calculate mean absolute error
    sum_mem_mean_ae=sum_mem_mean_ae+(mean_absolute_error(y_truth, y_forecasted))
    
    #get forecast
    pred_uc = results.get_forecast(steps=200)

    #create dictionary
    myobj2 = {'application_name': df1['app_name'].iloc[0], 'observed': y.to_json(), 'forecast': pred_uc.predicted_mean.to_json()}
    dict2[df1['app_name'].iloc[0]]=myobj2

print("Average MSE for memory_usage_application: ", sum_mem_usage_mse/uniqueAppNames.size)
print("Average RMSE for memory_usage_application: ", sum_mem_usage_rmse/uniqueAppNames.size)
print("Average Median Absolute Error for memory_usage_application: ", sum_mem_median_ae/uniqueAppNames.size)
print("Average Mean Absolute Error for memory_usage_application: ", sum_mem_mean_ae/uniqueAppNames.size)

#post data to node.js
x2 = requests.post(url2, json = dict2)
#print response from node.js
print(x2.text)