import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: String,
    userEmail: String,

    helperName: String,
    helperEmail: String,

    address: String,
    duration: String,
    amount:{type:Number,default:100},
    description: String,

    status: {
      type: String,
      enum: ["pending", "accepted", "pending_confirmation", "completed", "cancelled"],
      default: "pending",
    },
rating: {
  type: Number,
  min: 1,
  max: 5,
}
,
 helperPaymentStatus : {
  type: String,
  enum: ["pending", "confirmed"],
  default: "pending",
  },
    paymentStatus: {
  type: String,
  enum: ["pending", "confirmed"],
  default: "pending",
}
,
   
  },
 
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);