FROM  ubuntu

RUN apt update
RUN apt install nodejs -y

RUN nodejs -v

RUN apt install npm -y

WORKDIR /usr/src/backend


COPY . .

COPY package*.json ./

RUN npm install
RUN npm install nodemon -g
RUN apt install curl -y
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-sdk -y
RUN gcloud auth activate-service-account --key-file=key.json

EXPOSE 3001
CMD ["./a.sh"]