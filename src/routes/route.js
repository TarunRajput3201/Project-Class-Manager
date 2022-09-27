const express = require("express")
const router = express.Router()
const { createUser, userLogin, Updateprofile } = require("../controllers/userController")
const { authentication } = require("../middleware/auth")

//==================================USER API'S========================================================//

router.post("/register", createUser)
router.post("/login", userLogin)
router.put("/user/:userId/profile", authentication, Updateprofile)

//=================================TEACHER'S ASSIGNMENT API'S=========================================//

router.post("/teacher/assignment/:userId",createAssignment)
router.get("/teacher/assignment/:userId",getAssignment)
router.put("/teacher/assignment/:userId",updateAssignment)

//=====================================NOTES API'S====================================================//

router.post("/notes/:userId",createNote)
router.get("/notes/:userId",getNotes)
router.put("notes/:userId",updateNotes)

//=================================ANOUNCEMENTS API'S==================================================//

router.post("/anouncements/:userId",createAnouncement)
router.get("/anouncements/:userId",getAnouncements)
router.put("/anouncements/:userId",updateAnouncement)

//=================================STUDENTS'S ASSIGNMENT API'S=========================================//

router.post("/student/assignment/:userId",submitAssignment)
router.get("/student/assignment/:userId",getSubmittedAssignments)
router.put("/student/assignment/:userId",updateSubmittedAssignment)

//=======================================VALID API=====================================================//
router.all("/**", function (req, res) {
    return res.status(404).send({ status: false, message: "No such api found" })
})


module.exports = router;