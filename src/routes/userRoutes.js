///request/review/:status/:requestId
const express = require("express");
const ReviewRoute = express.Router();
const { FinalConnection } = require("../models/connectionSchema");
const { userAuthReUse } = require("../utils/middleware");

const commonFields = "firstName lastName gender age skills photoUrl";
//intrested data fetch , getting all the connection request for the Logged in User
ReviewRoute.get("/user/requests", userAuthReUse, async (req, res) => {
  try {
    const loginId = req.userName;

    let connectionData = await FinalConnection.find({
      toUserId: loginId._id,
      status: "Intrested",
    }).populate("fromUserId", commonFields);

    if (!connectionData || !connectionData.length === 0) {
      throw new Error("Connection is Invalid!!");
    }

    res.status(200).json({
      msg: "Data fetched Successfully",
      data: connectionData,
    });
  } catch (err) {
    res.status(400).json({
      msg: err.msg,
    });
  }
});

//Accepted data, getting all the Connection Data to logged in User
ReviewRoute.get("/user/connections", userAuthReUse, async (req, res) => {
  try {
    const loginId = req.userName;

    /*
         Here 2 senarios comes
         x ===> y = accepted
         y ====> z = accepted

         * X sent request to Y  = accepted  , so here Y accepted X
         * Y sent request to Z  = accepted  , so here Z accpted Y
         Note : * Y is 2 connection X and Y 
                * X is 1 connection from Y
                * z is 1 connection from Y
        */

    const connectionData = await FinalConnection.find({
      $or: [
        { fromUserId: loginId._id, status: "Accepted" }, // A --> B
        { toUserId: loginId._id, status: "Accepted" }, // B ---> A
      ],
    })
      .populate("fromUserId", commonFields)
      .populate("toUserId", commonFields);

    if (!connectionData || connectionData.length === 0) {
      throw new Error("No connections found!!");
    }
    // ✅ Map through all connections and return the other user
    const userFilterData = connectionData.map((ele) => {
      if (ele.fromUserId._id.toString() === loginId._id.toString()) {
        return ele.toUserId;
      }

      return ele.fromUserId;
    });

    res.status(200).json({
      msg: "Data fetched Successfully",
      data: userFilterData,
    });
  } catch (err) {
    res.status(400).json({
      msg: err.msg,
    });
  }
});

//feed api
ReviewRoute.get("/user/feed", userAuthReUse, async (req, res) => {
  try {
    const loginId = req.userName;
    let connectionData = await FinalConnection.find({
      $and: [
        {
          $or: [
            {
              fromUserId: loginId._id, // Sent connection Request 
            },
            {
              toUserId: loginId._id, // Recieved Connection Request 
            }
          ],
        },
        {
          status: { $nin: ["Accepted", "ignore", "Intrested"] },
        },
      ],
    });

    res.status(200).json({
      message: "All Data Fetched Successfully",
      data: connectionData,
    });
  } catch (err) {
    res.status(505).json({
      message: err.message || "Something went wrong",
    });
  }
});

module.exports = { ReviewRoute };

/*
   Feed Api for get all list in the main i will give you few conditions
   --------------------------------------------------------------------

   conditions
   ==========
   1. if currentuser is ignored that users should not be in list
   2. if currentuser  is already friend means accepted by some one that user should not be in list
   3. if currentuser is sent intrest thats users should not be there

*/
