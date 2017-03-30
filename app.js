#!/usr/bin/env node
var express = require('express');
var path = require('path');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var util = require("util");
var bcrypt = require("bcrypt-nodejs");

var bcrypt = require("bcrypt-nodejs");
var hash = bcrypt.hashSync("amyspassword");
console.log(`amypassword hashed = ${hash}`);
var users = {
  amy : hash,
  juan : bcrypt.hashSync("juanpassword"),
  antonio : bcrypt.hashSync("antoniopassword")
};


///////////////////////////////7


var layout = function(x) { return x+"<br />"; };

app.use(cookieParser());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
  console.log("Cookies :  "+util.inspect(req.cookies));
  console.log("session :  "+util.inspect(req.session));
  next();
});

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user in users)
    return next();
  else
    return res.sendStatus(401); // https://httpstatuses.com/401
};

// Login endpoint
app.get('/login', function (req, res) {
  console.log(req.query);
  if (!req.query.username || !req.query.password) {
    console.log('login failed');
    res.send('login failed');
  } else if(req.query.username in users  &&
            bcrypt.compareSync(req.query.password, users[req.query.username])) {
    req.session.user = req.query.username;
    req.session.admin = true;
    res.send(layout("login success! user "+req.session.user));
  } else {
    console.log(`login ${util.inspect(req.query)} failed`);
    res.send(layout(`login ${util.inspect(req.query)} failed. You are ${req.session.user || 'not logged'}`));
  }
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send(layout("logout success!"));
});

// Get content endpoint
app.get('/content/*?',
    auth  // next only if authenticated
);

app.use('/content', express.static(path.join(__dirname, 'public')));

//////



app. get ('/app', function (pet, res){
  res.sendFile(__dirname + '/public/topDown/index.html')

});
app.set('port', (process.env.PORT || 8080));


app.get('/book', function(pet, res){
  res.sendFile(__dirname + '/public/book/index.html');
  //res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(path.resolve('public/book')));
app.listen(app.get('port'));
