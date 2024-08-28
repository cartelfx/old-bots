const mongodb = require('mongoose');

module.exports = mongodb.model('usermodel', new mongodb.Schema({
    userID: { type: String, required: true },
    username: { type: String },
    names: { type: Array, default: [] } ,
    registers: { type: Array, default: [] },
    registrations: { type: Array, default: [] },
})
  )