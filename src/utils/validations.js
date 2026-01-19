const UserValidation = require("validator")

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

module.exports = {
    Validation
}