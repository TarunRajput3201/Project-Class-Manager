let mongoose = require("mongoose")
let teacherAssignmentSchema = new mongoose.Schema({
     name:{type:String,required:true},
     description:{type:String,required:true},
     deadline:{type:Date,required:true}
  },
  { timestamps: true })
module.exports = mongoose.model('Teacher-Assignment', teacherAssignmentSchema)