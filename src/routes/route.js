const express = require("express")
const router = express.Router()
const { registerUser, userLogin, Updateprofile } = require("../controllers/userController")
const { userAuthentication,userAuthorization } = require("../middleware/auth")
const { createAssignment, getAssignment, getAssignmentByQuery,updateAssignment,deleteAssignment } = require("../controllers/teacherAssignmentController")
const { createNote, getNotes, updateNotes ,deleteNotes,getNotesByQuery} = require("../controllers/notesController")
const { createAnouncement, getAnouncements, updateAnouncement,deleteAnouncement,getAnouncementsByQuery } = require("../controllers/anouncementController")
const { submitAssignment, getSubmittedAssignments,getAllStudentAssignments, updateSubmittedAssignment } = require("../controllers/studentAssignmentController")

//==================================STUDENTS REGISTRATION API'S========================================================//

router.post("/register", registerUser)
router.post("/login", userLogin)
router.put("/student/:userId/profile", userAuthentication, Updateprofile)

//=================================TEACHER'S ASSIGNMENT API'S=========================================//

router.post("/teacher/assignment/:userId",userAuthentication,userAuthorization,createAssignment)
router.get("/teacher/assignment/:userId",userAuthentication,getAssignment)
router.get("/teacher/assignment",userAuthentication,getAssignmentByQuery)
router.put("/teacher/assignment/:userId/:assignmentId",userAuthentication,userAuthorization,updateAssignment)
router.delete("/teacher/assignment/:userId/:assignmentId",userAuthentication,userAuthorization,deleteAssignment)

//=====================================NOTES API'S====================================================//

router.post("/notes/:userId",userAuthentication,userAuthorization,createNote)
router.get("/notes/:userId",userAuthentication,getNotes)
router.get("/notes",userAuthentication,getNotesByQuery)
router.put("notes/:userId/noteId",userAuthentication,userAuthorization,updateNotes)
router.delete("notes/:userId/noteId",userAuthentication,userAuthorization,deleteNotes)

//=================================ANOUNCEMENTS API'S==================================================//

router.post("/anouncements/:userId",userAuthentication,userAuthorization,createAnouncement)
router.get("/anouncements/:userId",userAuthentication,getAnouncements)
router.get("/anouncements",userAuthentication,getAnouncementsByQuery)
router.put("/anouncements/:userId/:anouncementId",userAuthentication,userAuthorization,updateAnouncement)
router.delete("/anouncements/:userId/:anouncementId",userAuthentication,userAuthorization,deleteAnouncement)

//=================================STUDENTS'S ASSIGNMENT API'S=========================================//

router.post("/student/assignment/:userId/:assignmentId",userAuthentication,userAuthorization,submitAssignment)
router.get("/student/assignment/:userId",userAuthentication,userAuthorization,getSubmittedAssignments)
router.get("/student/assignment/:userId/:studentAssignmentId",userAuthentication,getAllStudentAssignments)
router.put("/student/assignment/:userId/:studentAssignmentId",userAuthentication,userAuthorization,updateSubmittedAssignment)


//=======================================VALID API=====================================================//
router.all("/**", function (req, res) {
    return res.status(404).send({ status: false, message: "No such api found" })
})


module.exports = router;