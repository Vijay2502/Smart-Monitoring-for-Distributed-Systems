#!pip install dnspython
#!pip install pymongo
import warnings
import itertools
import numpy as np
import matplotlib.pyplot as plt
warnings.filterwarnings("ignore")
plt.style.use('fivethirtyeight')
import pandas as pd
import statsmodels.api as sm
import matplotlib
from pandas import DataFrame
matplotlib.rcParams['axes.labelsize'] = 14
matplotlib.rcParams['xtick.labelsize'] = 12
matplotlib.rcParams['ytick.labelsize'] = 12
matplotlib.rcParams['text.color'] = 'k'
import pymongo
from pymongo import MongoClient
client = pymongo.MongoClient("mongodb+srv://ayu:ayuadmin@cluster0.bmlds.mongodb.net/application-data?retryWrites=true&w=majority")
mydb = client["application-data"]
mycol = mydb["app"]
df = pd.DataFrame(list(mycol.find()))
df['date'] = pd.to_datetime(df['date'], errors='coerce')
df['date'] = df['date'].dt.floor('Min')
import requests
url = 'http://localhost:3001/postPythonData'
dict={}
uniquePodNames = df['pod_name'].unique()
for key in uniquePodNames:
    df1 = df[df['pod_name'] == key]
    df1.plot(x='date', y='cpu_usage', figsize=(50, 6), kind='line')
    from datetime import timedelta
    plt.show()
    start=df1['date'].iloc[0]
    end=df1['date'].iloc[df1.shape[0]-1]
    newdf = df1.set_index('date')
    df1.index = pd.DatetimeIndex(df1.index)
    #.to_period('M')
    #print(newdf.index)
    y = newdf['cpu_usage']
    y.sort_index(inplace= True)
    y.index = pd.DatetimeIndex(y.index.values,
                               freq=y.index.inferred_freq)
    
    from pylab import rcParams
    rcParams['figure.figsize'] = 18, 8
    decomposition = sm.tsa.seasonal_decompose(y, model='additive', period = 4)
    fig = decomposition.plot()
    plt.show()
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
                #print('ARIMA{}x{}12 - AIC:{}'.format(param, param_seasonal, results.aic))
            except:
                continue
    print(param_selected)
    print(param_seasonal_selected)
    print(min)
    mod = sm.tsa.statespace.SARIMAX(y,
                                order=param_selected,
                                seasonal_order=param_seasonal_selected,
                                enforce_stationarity=False,
                                enforce_invertibility=False)
    results = mod.fit()
    #get prediction
    pred = results.get_prediction(start=pd.to_datetime(start), end=pd.to_datetime(end), dynamic=False)
    print(pred)
    #plot prediction
    ax = y['2021':].plot(label='observed')
    pred.predicted_mean.plot(ax=ax, label='One-step ahead Forecast', alpha=.7, figsize=(14, 7))
    plt.show()
    #rmse
    y_forecasted = pred.predicted_mean
    y_truth = y['2017-01-15':]
    mse = ((y_forecasted - y_truth) ** 2).mean()
    print(mse)
    print((round(np.sqrt(mse), 2)))
    
    #get forecast
    pred_uc = results.get_forecast(steps=200)
    print("forecast", pred_uc.predicted_mean)
    print("observed", y)
    #plot forecast
    ax = y.plot(label='observed', figsize=(14, 7))
    pred_uc.predicted_mean.plot(ax=ax, label='Forecast')
    plt.legend()
    plt.show()
    #create dict
    myobj = {'cluster_name': df1['pod_name'].iloc[0], 'observed': y.to_json(), 'forecast': pred_uc.predicted_mean.to_json()}
    dict[df1['pod_name'].iloc[0]]=myobj

x = requests.post(url, json = dict)

print(x.text)