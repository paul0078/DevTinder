const express = require("express");
const Database = require("./src/config/database");
const UserModels = require("./src/models/schema");
const validator = require("validator");
const { Validation } = require("./src/utils/validations");
const bcrypt = require("bcrypt");
const app = express();

// this helps to convert json data to javascript object it  acts
// as middleware or plugin and this javascript object sends back to req.body
app.use(express.json());

// create
app.post("/signUp", async (req, res) => {
  /* creating dynamic instance from the api through req */
  //console.log("req Data", req.body);
  let user = req.body;
  // Creating instance of User Model
  // let user = {
  //   name: "xyz",
  //   age: 27,
  //   email: "xyz@gmail.com"
  // }

  try {
    await Validation(user);

    const passwordhas = await bcrypt.hash(user.password, 10);
    const {
      firstName,
      lastName,
      gender,
      age,
      email,
      skills,
      photoUrl,
    } = user;
    let userDetails = new UserModels({
      firstName,
      lastName,
      password: passwordhas,
      gender,
      age,
      email,
      skills,
      photoUrl,
     });

    await userDetails.save();
    res.status(200).send("Saved Successfully");
  } catch (err) {
    /* Any data base or api Error Catches It handles here */

    // if(err.code === 11000){
    //   return res.status(408).json({
    //     message: "Email already exist"
    //   })
    // }
    res.status(500).send({
      message: err.message,
    });
  }
});

//login api 
app.post("/login", async(req,res) => {
      try{
        let {email , password} = req.body;
        let dbdetails =  await UserModels.findOne({email});

        console.log("display details", dbdetails);
        let haspassword = await bcrypt.compare(password, dbdetails.password);
         
        if(haspassword){
             return res.status(200).json({
                message: "User Login Successfully!!"
              })
         }
         if(!haspassword){
             return  res.status(401).json({
                message: "invalid Credentials !!"
              })
         }
        
       
      }catch(err){
         res.status(500).send({
          message: "Server Error",
          err: err.message
         })
      }
});

// feed Api => fetch all Data
app.get("/getusers", async (req, res) => {
  try {
    let data = await UserModels.find({});
    res.status(200).send(data);
  } catch {
    res.status(400).send("Data Fetch is Falied !!");
  }
});

// fetch each data based on the condition
app.get("/getuserId", async (req, res) => {
  //  let findId = req.body.userId;
  let firstName = req.body.userName; // fetch by using name in post man send userName: "xyz"
  try {
    let data = await UserModels.find({ firstName });
    res.status(200).send(data);
  } catch {
    res.status(400).send("Data Fetch is Falied !!");
  }
});

//deleting Api
app.delete("/deleteUser", async (req, res) => {
  let _id = req.body.userId; //_id => the name should match with schema _id data base having _id

  try {
    await UserModels.findByIdAndDelete({ _id });
    res.status(200).send("Deleted Successfully");
  } catch {
    res.status(400).send("Data Fetch is Falied !!");
  }
});

//Update Api
app.patch("/updateUser/:userid", async (req, res) => {
  let _id = req.params.userid; //_id => the name should match with schema _id data base having _id
  //let email = req.body.userEmail; // updated the user Using email id
  let userUpdateData = req.body;

  let AllowedFields = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "email",
    "skills",
    "photoUrl",
  ];

  let condition = Object.keys(userUpdateData).every((key) =>
    AllowedFields.includes(key),
  );

  try {
    if (!_id) {
      throw new Error("please Add id params");
    }

    // if u want to update the user using id u have to go with findByIdAndUpdate
    await UserModels.findByIdAndUpdate(_id, userUpdateData, {
      new: true,
      runValidators: true,
      context: "query",
    });
    /*
       Note: if Data Base Validation Need to work here means u have to add runValidators
       */
    // if u want to update the user using other fields u have to go with findByIdAndUpdate
    //await UserModels.findOneAndUpdate({email}, userUpdateData);
    /* 
       instead of return document replacing new: true / false
       the new :true  return the updated data  
       without new :false it will return old data
        */
    if (userUpdateData.email && !validator.isEmail(userUpdateData.email)) {
      return res.status(408).json({ message: `Email is not valid` });
    }
    if (!condition) {
      return res
        .status(408)
        .json({ message: `Only add the expected fileds ${AllowedFields}` });
    }
    res.status(200).json({
      message: "Data Updated Successfully !!",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

Database()
  .then(() => {
    console.log("mongoose is Connected");
    app.listen(5000, () => {
      console.log("Server successfully connected to 5000");
    });
  })
  .catch(() => {
    console.log("mongoose Connection failed !!");
  });
