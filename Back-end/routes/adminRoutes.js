import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getAllUsers,
  toggleBlockUser,
  getAllHelpers,
  approveHelper,
  rejectHelper,
  getAllRequests,
  getAuditLogs,
  getDashboardStats,
  getWeeklyRequests,
  confirmHelperPayment,
  deleteRequestByAdmin,
  getPendingHelperPayments,
} from "../controllers/adminController.js";
import { getPendingPayments, verifyPayment } from "../controllers/adminController.js";
import { get } from "mongoose";
const router = express.Router();

// Protect all routes: only admin
router.use(authMiddleware, roleMiddleware("admin"));
router.put("/confirm-helper-payment/:helperId", confirmHelperPayment);
router.get("/helper-payments",getPendingHelperPayments);
// Users
router.get("/users", getAllUsers);
router.put("/users/block/:id", toggleBlockUser);

// Helpers
router.get("/helpers", getAllHelpers);
router.put("/helpers/approve/:id", approveHelper);
router.put("/helpers/reject/:id", rejectHelper);

// Requests
router.get("/requests", getAllRequests);

// Audit logs
router.get("/audit-logs", getAuditLogs);

// Dashboard
router.get("/dashboard", getDashboardStats);
router.get("/stats/weekly-requests", getWeeklyRequests);
router.get("/payments", getPendingPayments);  
router.post("/payments/verify/:id", authMiddleware, verifyPayment);
router.delete("/request/:id",authMiddleware,roleMiddleware("admin"),deleteRequestByAdmin);
export default router;
