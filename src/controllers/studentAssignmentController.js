const userModel = require("../models/userModel")
const studentAssignmentModel = require("../models/studentAssignmentModel")
const teacherAssignmentModel = require("../models/teacherAssignmentModel")
let { validateString, validateRequest, isValidObjectId } = require("../validator/validations")
let { uploadFile } = require("../controllers/awsController")
let submitAssignment = async function (req, res) {
    try {
        let bodyData = req.body
        let userId = req.params.userId
        let assignmentId = req.params.assignmentId

        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid user id" }) }
        if (!isValidObjectId(assignmentId)) { return res.status(400).send({ status: false, msg: "pleade provide valid assignment id" }) }
        let assignment = await teacherAssignmentModel.findOne({ _id: assignmentId, isDeleted: false })
        if (!assignment) { return res.status(404).send({ status: false, msg: "there is no assignment with this teacher assignmentId" }) }
        let { comment, dateOfSubmission } = bodyData
        let dataToBeCreated = {}
        let file = req.files;
        if (file && file.length > 0) {
            let uploadedFileURL = await uploadFile(file[0]);
            dataToBeCreated.uploadFile = uploadedFileURL
        }
        // else {
        //     return res.status(400).send({ status: false, message:"please upload file :file upload is mandatory"  });
        // }

        if (validateRequest(bodyData)) { return res.status(400).send({ status: false, message: "please provide the data in the body" }) }


        {
            if (validateString(comment)) {
                dataToBeCreated.comment = comment
            }
        }


        dataToBeCreated.userId = userId


        dataToBeCreated.assignmentId = assignmentId


        dataToBeCreated.dateOfSubmission = new Date
        dateOfSubmission = Date.now()
        if (dateOfSubmission > assignment.deadline) {
            return res.status(400).send({ status: false, message: "deadline is over" })
        }

        let assignmentSubmission = await studentAssignmentModel.create(dataToBeCreated)

        res.status(201).send({ status: true, msg: "assignment sumitted succesfully", data: assignmentSubmission })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
let getSubmittedAssignments = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid user id" }) }
        let assignments = await studentAssignmentModel.find({ _id: userId })
        if (assignments.length == 0) { return res.status(404).send({ status: false, msg: "there is no assignment submitted with this userId" }) }
        res.status(200).send({ status: true, msg: "submitted assignments", data: assignments })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

let getAllStudentAssignments = async function (req, res) {
    try {

        let userId = req.params.userId
        let assignmentId = req.params.assignmentId

        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid user id" }) }
        if (!isValidObjectId(assignmentId)) { return res.status(400).send({ status: false, msg: "pleade provide valid assignment id" }) }

        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == "Student") { return res.status(403).send({ status: false, msg: "students are not authorized to get all student assignments" }) }
        let studentAssignments = await studentAssignmentModel.find({ assignmentId: assignmentId }).populate("userId")
        res.status(200).send({ status: true, msg: "student assignments", data: studentAssignments })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
let updateSubmittedAssignment = async function (req, res) {
    try {
        let userId = req.params.userId
        let assignmentId = req.params.studentAssignmentId

        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid user id" }) }
        if (!isValidObjectId(assignmentId)) { return res.status(400).send({ status: false, msg: "pleade provide valid assignment id" }) }
        let { comment, dateOfSubmission } = bodyData
        let assignment = await studentAssignmentModel.findById(assignmentId)

        let file = req.files;
        if (file && file.length > 0) {
            if (!imageExtValidator(file[0].originalname)) { return res.status(400).send({ status: false, message: "only image file is allowed" }) }
            let uploadedFileURL = await uploadFile(file[0]);
            assignment.uploadFile = uploadedFileURL
        }

        if (bodyData.hasOwnProperty("comment")) {
            if (validateString(comment)) {
                assignment.comment = comment
            }
        }


        assignment.dateOfSubmission = new Date
        dateOfSubmission = Date.now()
        if (dateOfSubmission > assignment.deadline) {
            return res.status(400).send({ status: false, message: "deadline is over" })
        }

        assignment.save()
        res.status(200).send({ status: true, msg: "data updated successfully", data: assignment })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
module.exports = { submitAssignment, getSubmittedAssignments, updateSubmittedAssignment, getAllStudentAssignments }