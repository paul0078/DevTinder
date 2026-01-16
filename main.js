const express = require("express");
const Database = require("./src/config/database");
const UserModels = require("./src/models/schema");
const app = express();

// this helps to convert json data to javascript object it  acts 
// as middleware or plugin and this javascript object sends back to req.body
app.use(express.json()); 

// create
app.post("/signUp", async (req,res) => {
  /* creating dynamic instance from the api through req */
      //console.log("req Data", req.body);
      let user = req.body
    // Creating instance of User Model
    // let user = {
    //   name: "Meenu",
    //   age: 27,
    //   email: "kutti@gmail.com"
    // }

    let userDetails = new UserModels(user);
    try{
      await userDetails.save();
    res.status(200).send("Saved Successfully");
    }catch(err){
        res.status(400).send("No Data Added !!")
    }
    
});


// feed Api => fetch all Data
app.get("/getusers", async (req, res) => {
    try{
       let data = await UserModels.find({});
       res.status(200).send(data);
      
    }catch{
      res.status(400).send("Data Fetch is Falied !!")
    }
});

// fetch each data based on the condition
app.get("/getuserId", async (req, res) => {
  //  let findId = req.body.userId;
   let name = req.body.userName; // fetch by using name in post man send userName: "xyz"
    try{

       let data = await UserModels.find({ name });
       res.status(200).send(data);
      
    }catch{
      res.status(400).send("Data Fetch is Falied !!")
    }
});

//deleting Api
app.delete("/deleteUser", async (req, res) => {
    let _id = req.body.userId; //_id => the name should match with schema _id data base having _id
   
    try{
       await UserModels.findByIdAndDelete({ _id });
       res.status(200).send("Deleted Successfully");
      
    }catch{
      res.status(400).send("Data Fetch is Falied !!")
    }
});

//Update Api
app.patch("/updateUser", async (req, res) => {
    let _id = req.body.userid; //_id => the name should match with schema _id data base having _id
    let userUpdateData = req.body;
    try{
       let updated = await UserModels.findByIdAndUpdate(_id , userUpdateData , { new: true });
       /* 
       instead of return document replacing new: true / false
       the new :true  return the updated data  
       without new :false it will return old data
        */
       res.status(200).send("Data Updated Successfuly!!!");
      
    }catch{
      res.status(400).send("Data Fetch is Falied !!")
    }
});


Database().then(() => {
    console.log("mongoose is Connected");
    app.listen(5000,() => {
    console.log("Server successfully connected to 5000");
})
}).catch(() => {
   console.log("mongoose Connection failed !!");
})
