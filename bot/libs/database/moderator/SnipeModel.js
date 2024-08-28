const mongodb = require('mongoose');

module.exports = mongodb.model('snipemodel', new mongodb.Schema({
    userID: String,
    channelID: String,
    attachment: String,
    content: String,
    timestamp: Date
}))