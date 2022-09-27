const express = require("express")
const router = express.Router()
const { registerTeacher, teacherLogin, Updateprofile } = require("../controllers/teacherController")
const { registerStudent, studentLogin, Updateprofile } = require("../controllers/studentController")
const { authentication } = require("../middleware/auth")

//==================================STUDENTS REGISTRATION API'S========================================================//

router.post("/register", registerStudent)
router.post("/login", studentLogin)
router.put("/student/:studentId/profile", authentication, Updateprofile)


//==================================TEACHERS REGISTRATION API'S========================================================//

router.post("/register", registerTeacher)
router.post("/login", teacherLogin)
router.put("/teacher/:teacherId/profile", authentication, Updateprofile)

//=================================TEACHER'S ASSIGNMENT API'S=========================================//

router.post("/teacher/assignment/:teacherId",authentication,createAssignment)
router.get("/teacher/assignment/:teacherId",authentication,getAssignment)
router.put("/teacher/assignment/:teacherId",authentication,updateAssignment)

//=====================================NOTES API'S====================================================//

router.post("/notes/:teacherId",authentication,authorization,createNote)
router.get("/notes/:teacherId",authentication,getNotes)
router.put("notes/:teacherId",authentication,authorization,updateNotes)

//=================================ANOUNCEMENTS API'S==================================================//

router.post("/anouncements/:teacherId",authentication,authorization,createAnouncement)
router.get("/anouncements/:teacherId",authentication,getAnouncements)
router.put("/anouncements/:teacherId",authentication,authorization,updateAnouncement)

//=================================STUDENTS'S ASSIGNMENT API'S=========================================//

router.post("/student/:studentId/assignment/:teacherId",authentication,submitAssignment)
router.get("/student/:studentId/assignment/:teacherId",authentication,getSubmittedAssignments)
router.put("/student/:studentId/assignment/:teacherId",authentication,updateSubmittedAssignment)

//=======================================VALID API=====================================================//
router.all("/**", function (req, res) {
    return res.status(404).send({ status: false, message: "No such api found" })
})


module.exports = router;