// IMPORT JSONWEBTOKEN PACKAGE-------
const jwt = require('jsonwebtoken')

// IMPORT USERMODEL FOR DB CALLS-----
const userModel = require("../models/userModel")


const authentication = (req, res, next) => {
    try {
        let bearer = req.headers["Authorization"];
        if (!bearer) bearer = req.headers["authorization"];

        if (!bearer) {
            return res.status(400).send({ status: false, msg: "Token required! Please login to generate token" });
        }

        const splitToken = bearer.split(' ');

        const token = splitToken[1];
             
        jwt.verify(token, "functionup-radon", (err, user) => {
            if (err)
               { return res.status(401).send({ status: false, message: "please provide a valid token" })}
              
                req.user = user

                let tokenTime = req.user.exp;
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



module.exports = { authentication }