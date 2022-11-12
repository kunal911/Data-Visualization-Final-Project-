import pandas as pd
import json
import urllib3
from time import sleep
import numpy as np
http = urllib3.PoolManager()

col_data = pd.DataFrame()
mat_data = pd.DataFrame()
periods = ["1","2"]
pages = ["1","2","3","4","5"]


leagueId="8048"
eventId=""

dat_url = pd.read_csv("./IPL_Matches_2022.csv")
balls = pd.read_csv("./IPL_Ball_by_Ball_2022.csv")
eventId_gp= dat_url['ID']
len_url= len(eventId_gp)

dataframe = pd.DataFrame()
updated_data = pd.DataFrame()
for count in range(len_url):
    eventId = str(eventId_gp[count])
    print(count)
    for period in periods:
        print("period ",period)
        match_frame = balls[(balls['ID']==eventId_gp[count]) & (balls['innings'] == int(period))].copy()
        match_frame.loc[:,['text']] = np.NaN
        for page in pages:
            print("page ",page)
            sleep(25)
            col_data = pd.DataFrame()
            match_dat= http.request('GET', 'https://hsapi.espncricinfo.com/v1/pages/match/comments?lang=en&leagueId='+leagueId+'&eventId='+eventId+'&period=' +period+ '&page='+page+'&filter=full&liveTest=false')
            data = json.loads(match_dat.data)
            try:
              df = pd.json_normalize(data['comments'])
            except:
              sleep(20)
              match_dat= http.request('GET', 'https://hsapi.espncricinfo.com/v1/pages/match/comments?lang=en&leagueId='+leagueId+'&eventId='+eventId+'&period=' +period+ '&page='+page+'&filter=full&liveTest=false')
              data = json.loads(match_dat.data)
              df = pd.json_normalize(data['comments'])
            if len(data['comments']) !=0:
              df_new = df[::-1]
              dataframe = dataframe.append(df_new[['ball','over','text']])
        print("length of scrapped: ",len(dataframe))
        print("length from csv ",len(match_frame))
        match_frame.iloc[:len(dataframe),17] = dataframe.loc[:,'text'].values
        updated_data = updated_data.append(match_frame)
        dataframe = pd.DataFrame()
print(updated_data)
updated_data.to_csv("IPL_Ball_by_Ball_2022.csv")