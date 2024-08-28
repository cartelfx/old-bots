const mongodb = require('mongoose');

module.exports = mongodb.model('penaltiesmoel', mongodb.Schema({
    number: { type: String },
    userID: { type: String },
    executor: { type: String },
    type: { type: String },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now },
    end: { type: Date },
    active: { type: Boolean, default: true }
}))