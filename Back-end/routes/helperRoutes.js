import express from "express";
import auth from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getAllHelpers,
  getMyRequests,
  getUsersHandledByHelper,
   getHelperInsights
} from "../controllers/helperController.js";

const router = express.Router();

router.get(
 "/insights",
 auth,
 roleMiddleware("helper"),
 getHelperInsights
);
// Helper must be logged in
router.get("/my-requests", auth, roleMiddleware("helper"), getMyRequests);

// Helper dashboard - users served
router.get(
  "/check-users",
  auth,
  roleMiddleware("helper"),
  getUsersHandledByHelper
);

// Public
router.get("/", getAllHelpers);

export default router;
