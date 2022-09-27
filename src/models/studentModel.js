let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let studentSchema = new mongoose.Schema({
  fname: { type: String, required: true, trim: true },
  lname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  profileImage: { type: String, required: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  teacherId:{type:ObjectId,ref:"Teacher"}
  },
  { timestamps: true })
module.exports = mongoose.model('Student', studentSchema)