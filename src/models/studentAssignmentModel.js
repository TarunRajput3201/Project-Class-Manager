let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let StudentAssignmentSchema = new mongoose.Schema({
  uploadFile: { type: String },
  comment: { type: String, trim: true },
  userId: { type: ObjectId, ref: "User" },
  assignmentId: { type: ObjectId, ref: "Teacher-Assignment" },
  dateOfSubmission: { type: Date }
},
  { timestamps: true })
module.exports = mongoose.model('Student-Assignment', StudentAssignmentSchema)