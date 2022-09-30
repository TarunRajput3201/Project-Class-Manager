const mongoose = require("mongoose");
const regxName = function (val) {
  let regx = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/;
  return regx.test(val);
}

//=======================================VALIDATING EMPTY STRING============================================//

const validateString = function (name) {
  if (typeof name == "undefined" || typeof name == null) return false;
  if (typeof name == "string" && name.trim().length == 0) return false;

  return true;
};


//====================================VALIDATING EMAIL==================================================//

const validateEmail = function (value) {
  let re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  let validEmail = re.test(value);

  if (!validEmail) {
    return false;
  }

  return true;
};

//====================================VALIDATING PASSWORD==================================================//

const validatePassword = function (value) {
  let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*]{8,15})$/
  return regex.test(value)
}

//================================VALIDATING EMPTY OBJECT=================================================//

const validateRequest = function (value) {
  return Object.keys(value).length == 0
};

//====================================VALIDATING OBJECTID==================================================//


let isValidObjectId = function (ObjectId) {
  return mongoose.isValidObjectId(ObjectId)
}


//====================================VALIDATING PHONE NUMBER==================================================//


const regexPhoneNumber = function (val) {
  let regx = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
  return regx.test(val);
}

//====================================VALIDATING IMAGE EXTENSION==================================================//


const imageExtValidator = function (val) {
  let regex = /\.(gif|jpe?g|tiff?|png|webp|bmp|jpg|JPG)$/
  return regex.test(val)
}

module.exports = {
  validateString,
  validateRequest,
  validateEmail,
  regexPhoneNumber,
  regxName,
  validatePassword,
  imageExtValidator,
  isValidObjectId
};