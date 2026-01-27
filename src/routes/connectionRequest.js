const app = require("express");
const {userAuthReUse} = require("../utils/middleware");
const connectionRoute =  app.Router();

//without middleware useAuthReUse => if no token => it work no security => it wont throw error => show success
// with missleware useAuthReUse =>  if no token => it wont work no security => throw error
connectionRoute.get("/gettestdetails",userAuthReUse, async (req,res) => {
   
   let user_name = req.userName;
   
   try{
    res.status(200).json({
      msg:`${user_name.firstName} tested`
    });
   }catch(err){
      res.status(400).json({
        msg: err.message
      })
   }
   
});

module.exports = {
    connectionRoute
}


