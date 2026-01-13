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


app.get("/userDetail", (req,res) => {
    /*
    test1:
    /userDetail/:userId/:name/:pas  => dynamic way of sending query
    in postman u need to send like this => /34/mala/test@123
     console.log(req.params);
     params
     {
      userId: '77',
      name: 'mala',
      pass: 'test@123'
      }
    test2:
     console.log(req.query);
     http://localhost:5000/userDetail/?userId=77&name=Meenu&pas=pass@123
       query => 
        {
        userId: '77',
        name: 'Meenu',
        pas: 'pass@123'
        }
    */
  console.log(req.query);
 res.send("queries Testing");
})

app.get("/user" , (req,res) => {
    let data = {
        name: "Mala",
        age: 26
    }
    res.send(data)
}) 


/*
app.use("/testing",(req, res) => {
  console.log("iam  executing 1st");}
  )
 Note : it just Sending Request  wont execute Anything .....  
*/

//test 1
app.use("/example",
(req,res) => {
 console.log("iam executing 1st");
 res.send("iam Done");
},
(req,res) => {
 console.log("iam executing 2nd");
}
)

//test 2
app.use("/example1",
(req,res, next) => {
 console.log("iam executing 1st");
 next();
},
(req,res) => {
 console.log("iam executing 2nd");
 res.send("iam Done 2nd step");
}
)


//test 3
app.use("/example2",
(req,res, next) => {
 console.log("iam executing 1st");
 res.send("iam Done 1st step");
 next();
},
(req,res) => {
 console.log("iam executing 2nd");
 }
)

//test 4
app.use("/example3",
(req,res, next) => {
 console.log("iam executing 1st");
 next();
 res.send("iam Done 1st step");
},
(req,res) => {
 console.log("iam executing 2nd");
 res.send("iam Done 2nd step");
 }
)

//test 5
app.use("/example4",
[(req,res, next) => {
 console.log("iam executing 1st");
 next();
 },
(req,res,next) => {
 console.log("iam executing 2nd");
 next();
 }],
 (req,res,next) => {
 console.log("iam executing 3rd");
 next();
 },
(req,res) => {
 console.log("iam executing 4th");
 res.send("iam Done 4th step");
 }
)


/*
  Note:
   1. test1 => in 1st Route handler it executes and sends response  and stops there only 2nd handler wont execute
   2. test2 => 1st handler gives next() so it goes to 2nd handler and executes and sends response
   3. test3 => in 1st handler it sends response and after that it gives next() so it goes to 2nd handler and
    try to execute but it cant send response again bz already response sent in 1st handler so it gives error
    "Cannot set headers after they are sent to the client"
   4. test4 => 1st handler gives next() first it goes to next step and executes 2nd handler and sends response
    after that it comes back to 1st handler and try to send response again but it cant send response again 
    bz already response sent in 2nd handler so it gives error "Cannot set headers after they are sent to the client"
    5.test5 => it is array of middlewares 1st and 2nd handler are in array it executes one by one and gives next()
    after that it comes to 3rd handler and executes and gives next() after that it comes to 4th handler
    and executes and sends response
*/

/*
 if abc => ab?c => api takes ac also 
 if ab+c => inbetween a and c , we can add b as much we can add
 if ab*c => in between ab and c we can add anything we want
 if i/p => abcd => a(bc)+d => here bc is optional => can add bccbc => inbetween a and d 
 if i/p => /a/ => can give /a =>  can give /car  inwhere a comes it works => if we write /b insted of /a it wont work4\
 if we pass /.*fly$/ => regex => it takes butterfly , fly , but it wont take fly1
 app.get(/.*fly$/ , (req, res) => {
    res.send("Testing");
})

*/
// app.get(/.*fly$/ , (req, res) => {
//     res.send("Testing");
// })


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
