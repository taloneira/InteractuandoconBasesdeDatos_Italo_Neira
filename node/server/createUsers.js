/**
 ** @author Daniel Marcano <danielmarcanodev@gmail.com>
 **/

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    User = require('./models').User,
    EventModel = require('./models').EventModel,
    passwordHash = require('password-hash');

var connection = mongoose.createConnection('mongodb://localhost/NodeJSCalendar');

var hashedPassword = passwordHash.generate('soyelmejor');

var newUser = new User({
  username: 'danielmarcanodev@gmail.com',
  password: hashedPassword
});

newUser.save(function(err) {
  if (err) {
    console.log('The user could not be saved...');
  } else {
    console.log('The user was successfully saved!');    
  }
  connection.close();
});
