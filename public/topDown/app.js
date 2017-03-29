#!/usr/bin/env node
var express = require('express');
var path = require('path');
var port_iaas = 8080;
var app = express();

app.set('port', (process.env.PORT || 8080));

app.get('/', function(pet, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(path.resolve('public')));

app.listen(app.get('port'));
