const { Validation } = require("../utils/validations");
const app = require("express");
const bcrypt = require("bcrypt");
const UserModels = require("../models/schema");
const authRoute = app.Router();

// create
authRoute.post("/signUp", async (req, res) => {
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
    //it convert the password to hash password
    const passwordhas = await bcrypt.hash(user.password, 10);
    const { firstName, lastName, gender, age, email, skills, photoUrl } = user;
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
authRoute.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
          // finding email in data base to fetch user details
          let dbuser = await UserModels.findOne({ email });
          if (!dbuser) {
            throw new Error("InvalidUser");
          }
      
          // it compares user entered password and data base password checks boolean value
          // let haspassword = await bcrypt.compare(password, dbuser.password);
           let haspassword = await dbuser.passwordbcrypt(password);
    if (haspassword) {
      //token genrates using jwt // (hiding user id,secret key should be in env file, expiry time can be added)
      let token = await dbuser.getJwtToken();
      // let token = await jwt.sign({ id: dbuser._id }, "DevTinder$@!#432", {
      //   expiresIn: "1h",
      // });
      if (!token) {
        throw new Error("Invalid Token");
      }

      // set cookie in the browser {expires : ,httpOnly: true} use httOnly in production
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000), 
      }); // Cookie Expires in One Hour
      // res.cookie(
      //   "token",
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsIm5hbWUiOiJNYWxhIiwiZXhwIjo5OTk5OTk5OTk5fQ.dummysignature123456",
      // );
      return res.status(200).json({
        message: "User Login Successfully!!",
      });
    } else {
      return res.status(401).json({
        message: "invalid Credentials !!",
      });
    }
  } catch (err) {
    res.status(500).send({
      // message: "Server Error",
      
      err: err.message,
    });
  }
});

authRoute.post("/logout", async(req,res) => {

   res.cookie("token", null , {
    expires: new Date(Date.now()) // current date
   }).status(200).json({
    msg: "Log Out Success !!"
   })


})

module.exports = {
    authRoute
}
