const teacherAssignmentModel =require("../models/teacherAssignmentModel")
let userModel=require("../models/userModel")
let {validateString,validateRequest,validateObjectId,imageExtValidator}=require("../validator/validations")
let {uploadFile}=require("../controllers/awsController")
 

let createAssignment=async function(req,res){
    let bodyData = req.body
    let userId=req.params.userId
    
     if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }
     let user=await userModel.findById(userId)
     if(user.areYouTeacherOrStudent==Student){return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" })}   
     let { title,description,deadline } = bodyData
        let dataToBeCreated={}
        if(validateRequest(bodyData)) { return res.status(400).send({ status: false, message: "please provide the data in the body" }) }
        if(!validateString(title)){ return res.status(400).send({ status: false, message: "title is required" }) }
        else{dataToBeCreated.title=title}
        if(!validateString(description)){ return res.status(400).send({ status: false, message: "description is required" }) }
        else{dataToBeCreated.description=description}
        
        let file = req.files;
       if (file && file.length > 0) {
            if (!imageExtValidator(file[0].originalname)) { return res.status(400).send({ status: false, message: "only image file is allowed" }) }
            let uploadedFileURL = await uploadFile(file[0]);
            dataToBeCreated.file = uploadedFileURL
        } else {
            return res.status(400).send({ status: false, message: "please provide profile image " });
        }
        if(!validateString(deadline)){ return res.status(400).send({ status: false, message: "deadline is required" }) }
        if(teacherAssignmentModel.deadline instanceof Date){
            return res.status(400).send({ status: false, message: `please provide a valid date format like "2002-12-09T00:00:00.000Z" or "2002-12-09"` })
        }
        else{dataToBeCreated.deadline=deadline}

        let assignment=await teacherAssignmentModel.create(dataToBeCreated)

        res.status(201).send({status:true, msg:"assignment created succesfully", data:assignment})

    }


    let getAssignment=async function(req,res){
        let userId=req.params.userId
     if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }

         let assignment=await teacherAssignmentModel.find({userId:userId,isDeleted:false})
         if(assignment.length==0){ return res.status(404).send({ status: false, msg: "there is no assignment with this userid or deleted" }) }
         res.status(200).send({status:true,data:assignment})
        }



        let updateAssignment=async function(req,res){
            let userId=req.params.userId
     if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: "pleade provide valid id" }) }
     
     let user=await userModel.findById(userId)
     if(user.areYouTeacherOrStudent==Student){return res.status(403).send({ status: false, msg: "students are not authorized to create assignment" })}   
     
     let bodyData=req.body
     let {title,description,deadline}=bodyData

     let teacherAssignment=await teacherAssignmentModel.findOne({})

     if (bodyData.hasOwnProperty("title")) {
                if (validateString(title)){
                
                userData.lname = lname
            }}
            
    
        }

        let deleteAssignment=async function(req,res){
     
    
        }



module.exports={createAssignment,getAssignment,updateAssignment,deleteAssignment}