const express = require("express");
const Database = require("./src/config/database");
const cookieparser = require("cookie-parser");
const { authRoute } = require("./src/routes/authRoutes");
const { connectionRoute } = require("./src/routes/connectionRequest");
const { profileRoute } = require("./src/routes/profileRoutes");
const { ReviewRoute } = require("./src/routes/userRoutes");

// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const app = express();

// this helps to convert json data to javascript object it  acts
// as middleware or plugin and this javascript object sends back to req.body
app.use(express.json());
app.use(cookieparser());

// Mount authentication routes
app.use("/",authRoute);
app.use("/",connectionRoute);
app.use("/",profileRoute);
app.use("/",ReviewRoute);


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

/*
 jwt : holds the information about the user 
 there are 3 colors green white blue
  header: holds the algorithm and token type
  payload: holds the user information
  signature: used to verify the message is not changed

*/
