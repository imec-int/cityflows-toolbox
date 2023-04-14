# CityFlows UI Frontend

This is the Frontend part of the cityflows toolbox. It works together with [cityflows-toolbox-backend](https://github.com/imec-int/cityflows-toolbox-backend).

More info on running and deploying the application can be found in [this readme](/mount/app/README.md)


# Necessary environment variables (and examples where relevant) to run:

REACT_APP_BACKEND_URL=https://some_url_here/

REACT_APP_OAUTH_CLIENT_ID:string

REACT_APP_OAUTH_CLIENT_SECRET:string

REACT_APP_INITIAL_MAP_CONFIG_JSON={"center":[51.003543,3.708080],"zoom":14}

REACT_APP_INITIAL_TIME_WINDOWS=[{"from":"2021-09-01T00:00:00.000Z","to":"2021-09-22T00:00:00.000Z","Monday":true,"Tuesday":true,"Wednesday":true,"Thursday":true,"Friday":true,"Saturday":false,"Sunday":false,"Holiday":true,"Non-holiday":true,"DBSCAN":true,"MinThreshold":true,"PerformanceThreshold":true},{"from":"2021-10-01T00:00:00.000Z","to":"2021-11-01T00:00:00.000Z","Monday":true,"Tuesday":true,"Wednesday":true,"Thursday":true,"Friday":true,"Saturday":false,"Sunday":false,"Holiday":true,"Non-holiday":true,"DBSCAN":true,"MinThreshold":true,"PerformanceThreshold":true}]