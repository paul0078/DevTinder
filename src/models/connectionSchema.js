const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConnectionRequestModule = new Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
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

// ✅ self request validation
// test cases  => dhoni send his same id for the api he is sending connection himself should Fail
//pre present in mongoose document middleware
ConnectionRequestModule.pre('save', function() {
    
    if(this.fromUserId.equals(this.toUserId)){
       throw new Error("self request not allowed !!")
    }
});


const FinalConnection = new mongoose.model("connection", ConnectionRequestModule);

module.exports = {FinalConnection};