import express from "express";
import auth from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getAllHelpers,
  getMyRequests,
  // getUsersHandledByHelper,
  getUsersServed,
  getUserInsights,
} from "../controllers/helperController.js";
// import { getUserRequests } from "../controllers/requestController.js";
const router = express.Router();

// Helper must be logged in
router.get("/my-requests", auth, roleMiddleware("helper"), getMyRequests);
router.get("/insights", auth, roleMiddleware("helper"), getUserInsights);
// Helper dashboard - users served
// router.get(
//   "/check-users",
//   auth,
//   roleMiddleware("helper"),
//   getUsersHandledByHelper
// );
router.get("/users-served", auth, roleMiddleware("helper"), getUsersServed);

// Public
router.get("/", getAllHelpers);

export default router;
