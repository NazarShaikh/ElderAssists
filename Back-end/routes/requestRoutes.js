

import express from "express";
import auth from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import Request from "../models/Request.js";
import {
  getUserRequests,
  getRequestForHelper,
  createRequest,
  cancelRequest,
  markWorkDone,
  deleteRequest,
  acceptRequest,
  getAllHelperPendingPayments,
  getHelperPendingPayments,
  rejectRequest,
  completeRequest,
  paymentPending,
  rateRequest,
  paymentConfirm,
  pendingPayments,
  getHelperUsersSummary,
  helperPaymentPending,
  deleteHelperRequest,
  getLatestRequest,
} from "../controllers/requestController.js";

const router = express.Router();

// CRUD & Request Routes
router.get("/pending-payments", auth, roleMiddleware("admin"), pendingPayments);
router.post("/", auth, createRequest);
router.get("/latest", auth, getLatestRequest);
router.get("/user", auth, getUserRequests);
router.get("/helper", auth, getRequestForHelper);
router.get("/helper/user-summary", auth, getHelperUsersSummary);

router.put("/:id/mark-done", auth, markWorkDone);
router.put("/accept/:id", auth, acceptRequest);
router.put("/reject/:id", auth, rejectRequest);
router.put("/cancel/:id", auth, cancelRequest);
router.put("/:id/complete", auth, completeRequest);
router.put("/:id/rate", auth, rateRequest);
router.delete("/delete/:id", auth, deleteHelperRequest);

// ✅ NEW ROUTE: Get request by ID
router.get("/:requestId", auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId)
      .populate("helperId", "name email experience skills")
      .populate("userId", "name email");

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json(request);
  } catch (err) {
    console.error("Fetch request by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Payment Routes
router.put("/:requestId/payment-pending", auth, paymentPending);
router.put("/:requestId/payment-confirm", auth, roleMiddleware("admin"), paymentConfirm);

// Export router
export default router;