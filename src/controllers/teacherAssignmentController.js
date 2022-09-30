const teacherAssignmentModel = require("../models/teacherAssignmentModel")
let userModel = require("../models/userModel")
let { validateString, validateRequest,isValidObjectId } = require("../validator/validations")
let { uploadFile } = require("../controllers/awsController")
const moment =require("moment")

let createAssignment = async function (req, res) {
    try {
        let bodyData = req.body
        let userId = req.params.userId

        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }
        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == "Student") { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }
        let { title, description, deadline } = bodyData
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
        if (!validateString(deadline)) { return res.status(400).send({ status: false, message: "deadline is required" }) }
        
        if(!(/^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/.test(deadline))){
            return res.status(400).send({ status: false, message: "please provide a valid date format like  `2002-12-09` " })
        }
        if (!moment(deadline, "YYYY-MM-DD").isValid()) {
            return res.status(400).send({ status: false, message: "please provide a valid date format like  `2002-12-09` " })
        }
        else 
        { dataToBeCreated.deadline = deadline }

        let assignment = await teacherAssignmentModel.create(dataToBeCreated)

        res.status(201).send({ status: true, msg: "assignment created succesfully", data: assignment })
    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


let getAssignment = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }

        let assignment = await teacherAssignmentModel.find({ userId: userId, isDeleted: false })
        if (assignment.length == 0) { return res.status(404).send({ status: false, msg: "there is no assignment with this userid or deleted" }) }
        res.status(200).send({ status: true, data: assignment })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getAssignmentByQuery = async function (req, res) {
    try {
        let queryData = req.query
        let {title,description,userId}=queryData
        getFilter = Object.keys(queryData)
    if (getFilter.length) {
      for (let value of getFilter) {
        if (['title', 'description','userId'].indexOf(value) == -1)
          return res.status(400).send({ status: false, message: `You can't filter Using '${value}' ` })
      }
    }
    let queryObj={isDeleted:false}
    let teacherAssignment=await teacherAssignmentModel.find(queryObj).lean()
       
    
        if (queryData.hasOwnProperty("title")) {
            if (validateString(title)) {
            
              teacherAssignment=teacherAssignment.filter(assignment=>assignment.title.includes(title)).map(assign=>assign)
            }
        }
      


        if (queryData.hasOwnProperty("description")) {
            if (validateString(description)) {
                teacherAssignment=teacherAssignment.filter(assignment=>assignment.description.includes(description)).map(assign=>assign)
            }
        }
        if (queryData.hasOwnProperty("userId")) {
            if (validateString(userId)) {
                if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }
                teacherAssignment=teacherAssignment.filter(assignment=>assignment.userId==userId).map(assign=>assign)
            }
        }
    
       
       res.status(200).send({ status: true, data: teacherAssignment })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }

}

let updateAssignment = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }

        let assignmentId = req.params.assignmentId
        if (!isValidObjectId(assignmentId)) { return res.status(400).send({ status: false, msg: "pleade provide valid assignment id" }) }

        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == "Student") { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }

        let bodyData = req.body
        let { title, description, deadline } = bodyData

        let teacherAssignment = await teacherAssignmentModel.findById(assignmentId)

        if (bodyData.hasOwnProperty("title")) {
            if (validateString(title)) {

                teacherAssignment.title = title
            }
        }
        if (bodyData.hasOwnProperty("description")) {
            if (validateString(description)) {

                teacherAssignment.description = description
            }
        }
        let file = req.files;
        if (file && file.length > 0) {
            if (!imageExtValidator(file[0].originalname)) { return res.status(400).send({ status: false, message: "only image file is allowed" }) }
            let uploadedFileURL = await uploadFile(file[0]);
            dataToBeCreated.uploadFile = uploadedFileURL
        }
        if (bodyData.hasOwnProperty("deadline")) {
            if (validateString(deadline)) {
                if (teacherAssignmentModel.deadline instanceof Date) {

                    teacherAssignment.deadline = deadline
                }
            }
        }
        teacherAssignment.save()
        res.status(200).send({ status: true, msg: "data updated successfully", data: teacherAssignment })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

let deleteAssignment = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid userid id" }) }

        let assignmentId = req.params.assignmentId
        if (!isValidObjectId(assignmentId)) { return res.status(400).send({ status: false, msg: "pleade provide valid assignment id" }) }

        let user = await userModel.findById(userId)
        if (user.areYouTeacherOrStudent == "Student") { return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" }) }

        let teacherAssignment = await teacherAssignmentModel.findOneAndUpdate({ _id: assignmentId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date } })
        if (!teacherAssignment) { return res.status(403).send({ status: false, msg: "this assignment is already deleted or doesnot exist" }) }

        res.status(200).send({ status: true, msg: "data deleted successfully" })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}



module.exports = { createAssignment, getAssignment, getAssignmentByQuery,updateAssignment, deleteAssignment }