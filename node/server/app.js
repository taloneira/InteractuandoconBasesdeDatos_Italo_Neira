var express = require('express');
var app = express();
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var Router = require('./Router').Router;
var session = require('express-session');

mongoose.createConnection('mongodb://localhost/NodeJSCalendar');

app.use(session({
  secret: 'my secret',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}))
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended: true}))
.use(express.static('client'))
.use('/', Router);

app.listen('8080', function() {
  console.log('Server is running on PORT 8080');
});
