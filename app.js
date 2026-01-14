const express = require("express");
const app = express();
const {userAuth ,userAdmin, commonUser} = require("./src/utils/middleware");


/* 
// Note this is Global middle ware it runs for all the routes
app.use((req, res, next) => { 
    console.log("iam middleware");
    next(); 
});
 so write it in down how i write code
*/


const logger = ((req, res, next) => { 
    console.log("iam middleware");
    next(); 
});

// API Route
app.get("/testingmiddleware",logger, (req, res) => {
    console.log("iam api");
     res.send("iam getting Api");
});


app.use("/userAuth", userAuth, (req, res) => {
    res.send("Get All Data");
})
app.use("/AdminAuth", userAdmin, (req, res) => {
    res.send("Data Successfully Loaded !!");
})

/* Another method of Writing Middleware */

app.get("/common/userInfo", commonUser , (req , res ) => {
   res.send("Information fetched Successfully");
});

app.get("/common/deleteInfo", commonUser , (req,res) => {
   res.send("Deleted information Successfully");
})


app.listen(5000, () => {
    console.log("server running successfully on port 5000....");
});

/*
Output:
 test1: /userAuth
 Authorized
 Get All Data


 test2: /AdminAuth
 Admin Authorized
 Get All Data

test3: /testingmiddleware
iam middleware
iam api
 */
