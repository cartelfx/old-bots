const mongodb = require('mongoose');

module.exports = mongodb.model('TimeModel', new mongodb.Schema({
  guildID: String,
  Day: { type: Number, default: 1 },
  NextUpdate: { type: Number, default: new Date().setHours(24, 0, 0, 0) }
})
);