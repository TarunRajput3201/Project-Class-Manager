let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let anouncementSchema = new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    file:{type:String},
    userId:{type:ObjectId,ref:"Teacher"},
    date:{type:Date},
    isDeleted:{type:Boolean,default:false}
  },
  { timestamps: true })
module.exports = mongoose.model('Anouncement', anouncementSchema)