const mongoose = require("mongoose");
const validator = require("validator");
const {Schema} = mongoose;

const UserDetails = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 200
    },
    lastName: {
        type: String,
        minLength:1,
        maxLength: 200
    },
    gender: {
       type: String,
       required: true,
       validate: (value) => {
         if(!["Male","Female","transgender"].includes(value)){
            throw new Error("Gender is not valid")
         }
       }
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        
    },
    email: {
        type: String,
        required: true,
        lowercase: true, // it converts upperCase to lower Case
        trim: true, // it removes the space stored in database string
        unique: true, // no duplication email id
        
    },
    skills: {
        type: [String],
        validate: (value) => {
            if(!(value.length < 5)){
                throw new Error("skills data should be maximum 4")
            }
        }
    },
    photoUrl: {
       type: String,
       default:"https://www.istockphoto.com/photo/portrait-of-young-confident-indian-woman-pose-on-background-gm1399788030-453559243",
        validate: (value) => {
         if(!validator.isURL(value)){
          throw new Error(" Url is not Proper")
         }
       }
    }
    
    
},
{
    timestamps: true  // it automatically adds updated Date for patch and created , updated for post
}

)



const UserModels = mongoose.model("UserInfo",UserDetails); 
// DevTinder DataBase   Under UnserInfo Collection will Create
module.exports = UserModels