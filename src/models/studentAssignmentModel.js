let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let StudentAssignmentSchema = new mongoose.Schema({
     file:{type:String,required:true},
     comment:{type:String},
     userId:{type:ObjectId,ref:"User"},
     dateOfSubmission:{type:Date}
  },
  { timestamps: true })
module.exports = mongoose.model('Student-Assignment', StudentAssignmentSchema)