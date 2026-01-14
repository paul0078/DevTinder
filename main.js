const express = require("express");
const Database = require("./src/config/database");
const UserModels = require("./src/models/schema");
const app = express();

app.post("/signUp", async (req,res) => {
    let user = {
      name: "Avinash",
      age: 27,
      email: "avi@gmail.com"
    }

    let userDetails = new UserModels(user);
    try{
      await userDetails.save();
    res.status(200).send("Saved Successfully");
    }catch(err){
        res.status(400).send("Falied")
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
