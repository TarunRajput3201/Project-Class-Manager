// IMPORT JSONWEBTOKEN PACKAGE-------
const jwt = require('jsonwebtoken')

const studentAuthentication = (req, res, next) => {
    try {
        let bearer = req.headers["Authorization"];
        if (!bearer) bearer = req.headers["authorization"];
        if (!bearer) {
            return res.status(400).send({ status: false, msg: "Token required! Please login to generate token" });
        }
        const splitToken = bearer.split(' ');
        const token = splitToken[1];
        jwt.verify(token, "student-authentication-1023", (err, student) => {
            if (err){ 
                return res.status(401).send({ status: false, message: "please provide a valid token" })}
              
                req.student = student
                let tokenTime = req.student.exp;
                let createdTime = Date.now()
           if (createdTime > tokenTime) {
                    return res.status(400).send({ status: false, msg: "token is expired, login again" })
                }
                    next();
        });
       } catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
}

const teacherAuthentication = (req, res, next) => {
    try {
        let bearer = req.headers["Authorization"];
        if (!bearer) bearer = req.headers["authorization"];
        if (!bearer) {
            return res.status(400).send({ status: false, msg: "Token required! Please login to generate token" });
        }
        const splitToken = bearer.split(' ');
        const token = splitToken[1];
        jwt.verify(token, "teacher-authentication-1024", (err, teacher) => {
            if (err){ 
                return res.status(401).send({ status: false, message: "please provide a valid token" })}
              
                req.teacher = teacher
                let tokenTime = req.teacher.exp;
                let createdTime = Date.now()
           if (createdTime > tokenTime) {
                    return res.status(400).send({ status: false, msg: "token is expired, login again" })
                }
                    next();
        });
       } catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = { studentAuthentication,teacherAuthentication }