import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },

    actorRole: {
      type: String,
      enum: ["user", "helper", "admin"],
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },

    status: {
      type: String,
      default: null,
    },

    rating: {
      type: Number,
      default: null,
    },

    details: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);