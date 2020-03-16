// app.js
const express = require("express"),
     app = express();
     http = require('http').createServer(app),
     port = 8000;
	 
var path = require('path');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/views"));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const routes = require("./router/");
app.use(routes);