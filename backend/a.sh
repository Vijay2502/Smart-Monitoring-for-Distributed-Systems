#!/bin/sh
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

chmod 777 ./kubectl

export PATH=$PATH:/usr/src/backend

nodemon index.js
