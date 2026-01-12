const express = require("express");
const app = express();
/*
   if we use app.use in the Top what it will happen
   use.match it match for all http methods, 
   order matters , it takes first priority
*/

// app.use("/user", (req, res) => {
//     res.send("Iam a user")
// })

//it will only handle Get call
app.get("/user" , (req,res) => {
    let data = {
        name: "Mala",
        age: 26
    }
    res.send(data)
}) 

app.post("/user", (req,res) => {
    // it will save in data base
     res.send(" Data Sent Successfully !! ");
})

app.delete("/user", (req,res) => {
    res.send(" one Data deleted Successfully ");
})

// app.use("/test/50",(req, res) => {
//     res.send("Iam just testing id !!");
// })

// app.use("/test",(req, res) => {
//     res.send("Iam Test Branch !!");
// })

/* this app.use match all Http method Api calls to test */
// app.use("/hello",(req, res) => {
//     res.send("Iam Hello Branch !!");
// })

// app.use("/",(req, res) => {
//     res.send("Iam  Express !!");
// })

app.listen(5000 , () => {
    console.log("Iam  Successfully Running Port 5000");
});

/*
    here is the correct postion for routing

    "/"
   1. if u take /  thing at top it always execute "Iam express "
    if i change /hello , /test Also  it wont work
   2. so keep the default "/" one at the all route 
     below so it work good work for all Route
  
     "/test" & "/test/50"
    1. and one more order if u bring /test/id below the /test , that /test/50  it wont work 
    so keep /test/50 top of the /test
*/
