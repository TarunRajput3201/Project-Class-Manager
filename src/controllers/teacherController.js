let registerTeacher = async function (req, res) {
    try {
        let bodyData = req.body
        let { fname, lname, email, password, phone } = bodyData
        if (validateRequest(bodyData)) { return res.status(400).send({ status: false, message: "please provide the data in the body" }) }

        if (!validateString(fname)) { return res.status(400).send({ status: false, message: "please provide the first name" }) }
        if (!regxName(fname)) { return res.status(400).send({ status: false, message: "please provide a valid first name" }) }

        if (!validateString(lname)) { return res.status(400).send({ status: false, message: "please provide the last name" }) }
        if (!regxName(lname)) { return res.status(400).send({ status: false, message: "please provide a valid last name" }) }

        if (!validateString(email)) { return res.status(400).send({ status: false, message: "please provide the email" }) }
        if (!validateEmail(email)) { return res.status(400).send({ status: false, message: "please provide a valid email" }) }

        if (!validateString(phone)) { return res.status(400).send({ status: false, message: "please provide the phone number" }) }
        if (!regexPhoneNumber(phone)) { return res.status(400).send({ status: false, message: "please provide a valid phone number" }) }

        if (!validateString(password)) { return res.status(400).send({ status: false, message: "please provide the password" }) }
        if (!validatePassword(password)) { return res.status(400).send({ status: false, message: "Please provide a valid password with atleast one uppercase one lowercase  one special character and must be between 8-15" }) }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        bodyData.password = encryptedPassword

        let profile = req.files;
        if (profile && profile.length > 0) {
            if (!imageExtValidator(profile[0].originalname)) { return res.status(400).send({ status: false, message: "only image file is allowed" }) }
            let uploadedFileURL = await uploadFile(profile[0]);
            bodyData.profileImage = uploadedFileURL
        } else {
            return res.status(400).send({ status: false, message: "please provide profile image " });
        }

        let isDuplicateEmail = await teacherModel.findOne({ email:email })
        if (isDuplicateEmail) { return res.status(400).send({ status: false, message: "this email already exists" }) }

        let isDuplicatePhone = await teacherModel.findOne({ phone:phone })
        if (isDuplicatePhone) { return res.status(400).send({ status: false, message: "this phone number already exists" }) }

        let newteacher = await teacherModel.create(bodyData)
        newteacher=newteacher.toObject()
        delete(newteacher.password)
        res.status(201).send({ status: true, message: "teacher registered successfully", data: newteacher })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}

//=====================================teacher LOGIN===========================================================//

let teacherLogin = async function (req, res) {
    try {
        let email = req.body.email
        let password = req.body.password
        if (!validateString(email)){return res.status(400).send({ status: false, message: "email is required" })}
        if (!validateEmail(email)){ return res.status(400).send({ status: false, message: "please provide a valid email" }) }
        
        if (!validateString(password)) {return res.status(400).send({ status: false, message: "password is required" })}
        

        let teacher = await teacherModel.findOne({ email: email });
        if (!teacher)
            return res.status(401).send({status: false,message: "email is not correct",});

        const passwordDetails = await bcrypt.compare(password, teacher.password)
        if (!passwordDetails) {
            return res.status(401).send({ status: false, msg: "password is incorrect pls provide correct password" })
        }
        let token = jwt.sign(
            {
                teacherId: teacher._id.toString(),
                iat: new Date().getTime(),
                exp: new Date().setDate(new Date().getDate() + 1)
                 
            },
            "teacher-authentication-1024"
            
        );

        res.status(200).send({ status: true, message: "Success", data: { teacherId: teacher._id, token: token } });
    }
    catch (err) {

        return res.status(500).send({ status: false, message: err.message })
    }
}


//=====================================UPDATING teacher PROFILE===========================================================//


const Updateprofile = async function (req, res) {
    try {
        let teacherId = req.params.teacherId
        if (!mongoose.isValidObjectId(teacherId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }
        

        let bodyData = JSON.parse(JSON.stringify(req.body))

        let { fname, lname, email, phone, password } = bodyData

        let profile = req.files

        if (validateRequest(bodyData) && !profile) { return res.status(400).send({ status: false, msg: "body can not be blank" }) }

        let teacherData = await teacherModel.findById(teacherId)
        if (!teacherData) { return res.status(400).send({ status: false, msg: "No such teacher is available" }) }

        if (bodyData.hasOwnProperty('fname')) {
            if (!validateString(fname)){return res.status(400).send({ status: false, message: "please provide first name" })}
            if (!regxName(fname)) { return res.status(400).send({ status: false, msg: "provide valid first name" }) }
            teacherData.fname = fname
        }

        if (bodyData.hasOwnProperty("lname")) {
            if (!validateString(lname)){return res.status(400).send({ status: false, message: "please provide last name" })}
            if (!regxName(lname)) { return res.status(400).send({ status: false, msg: "provide valid last name" }) }
            teacherData.lname = lname
        }

        if (bodyData.hasOwnProperty("email")) {
            if (!validateString(email)){return res.status(400).send({ status: false, message: "please provide email" })}
            if (!validateEmail(email)) { return res.status(400).send({ status: false, msg: "provide valid email" }) }
            let uniqueEmail = await teacherModel.findOne({ email: email })
            if (uniqueEmail) { return res.status(400).send({ status: false, msg: "This email is already registered" }) }
            teacherData.email = email
        }

        if (bodyData.hasOwnProperty("phone")) {
            if (!validateString(phone)){return res.status(400).send({ status: false, message: "please provide phone number" })}
            if (!regexPhoneNumber(phone)) { return res.status(400).send({ status: false, msg: "provide valid phone number" }) }
            let uniquephone = await teacherModel.findOne({ phone: phone })
            if (uniquephone) { return res.status(400).send({ status: false, msg: "This phone number is already registered" }) }
            teacherData.phone = phone
        }


        if (profile && profile.length > 0) {
            if (!imageExtValidator(profile[0].originalname)) { return res.status(400).send({ status: false, message: "only image file is allowed" }) }
            let uploadedFileURL = await uploadFile(profile[0]);
            teacherData.profileImage = uploadedFileURL
        }
        else if (bodyData.hasOwnProperty("profileImage")) { return res.status(400).send({ status: false, message: "please provide profile image" }) }

        if (bodyData.hasOwnProperty("password")) {
            if (!validateString(password)){return res.status(400).send({ status: false, message: "please provide password" })}
            if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, message: "password must be between 8-15" }) }
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
            teacherData.password = encryptedPassword
        }

        

        teacherData.save()
        res.status(200).send({ status: true, data: teacherData })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }
}
module.exports = { registerTeacher, teacherLogin, Updateprofile }