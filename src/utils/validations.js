const UserValidation = require("validator");
const UserModels = require("../models/schema");

const Validation = async(req) => {
    if(!req.firstName || !req.lastName){
       throw new Error("name should not be empty");
    }
    if(!UserValidation.isEmail(req.email)){
       throw new Error("Email is not Valid !!")
    }
    if(!UserValidation.isStrongPassword(req.password)){
         throw new Error("Paasowrd is not Valid !!")
    }
}


const UserValidationDetails = async (values) => {
     const allowedFields = [
        "firstName",
        "lastName",
        "gender",
        "age",
        "skills",
        "photoUrl"
     ];
     
     // Check if all provided fields are allowed
     const providedFields = Object.keys(values);
     const isValid = providedFields.every((key) => allowedFields.includes(key));
     
     if (!isValid) {
       throw new Error("Invalid fields provided. Cannot update email or password here.");
     }
     
    
}

const UserPassword = async(newpass,user) => {
   let isSamePassword = await user.passwordbcrypt(newpass);
   if(isSamePassword){
     throw new Error("New password cannot be the same as old password!");
   }
}

module.exports = {
    Validation,
    UserValidationDetails,
    UserPassword
}