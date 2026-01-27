const { userAuthReUse } = require("../utils/middleware");
const { UserValidationDetails , UserPassword } = require("../utils/validations");
const bcrypt = require("bcrypt");
const UserModels = require("../models/schema");
const app = require("express");
const profileRoute =  app.Router();

//view
profileRoute.get("/profile/view", userAuthReUse, async (req, res) => {
  try {
    const userdetails = req.userName;
   
    res.status(200).json({
      userDeatails: userdetails,
      msg: `${userdetails.firstName} Profile details Success !!`,
    });
  } catch (err) {
    res.status(401).json({
      msg: err.message,
    });
  }
});

//Update
profileRoute.patch("/profile/update", userAuthReUse , async(req,res) => {
   try{
     await UserValidationDetails(req.body);
     
     const userId = req.userName._id;
     const updatedUser = await UserModels.findByIdAndUpdate(
       userId,
       req.body,
       { runValidators: true, new: true }
     );

     res.status(200).json({
       msg: "profile updated Successfully!!!",
       user: updatedUser
     });
   }catch(err){
      res.status(400).json({
        msg: err.message,
      });
   }
});

//changepassword
profileRoute.patch("/profile/changepassword", userAuthReUse , async(req,res) => {
   try{
       let user = req.userName;
       const { newPassword, oldPassword } = req.body;
       
       if (!oldPassword || !newPassword) {
         throw new Error("oldPassword and newPassword are required");
       }
       
       // Verify current password
       // passwordbcrypt => it takes pasyload password hashed internally and compares with db , and gives boolean , actuallyit is not returning
       const isCurrentPasswordValid = await user.passwordbcrypt(oldPassword); 
       
       if (!isCurrentPasswordValid) {
         throw new Error("Current password is incorrect");
       }
       
       // Validate new password
       await UserPassword(newPassword, user);
       
       // Hash new password // Creates and RETURNS the actual hash
       const hashedPassword = await bcrypt.hash(newPassword, 10);
       
       // Update password in database
       const userId = req.userName._id;
       const updatedUser = await UserModels.findByIdAndUpdate(
         userId,
         { password: hashedPassword },
         { runValidators: true, new: true }
       );
       
       console.log("password change", updatedUser);
       res.status(200).json({
         msg: "Password updated successfully!",
         user: updatedUser
       });
   }catch(err){
     res.status(400).json({
        msg: err.message,
      });
   }
});

module.exports = {
   profileRoute
}