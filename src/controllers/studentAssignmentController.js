const userModel = require("../models/userModel")
const studentAssignmentModel = require("../models/studentAssignmentModel")
const teacherAssignmentModel = require("../models/teacherAssignmentModel")
let { validateString, validateRequest, imageExtValidator } = require("../validator/validations")
let submitAssignment = async function (req, res) {
    try {
        let bodyData = req.body
        let userId = req.params.userId
        let assignmentId = req.params.assignmentId

        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid user id" }) }
        if (!mongoose.isValidObjectId(assignmentId)) { return res.status(400).send({ status: false, msg: "pleade provide valid assignment id" }) }
        let assignment = await teacherAssignmentModel.findOne({ _id: assignmentId, isDeleted: false })
        if (!assignment) { return res.status(404).send({ status: false, msg: "there is no assignment with this teacher assignmentId" }) }
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


        dataToBeCreated.userId = userId


        dataToBeCreated.assignmentId = assignmentId


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
let getSubmittedAssignments = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid user id" }) }
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

        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid user id" }) }
        if (!mongoose.isValidObjectId(assignmentId)) { return res.status(400).send({ status: false, msg: "pleade provide valid assignment id" }) }

        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == Student) { return res.status(403).send({ status: false, msg: "students are not authorized to get all student assignments" }) }
        let studentAssignments = await studentAssignmentModel.find({ assignmentId: assignmentId })
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

        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid user id" }) }
        if (!mongoose.isValidObjectId(assignmentId)) { return res.status(400).send({ status: false, msg: "pleade provide valid assignment id" }) }
        let { comment, dateOfSubmission } = bodyData
        let assignment = await studentAssignmentModel.findById(studentAssignmentId)

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
        if (bodyData.hasOwnProperty("dateOfSubmission")) {
            if (validateString(dateOfSubmission)) {
                if (studentAssignmentModel.dateOfSubmission instanceof Date) {

                    assignment.dateOfSubmission = dateOfSubmission
                }
            }
        }
        assignment.save()
        res.status(200).send({ status: true, msg: "data updated successfully", data: assignment })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
module.exports = { submitAssignment, getSubmittedAssignments, updateSubmittedAssignment, getAllStudentAssignments }