/**
 ** @author Daniel Marcano <danielmarcanodev@gmail.com>
 **/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    connection = mongoose.createConnection('mongodb://localhost/NodeJSCalendar');

autoIncrement.initialize(connection);

/*
 * The user's model
 */

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    startAt: 0
});

exports.User = connection.model('User', UserSchema);


/*
 * The event's model
 */

var EventSchema = new Schema({
  userId: {
    type: Number,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  startHour: String,
  endDate: String,
  endHour: String,
  fullDay: {
    type: Boolean,
    required: true
  }
});

EventSchema.plugin(autoIncrement.plugin, {
  model: 'Event',
  startAt: 0
});

exports.EventModel = connection.model('Event', EventSchema);
