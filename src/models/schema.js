const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserDetails = new Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    },
    email: {
        type: String
    },
    
})

const UserModels = mongoose.model("UserInfo",UserDetails); 
// DevTinder DataBase   Under UnserInfo Collection will Create
module.exports = UserModels