const mongodb = require('mongoose');

module.exports = mongodb.model('afkmodel', new mongodb.Schema({
    userID: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    reason: { type: String },
}))