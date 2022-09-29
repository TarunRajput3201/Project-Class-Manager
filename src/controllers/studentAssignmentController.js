let submitAssignment=async function(req,res){
     try{
       
     }
     catch (error) {
        return res.status(500).send({ status: false, message: error.message })
     }
    
}
let getSubmittedAssignments=async function(req,res){
    try{

    }
    catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
    
}
let updateSubmittedAssignment=async function(req,res){
    try{

    }
    catch (error) {
       return res.status(500).send({ status: false, message: error.message })
    }
    
}
module.exports={ submitAssignment, getSubmittedAssignments, updateSubmittedAssignment }