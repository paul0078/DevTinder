const express = require("express");
const app = express();
const {userAuth ,userAdmin, commonUser} = require("./src/utils/middleware");


/* 

 NOTE:
 This is a GLOBAL middleware.
 It runs for ALL routes.

 Examples:
 - Calling /testing → this middleware runs
 - Calling /userAuth → this middleware runs
 - Calling any route → this middleware runs

 This is NOT bad practice by default.
 Global middleware is good for:
 - logging
 - body parsing
 - security checks

 But it is a BAD practice to use global middleware
 for route-specific logic like authentication.
app.use((req, res, next) => { 
    console.log("iam middleware");
    next(); 
});
 so write it in down how i write code
*/

/*

Interview One-Liner (Very Important ⭐)
Global middleware is good for common logic,
but route-specific logic should be applied only to required routes.
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
 app.use("/common", commonUser);
app.get("/common/userInfo" , (req , res ) => {
   res.send("Information fetched Successfully");
});

app.get("/common/deleteInfo" , (req,res) => {
   res.send("Deleted information Successfully");
})

app.use("/", (err, req, res, next) => {
    if (err) {
        console.error("inside if",err);
        return res.status(500).send("1st => Something went wrong !!!");
    }
   
});

// Error-handling middleware must accept 4 arguments: (err, req, res, next)
app.use("/testing", (req, res) => {

    try{
      throw new Error("Basic error")
    }catch{
      
      res.status(500).send("UnAuthorized Error !!");
    }
    
});

app.use("/", (err, req, res, next) => {
    if (err) {
        console.error("inside if",err);
        return res.status(500).send("last => Something went wrong !!!");
    }
});


/*
  Note :
  test1 : /testing
  if try catch there catch block execute and send response
if catch and throw not there only throw present then error handling middleware will execute and send response
    test2 : / => line 68 and 88 present
      its takes bottom / error  last => Something went wrong !!!
    test3 : / => line 68 and 88 not present
        its takes Basic error from throw new Error("Basic error")
*/



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
