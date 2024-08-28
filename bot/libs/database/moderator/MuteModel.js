const mongodb = require('mongoose');

module.exports = mongodb.model('mutemodel', new mongodb.Schema({
    userID: { type: String, required: true },
    executor: { type: String, required: true },
    reason: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    end: { type: Date, required: true },
    active: { type: Boolean, required: true, default: true },
})
);