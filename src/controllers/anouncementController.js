const anouncementModel = require("../models/anouncementModel")

let createAnouncement=async function(req,res){
    try{
        let bodyData = req.body
        let userId = req.params.userId

        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }
        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == Student) { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }
        let { title, description, date } = bodyData
        let dataToBeCreated = {}
        if (validateRequest(bodyData)) { return res.status(400).send({ status: false, message: "please provide the data in the body" }) }
        if (!validateString(title)) { return res.status(400).send({ status: false, message: "title is required" }) }
        else { dataToBeCreated.title = title }
        if (!validateString(description)) { return res.status(400).send({ status: false, message: "description is required" }) }
        else { dataToBeCreated.description = description }
       
        dataToBeCreated.userId=userId

        let file = req.files;
        if (file && file.length > 0) {
            if (!imageExtValidator(file[0].originalname)) { return res.status(400).send({ status: false, message: "only image file is allowed" }) }
            let uploadedFileURL = await uploadFile(file[0]);
            dataToBeCreated.uploadFile = uploadedFileURL
        } else {
            return res.status(400).send({ status: false, message: "please provide profile image " });
        }
        if (!validateString(deadline)) { return res.status(400).send({ status: false, message: "deadline is required" }) }
        if (!anouncementModel.date instanceof Date) {
            return res.status(400).send({ status: false, message: `please provide a valid date format like "2002-12-09T00:00:00.000Z" or "2002-12-09"` })
        }
        else { dataToBeCreated.date = date }

        let anouncement = await anouncementModel.create(dataToBeCreated)

        res.status(201).send({ status: true, msg: "assignment created succesfully", data: anouncement })
    }
    catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
    
}
let getAnouncements=async function(req,res){
    try{
        let userId = req.params.userId
        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }

        let anouncements = await anouncementModel.find({ userId: userId, isDeleted: false })
        if (anouncements.length == 0) { return res.status(404).send({ status: false, msg: "there is no assignment with this userid or deleted" }) }
        res.status(200).send({ status: true, data: anouncements })
    }
    catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
    
}
let getAnouncementsByQuery=async function(req,res){
    try{

    }
    catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
    
}
let updateAnouncement=async function(req,res){
    try{
        let userId = req.params.userId
        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }

        let anouncementId = req.params.anouncementId
        if (!mongoose.isValidObjectId(anouncementId)) { return res.status(400).send({ status: false, msg: "pleade provide valid anouncementId" }) }

        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == Student) { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }

        let bodyData = req.body
        let { title, description, date } = bodyData

        let anouncement = await anouncementModel.findById(anouncementId)

        if (bodyData.hasOwnProperty("title")) {
            if (validateString(title)) {

                anouncement.title = title
            }
        }
        if (bodyData.hasOwnProperty("description")) {
            if (validateString(description)) {

                anouncement.description = description
            }
        }
        let file = req.files;
        if (file && file.length > 0) {
            if (!imageExtValidator(file[0].originalname)) { return res.status(400).send({ status: false, message: "only image file is allowed" }) }
            let uploadedFileURL = await uploadFile(file[0]);
            dataToBeCreated.uploadFile = uploadedFileURL
        }
        if (bodyData.hasOwnProperty("date")) {
            if (validateString(date)) {
                if(anouncementModel.date instanceof Date) {
                   
                anouncement.date = date
            }}
        }
        anouncement.save()
        res.status(200).send({ status: true, msg: "data updated successfully", data: anouncement })


    }
    catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
    
}
let deleteAnouncement=async function(req,res){
    try{
        let userId = req.params.userId
        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }

        let anouncementId = req.params.anouncementId
        if (!mongoose.isValidObjectId(anouncementId)) { return res.status(400).send({ status: false, msg: "pleade provide valid anouncementId" }) }

        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == Student) { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }

        let teacherAssignment = await teacherAssignmentModel.findOneAndUpdate({ _id: anouncementId, isDeleted: false },{ $set: { isDeleted: true, deletedAt: new Date } })
        if (!teacherAssignment) { return res.status(403).send({ status: false, msg: "this assignment is already deleted or doesnot exist" }) }
        
        res.status(200).send({ status: true, msg: "data deleted successfully"})
    }
    catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
    
}
module.exports={ createAnouncement, getAnouncements, updateAnouncement,deleteAnouncement,getAnouncementsByQuery } 