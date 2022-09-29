const studentAssignmentModel = require("../models/studentAssignmentModel")

let submitAssignment=async function(req,res){
     try{
        let bodyData = req.body
        let userId = req.params.userId
        let assignmentId = req.params.assignmentId
      
        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid user id" }) }
        if (!mongoose.isValidObjectId(assignmentId)) { return res.status(400).send({ status: false, msg: "pleade provide valid assignment id" }) }
        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == Student) { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }
        let { comment, dateOfSubmission } = bodyData
        let dataToBeCreated = {}
        let file = req.files;
        if (file && file.length > 0) {
            if (!imageExtValidator(file[0].originalname)) { return res.status(400).send({ status: false, message: "only image file is allowed" }) }
            let uploadedFileURL = await uploadFile(file[0]);
            dataToBeCreated.uploadFile = uploadedFileURL
        } else {
            return res.status(400).send({ status: false, message: "please upload file " });
        }
        
        if (validateRequest(bodyData)) { return res.status(400).send({ status: false, message: "please provide the data in the body" }) }
        
        
        if (bodyData.hasOwnProperty("comment")) {
            if (validateString(comment)) {
                dataToBeCreated.comment = comment 
            }
        }
        
        
        dataToBeCreated.userId=userId

        
        dataToBeCreated.assignmentId=assignmentId

       
        if (!validateString(dateOfSubmission)) { return res.status(400).send({ status: false, message: "dateOfSubmission is required" }) }
        if (!studentAssignmentModel.dateOfSubmission instanceof Date) {
            return res.status(400).send({ status: false, message: `please provide a valid date format like "2002-12-09T00:00:00.000Z" or "2002-12-09"` })
        }
        else { dataToBeCreated.dateOfSubmission = dateOfSubmission }

        let assignmentSubmission = await studentAssignmentModel.create(dataToBeCreated)

        res.status(201).send({ status: true, msg: "assignment sumitted succesfully", data: assignmentSubmission })
     }
     catch (error) {
        return res.status(500).send({ status: false, message: error.message })
     }
    
}
let getSubmittedAssignments=async function(req,res){
    try{

    }
    catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
    
}
let updateSubmittedAssignment=async function(req,res){
    try{

    }
    catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
    
}
module.exports={ submitAssignment, getSubmittedAssignments, updateSubmittedAssignment }