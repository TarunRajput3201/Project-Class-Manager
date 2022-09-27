let mongoose = require("mongoose")
let StudentAssignmentSchema = new mongoose.Schema({
     
  },
  { timestamps: true })
module.exports = mongoose.model('Student-Assignment', StudentAssignmentSchema)