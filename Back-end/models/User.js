import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: ["user", "helper", "admin"],
      default: "user",
    },

    experience: {type: String, default: ""},
    skills: {type: [String], default: []},
    helperPaymentStatus: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    isBlocked: { type: Boolean, default: true },

    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    completedServices: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);