// backend/routes/userRoutes.js
import express from "express";
import User from "../models/User.js"; // your Mongoose User model
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all helpers
router.get("/helpers", authMiddleware, async (req, res) => {
  try {
    const helpers = await User.find({ role: "helper" }).select("_id name email experience skills rating ratingCount completedServices");
    res.status(200).json(helpers);
  } catch (err) {
    console.error("Fetch helpers error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
