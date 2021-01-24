const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  userId: {type:String , required: true},
  firstName: {type: String},
  lastName: {type: String},
  access:{ type: String},
  date: {type: String},
})

module.exports = mongoose.model('Event', eventSchema)
