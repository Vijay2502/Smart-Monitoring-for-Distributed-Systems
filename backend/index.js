var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();

const { PORT, APP_URL } = process.env;
console.log(PORT);

//use cors to allow cross origin resource sharing
app.use(cors({ origin: APP_URL, credentials: true }));

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', APP_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use(express.json());



// REQUIRE 

const project = require('./actions/project');

app.get('/getFiles/:id', project.getFiles);
app.get('/getProjects', project.getProjects);
app.post('/postSample', project.samplePostRoute);


// Kube APIs

const kube = require('./actions/kubeAPIs');

app.get('/getNamespaces', kube.getNamespaces);
app.get('/getPods', kube.getPods);
app.get('/getDeployments', kube.getDeployments);
app.get('/getServices', kube.getServices);



//start your server on port 3001
app.listen(PORT, () => console.log(`Backend Server Listening on port ${PORT}`));

module.exports = app;