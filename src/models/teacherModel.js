let mongoose = require("mongoose")
let teacherSchema = new mongoose.Schema({
  fname: { type: String, required: true, trim: true },
  lname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  profileImage: { type: String, required: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true }
  },
  { timestamps: true })
module.exports = mongoose.model('Teacher', teacherSchema)