let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let teacherAssignmentSchema = new mongoose.Schema({
     name:{type:String,required:true},
     description:{type:String,required:true},
     file:{type:String},
     teacherId:{type:ObjectId,ref:"Teacher"},
     deadline:{type:Date,required:true}
  },
  { timestamps: true })
module.exports = mongoose.model('Teacher-Assignment', teacherAssignmentSchema)