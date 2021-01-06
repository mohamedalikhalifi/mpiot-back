const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  firstName: {type:String , requied: true},
  lastName: {type: String ,requied:true},
  access: {type: Boolean},
  dateCreated: {type: String},
  imagePath:{type:String,requied:true}
})


module.exports = mongoose.model('User', userSchema)
