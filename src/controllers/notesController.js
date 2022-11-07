const notesModel = require("../models/notesModel")
let userModel = require("../models/userModel")
let { validateString, validateRequest, isValidObjectId } = require("../validator/validations")
let { uploadFile } = require("../controllers/awsController")

let createNote = async function (req, res) {
    try {
        let bodyData = req.body
        let userId = req.params.userId

        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userId" }) }
        let user = await userModel.findById(userId)
        if (user.registerAs == "Student") { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }
        let { title, description } = bodyData
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
        } else {
            return res.status(400).send({ status: false, message: "please upload file :file upload is mandatory" });
        }


        let note = await notesModel.create(dataToBeCreated)

        res.status(201).send({ status: true, msg: "note created succesfully", data: note })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
let getNotes = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userId" }) }

        let notes = await notesModel.find({ userId: userId, isDeleted: false })
        if (assignment.length == 0) { return res.status(404).send({ status: false, msg: "there is no note with this userid or deleted" }) }
        res.status(200).send({ status: true, data: notes })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
let getNotesByQuery = async function (req, res) {
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
        let notes = await notesModel.find(queryObj).lean()

        if (queryData.hasOwnProperty("title")) {
            if (validateString(title)) {

                notes = notes.filter(notes1 => notes1.title.includes(title)).map(assign => assign)
            }
        }



        if (queryData.hasOwnProperty("description")) {
            if (validateString(description)) {
                notes = notes.filter(notes1 => notes1.description.includes(description)).map(assign => assign)
            }
        }
        if (queryData.hasOwnProperty("userId")) {
            if (validateString(userId)) {
                if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }
                notes = notes.filter(notes1 => notes1.userId == userId).map(assign => assign)
            }
        }


        res.status(200).send({ status: true, data: notes })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
let updateNotes = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }

        let noteId = req.params.noteId
        if (!isValidObjectId(noteId)) { return res.status(400).send({ status: false, msg: "pleade provide valid noteid" }) }

        let user = await userModel.findById(userId)
        if (user.registerAs == "Student") { return res.status(403).send({ status: false, msg: "students are not authorized to update note" }) }

        let bodyData = req.body
        let { title, description, deadline } = bodyData

        let note = await notesModel.findById(noteId)

        if (bodyData.hasOwnProperty("title")) {
            if (validateString(title)) {

                note.title = title
            }
        }
        if (bodyData.hasOwnProperty("description")) {
            if (validateString(description)) {

                note.description = description
            }
        }
        let file = req.files;
        if (file && file.length > 0) {
            if (!imageExtValidator(file[0].originalname)) { return res.status(400).send({ status: false, message: "only image file is allowed" }) }
            let uploadedFileURL = await uploadFile(file[0]);
            dataToBeCreated.uploadFile = uploadedFileURL
        }

        note.save()
        res.status(200).send({ status: true, msg: "data updated successfully", data: note })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
let deleteNotes = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }

        let noteId = req.params.noteId
        if (!isValidObjectId(noteId)) { return res.status(400).send({ status: false, msg: "pleade provide valid noteid" }) }

        let user = await userModel.findById(userId)
        if (user.registerAs == "Student") { return res.status(403).send({ status: false, msg: "students are not authorized to delete note" }) }

        let note = await teacherAssignmentModel.findOneAndUpdate({ _id: noteId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date } })
        if (!note) { return res.status(403).send({ status: false, msg: "this assignment is already deleted or doesnot exist" }) }

        res.status(200).send({ status: true, msg: "data deleted successfully" })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
module.exports = { createNote, getNotes, updateNotes, deleteNotes, getNotesByQuery }