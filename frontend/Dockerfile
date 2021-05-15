FROM  ubuntu

RUN apt update
RUN apt install nodejs -y

RUN nodejs -v

RUN apt install npm -y

WORKDIR /usr/src/frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]