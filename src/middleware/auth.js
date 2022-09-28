// IMPORT JSONWEBTOKEN PACKAGE-------
const jwt = require('jsonwebtoken')


const userAuthentication = (req, res, next) => {
    try {
        let bearer = req.headers["Authorization"];
        if (!bearer) bearer = req.headers["authorization"];
        if (!bearer) {
            return res.status(400).send({ status: false, msg: "Token required! Please login to generate token" });
        }
        const splitToken = bearer.split(' ');
        const token = splitToken[1];
        jwt.verify(token, "user-authentication-1024", (err, user) => {
            if (err){ 
                return res.status(401).send({ status: false, message: "please provide a valid token" })}
              
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
let userAuthorization=function(req,res,next){
try{let userId=req.params.userId
if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }
let tokenuserId=req.user.userId
if(userId!=tokenuserId){return res.status(403).send({status:false,msg:"user authorization failed"})}
else{next()}}
catch (error) {
    return res.status(500).send({ status: false, message: error.message })
 }
}


module.exports = {userAuthentication,userAuthorization }