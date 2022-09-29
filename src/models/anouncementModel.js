let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let anouncementSchema = new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    uploadFile:{type:String},
    userId:{type:ObjectId,ref:"User"},
    date:{type:Date},
    isDeleted:{type:Boolean,default:false},
    deletedAt:{type:Date}
  },
  { timestamps: true })
module.exports = mongoose.model('Anouncement', anouncementSchema)