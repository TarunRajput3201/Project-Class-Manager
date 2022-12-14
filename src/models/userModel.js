let mongoose = require("mongoose")
let userSchema = new mongoose.Schema({
  fname: { type: String, required: true, trim: true },
  lname: { type: String, required: true, trim: true },
  registerAs: { type: String ,enum:["Teacher","Student"] },
  email: { type: String, required: true, unique: true, trim: true },
  profileImage: { type: String,required: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true }
},
  { timestamps: true })
module.exports = mongoose.model('User', userSchema)