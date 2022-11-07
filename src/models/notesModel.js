let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let notesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  uploadFile: { type: String ,required: true},
  userId: { type: ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
},
  { timestamps: true })
module.exports = mongoose.model('Note', notesSchema)