let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let teacherAssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  uploadFile: { type: String ,required: true},
  userId: { type: ObjectId, ref: "User" },
  deadline: { type: Date, required: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }

},
  { timestamps: true })
module.exports = mongoose.model('Teacher-Assignment', teacherAssignmentSchema)