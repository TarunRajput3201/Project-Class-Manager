const express = require("express")
const router = express.Router()
const { registerTeacher, teacherLogin, Updateprofile } = require("../controllers/teacherController")
const { registerStudent, studentLogin, Updateprofile } = require("../controllers/studentController")
const { studentAuthentication,teacherAuthentication,studentAuthorization,teacherAuthorization } = require("../middleware/auth")

//==================================STUDENTS REGISTRATION API'S========================================================//

router.post("/register", registerStudent)
router.post("/login", studentLogin)
router.put("/student/:studentId/profile", studentAuthentication, Updateprofile)


//==================================TEACHERS REGISTRATION API'S========================================================//

router.post("/register", registerTeacher)
router.post("/login", teacherLogin)
router.put("/teacher/:teacherId/profile", teacherAuthentication, Updateprofile)

//=================================TEACHER'S ASSIGNMENT API'S=========================================//

router.post("/teacher/assignment/:teacherId",teacherAuthentication,teacherAuthorization,createAssignment)
router.get("/teacher/assignment/:teacherId",studentAuthentication,getAssignment)
router.put("/teacher/assignment/:teacherId",teacherAuthentication,teacherAuthorization,updateAssignment)

//=====================================NOTES API'S====================================================//

router.post("/notes/:teacherId",teacherAuthentication,teacherAuthorization,createNote)
router.get("/notes/:teacherId",studentAuthentication,getNotes)
router.put("notes/:teacherId",teacherAuthentication,teacherAuthorization,updateNotes)

//=================================ANOUNCEMENTS API'S==================================================//

router.post("/anouncements/:teacherId",teacherAuthentication,teacherAuthorization,createAnouncement)
router.get("/anouncements/:teacherId",studentAuthentication,getAnouncements)
router.put("/anouncements/:teacherId",teacherAuthentication,teacherAuthorization,updateAnouncement)

//=================================STUDENTS'S ASSIGNMENT API'S=========================================//

router.post("/student/:studentId/assignment/:teacherId",studentAuthentication,studentAuthorization,submitAssignment)
router.get("/student/:studentId/assignment/:teacherId",studentAuthentication,studentAuthorization,getSubmittedAssignments)
router.put("/student/:studentId/assignment/:teacherId",studentAuthentication,studentAuthorization,updateSubmittedAssignment)

//=======================================VALID API=====================================================//
router.all("/**", function (req, res) {
    return res.status(404).send({ status: false, message: "No such api found" })
})


module.exports = router;