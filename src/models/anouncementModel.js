let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let anouncementSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    file:{type:String},
    teacherId:{type:ObjectId,ref:"Teacher"},
    date:{type:Date}
  },
  { timestamps: true })
module.exports = mongoose.model('Anouncement', anouncementSchema)