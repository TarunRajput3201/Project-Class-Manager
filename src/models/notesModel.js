let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let notesSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    file:{type:String},
    userId:{type:ObjectId,ref:"Teacher"},
    isDeleted:{type:Boolean,default:false}
  },
  { timestamps: true })
module.exports = mongoose.model('Note', notesSchema)