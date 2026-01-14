const userAuth = (req,res , next) => {
    let token = "xyz";
    let isToken = token === "xyz";

    if(!isToken){
        res.status(401).send("UnAuthorised");
        
    }else{
        console.log("Authorized")
         next();
    }
}

const userAdmin = (req,res,next) => {
    let token = "xyz";
    let isToken = token === "xyz";

    if(!isToken){
        res.status(401).send("Admin Access UnAuthorised");
        
    }else{
        console.log("Admin Authorized")
         next();
    }
}

 const commonUser = (req,res,next) => {
     console.log("common function fetched")
      next();
 };

module.exports = {
    userAuth , userAdmin , commonUser
}