const jwt = require("jsonwebtoken");
const UserModels = require("../models/schema");

//testing
const userAuth = (req, res, next) => {
  let token = "xyz";
  let isToken = token === "xyz";

  if (!isToken) {
    res.status(401).send("UnAuthorised");
  } else {
    //console.log("Authorized");
    next();
  }
};

//testing
const userAdmin = (req, res, next) => {
  let token = "xyz";
  let isToken = token === "xyz";

  if (!isToken) {
    res.status(401).send("Admin Access UnAuthorised");
  } else {
    //console.log("Admin Authorized");
    next();
  }
};

const commonUser = (req, res, next) => {
  //console.log("common function fetched");
  next();
};




//real test for Auth
const userAuthReUse = async (req, res, next) => {
  try {
    //accessing cookies from express cookie
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }

    //decoding json token so it gives hiden information means _id
    var decoded = await jwt.verify(token, "DevTinder$@!#432");
    //get the user data from db
    let user = await UserModels.findOne({ _id: decoded.id });
    if (!user) {
      throw new Error("Invalid User");
    }

    req.token = token;
    req.userName = user;
      
    next();
  } catch (err) {
    res.status(401).json({
      msg: err.message,
    });
  }
  
};

module.exports = {
  userAuth,
  userAdmin,
  commonUser,
  userAuthReUse,
};
