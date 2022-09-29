let mongoose = require("mongoose")
let userSchema = new mongoose.Schema({
  fname: { type: String, required: true, trim: true },
  lname: { type: String, required: true, trim: true },
  areYouTeacherOrStudent: { type: String },
  email: { type: String, required: true, unique: true, trim: true },
  profileImage: { type: String},
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true }
},
  { timestamps: true })
module.exports = mongoose.model('User', userSchema)