const anouncementModel = require("../models/anouncementModel")
let userModel = require("../models/userModel")
let { validateString, validateRequest, isValidObjectId } = require("../validator/validations")
let { uploadFile } = require("../controllers/awsController")
let moment = require("moment")
let createAnouncement = async function (req, res) {
    try {
        let bodyData = req.body
        let userId = req.params.userId

        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }
        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == 'Student') { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }
        let { title, description, date } = bodyData
        let dataToBeCreated = {}
        if (validateRequest(bodyData)) { return res.status(400).send({ status: false, message: "please provide the data in the body" }) }
        if (!validateString(title)) { return res.status(400).send({ status: false, message: "title is required" }) }
        else { dataToBeCreated.title = title }
        if (!validateString(description)) { return res.status(400).send({ status: false, message: "description is required" }) }
        else { dataToBeCreated.description = description }

        dataToBeCreated.userId = userId

        let file = req.files;
        if (file && file.length > 0) {
            let uploadedFileURL = await uploadFile(file[0]);
            dataToBeCreated.uploadFile = uploadedFileURL
        }
        // else {
        //     return res.status(400).send({ status: false, message: "please upload file :file upload is mandatory"  });
        // }
        dataToBeCreated.date = new Date

        let anouncement = await anouncementModel.create(dataToBeCreated)

        res.status(201).send({ status: true, msg: "assignment created succesfully", data: anouncement })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
let getAnouncements = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }

        let anouncements = await anouncementModel.find({ userId: userId, isDeleted: false })
        if (anouncements.length == 0) { return res.status(404).send({ status: false, msg: "there is no assignment with this userid or deleted" }) }
        res.status(200).send({ status: true, data: anouncements })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
let getAnouncementsByQuery = async function (req, res) {
    try {
        let queryData = req.query
        let { title, description, userId } = queryData
        getFilter = Object.keys(queryData)
        if (getFilter.length) {
            for (let value of getFilter) {
                if (['title', 'description', 'userId'].indexOf(value) == -1)
                    return res.status(400).send({ status: false, message: `You can't filter Using '${value}' ` })
            }
        }
        let queryObj = { isDeleted: false }
        let anouncements = await anouncementModel.find(queryObj).lean()

        if (queryData.hasOwnProperty("title")) {
            if (validateString(title)) {

                anouncements = anouncements.filter(anouncements => anouncements.title.includes(title)).map(assign => assign)
            }
        }



        if (queryData.hasOwnProperty("description")) {
            if (validateString(description)) {
                anouncements = anouncements.filter(anouncements => anouncements.description.includes(description)).map(assign => assign)
            }
        }
        if (queryData.hasOwnProperty("userId")) {
            if (validateString(userId)) {
                if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }
                anouncements = anouncements.filter(anouncements => anouncements.userId == userId).map(assign => assign)
            }
        }


        res.status(200).send({ status: true, data: anouncements })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
let updateAnouncement = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }

        let anouncementId = req.params.anouncementId
        if (!isValidObjectId(anouncementId)) { return res.status(400).send({ status: false, msg: "pleade provide valid anouncementId" }) }

        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == "Student") { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }

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
        anouncement.date = new Date
        anouncement.save()
        res.status(200).send({ status: true, msg: "data updated successfully", data: anouncement })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
let deleteAnouncement = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }

        let anouncementId = req.params.anouncementId
        if (!isValidObjectId(anouncementId)) { return res.status(400).send({ status: false, msg: "pleade provide valid anouncementId" }) }

        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == "Student") { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }

        let teacherAssignment = await teacherAssignmentModel.findOneAndUpdate({ _id: anouncementId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date } })
        if (!teacherAssignment) { return res.status(403).send({ status: false, msg: "this assignment is already deleted or doesnot exist" }) }

        res.status(200).send({ status: true, msg: "data deleted successfully" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
module.exports = { createAnouncement, getAnouncements, updateAnouncement, deleteAnouncement, getAnouncementsByQuery } 