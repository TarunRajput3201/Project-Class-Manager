let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let teacherAssignmentSchema = new mongoose.Schema({
     title:{type:String,required:true,trim:true},
     description:{type:String,required:true,trim:true},
     file:{type:String,required:true},
     userId:{type:ObjectId,ref:"Teacher"},
     deadline:{type:Date,required:true},
     isDeleted:{type:Boolean,default:false}

  },
  { timestamps: true })
module.exports = mongoose.model('Teacher-Assignment', teacherAssignmentSchema)