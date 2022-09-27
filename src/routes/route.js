const express = require("express")
const router = express.Router()

const { authentication } = require("../middleware/auth")



router.all("/**", function (req, res) {
    return res.status(404).send({ status: false, message: "No such api found" })
})


module.exports = router;