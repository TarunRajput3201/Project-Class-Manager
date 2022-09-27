let mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId
let notesSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    file:{type:String},
    userId:{type:ObjectId,ref:"User"}

  },
  { timestamps: true })
module.exports = mongoose.model('Note', notesSchema)