#!/bin/bash
sed -i -e 's~#COPY mount/app /~COPY mount/app /~' Dockerfile
docker build -t cityflowsacr.azurecr.io/cityflows-ui-frontend:0.2.7 .
docker push cityflowsacr.azurecr.io/cityflows-ui-frontend:0.2.7
sed -i -e 's~COPY mount/app /~#COPY mount/app /~' Dockerfile
