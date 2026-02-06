const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConnectionRequestModule = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "Intrested", "Accepted", "Rejected"],
        message: "`{VALUE}` is not Valid", // validation from Mongo db if the status is diffrent
      },
    },
  },
  {
    timestamps: true,
  },
);

// refrence => https://www.mongodb.com/docs/php-library/current/indexes/compound-index/
//compound index => 1 is asssending order , so it create uniq index => if we not sending id for each api , api will go Very slow
ConnectionRequestModule.index( { fromUserId: 1, toUserId: 1 },{ unique: true }) // use either fromUserId : 1 or unique 

// ✅ self request validation
// test cases  => dhoni send his same id for the api he is sending connection himself should Fail
//pre present in mongoose document middleware
// next is not needed for mongose v6+ more version , below that v6 version next is needed
ConnectionRequestModule.pre('save', async function() {
  const  user_Connections = this;
  if (user_Connections.fromUserId.equals(user_Connections.toUserId)) {
    throw new Error("You cannot send connection request to yourself");
  }

});


const FinalConnection = mongoose.model("connection", ConnectionRequestModule);

module.exports = {FinalConnection};


