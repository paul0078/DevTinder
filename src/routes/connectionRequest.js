const app = require("express");
const { userAuthReUse } = require("../utils/middleware");
const {FinalConnection} = require("../models/connectionSchema");
const UserModels = require("../models/schema");
const connectionRoute = app.Router();

//without middleware useAuthReUse => if no token => it work no security => it wont throw error => show success
// with missleware useAuthReUse =>  if no token => it wont work no security => throw error
///gettestdetails/:status/:userId => /:status is dynamic it might be intrested or ignored /: this is user to id


//sending ------from user (ignore / intrest) ------ To user
connectionRoute.post("/gettestdetails/:status/:userId", userAuthReUse, async (req, res) => {
  try {
    let user_name = req.userName;
    let from_UserId = user_name._id; // login person took from userAuth
    let to_UserId = req.params.userId; // which ever id param we r sending in api 
    let connection_Status =  req.params.status;
     
   // ✅ check user exists
    let IsToUserIdDetails = await UserModels.findOne({ _id: to_UserId }).exec();
 
    if(!IsToUserIdDetails){
        throw new Error("User Id is not in Db!!")
    }
    

    // ✅ duplicate check forward + reverse
    // avoid Duplication once request sent dont allow to send Again 
    // dont use find it gives array , so use findOne it gives one Object details
    //$or present in mongodb document
    let isCheck = await FinalConnection.findOne({
       $or: [
      { fromUserId: from_UserId , toUserId: to_UserId}, // A --> B
      { fromUserId: to_UserId , toUserId: from_UserId},  // B ---> A
      ]
    })
    
    /*
      test cases:
      1. forward and revers senario  => $or senario
       * login to dhoni use meenu id , dhoni send intrested request to meenu  => successfully sent request
        * login to meenu use dhoni id , meenu send intrested request to dhoni  => should show error  
      2. dulpication avoid => same person sending to toUser more than one time intrest
     */
   
    if(isCheck){
       throw new Error("Connection Already Exist !!!")
    }

      // ✅ status allowed only
    let IsStatusCheck = ["ignore", "Intrested"]

    if(!IsStatusCheck.includes(connection_Status)){
       throw new Error("Wrong status Checking !!")
    }
    
       // ✅ save
    //saving fromId,ToId , Status in db
    let user_Connections = new FinalConnection({
      fromUserId: from_UserId,
      toUserId: to_UserId,
      status: connection_Status
    })

     if(!user_Connections){
      throw new Error("Connection is not Valid !!");
    }
   
    await user_Connections.save(); // saving in new request
   
     res.status(200).json({
      msg: `${user_name.firstName} is  ${connection_Status} in ${IsToUserIdDetails.firstName}`,
    });
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
});


//♾️🕧Review Api  --------- to User (if intrested => Accepted / Rejected)----- From User
connectionRoute.post("/gettestdetails/review/:status/:requestId", userAuthReUse , async (req, res) => {
  try{
    const loginId = req.userName;
    
    const { status,requestId } = req.params;

   
    // ✅ status allowed only
    let IsStatusCheck = ["Accepted", "Rejected"]

    if(!IsStatusCheck.includes(status)){
       throw new Error("Wrong status Checking !!")
    }
   
    let connectionRequestData = await FinalConnection.findOne({
      _id: requestId, // in postman dont send user id send FinalConnection data Created id
      toUserId: loginId._id, // 
      status: "Intrested" // check the status is intrested
    })
   
    if(!connectionRequestData){
      throw new Error("Connection is not Valid !!");
    }

    
   
   // ✅ after checking status is intrested assign param status into the connectionData
   connectionRequestData.status = status;

    const data = await connectionRequestData.save()
   
    res.status(200).json({
      msg: `User is ${status} in Your Profile`,
      data: data
    })
  }catch(err){
    res.status(404).json({
        msg: err.message || "Something Went Wrong !!"
    })
  }
})

module.exports = {
  connectionRoute,
};


/*
Think Corner Cases So it prevents attacker to get Your details 
1. check to User id present in db
2. dont send request to urself so plz keep validation
3. once u sent you request  dont send again , avoid duplication
4. and opposite side , once u sent request , if opposite side also sending to u request show validation already request sent
5. Only Intrested , ignored status allowed it, they are sending remaining other status like Accpected or Rejected plz throw Error
*/