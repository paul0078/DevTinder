const validator = require("validator");
const UserModels = require("./src/models/schema");
const app = require("express");
const crudRoute =  app.Router();

// feed Api => fetch all Data
crudRoute.get("/getusers", async (req, res) => {
  try {
    let data = await UserModels.find({});
    res.status(200).send(data);
  } catch {
    res.status(400).send("Data Fetch is Falied !!");
  }
});

// fetch each data based on the condition
crudRoute.get("/getuserId", async (req, res) => {
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
crudRoute.delete("/deleteUser", async (req, res) => {
  let _id = req.body.userId; //_id => the name should match with schema _id data base having _id
  try {
    await UserModels.findByIdAndDelete({ _id });
    res.status(200).send("Deleted Successfully");
  } catch {
    res.status(400).send("Data Fetch is Falied !!");
  }
});

//Update Api
crudRoute.patch("/updateUser/:userid", async (req, res) => {
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

module.exports = {
    crudRoute
}