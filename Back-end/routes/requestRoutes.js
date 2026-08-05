import express from "express";
import auth from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import Request from "../models/Request.js";
import {
  getUserRequests,
  getRequestForHelper,
  createRequest,
  cancelRequest,
  
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
} from "../controllers/requestController.js";
import { confirmHelperPayment } from "../controllers/adminController.js";

const router = express.Router();

// CRUD
router.post("/", auth, createRequest);
router.get("/user", auth, getUserRequests);
// backend route
router.get("/helper", auth, async (req, res) => {
  const requests = await Request.find({ helperId: req.user._id })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.json(requests);
});
// router.get("/helper/:helperId", auth, getRequestForHelper);
router.get("/helper/user-summary",auth,getHelperUsersSummary)

// router.put("/:id/complete", completeRequest);
router.put("/:id/rate", rateRequest);

router.put("/accept/:id", auth, acceptRequest);
router.put("/reject/:id", auth, rejectRequest);
router.put("/cancel/:id", auth, cancelRequest);
// router.delete("/delete/:id", auth, deleteRequest);

// Payments
router.put("/:requestId/payment-pending", auth, paymentPending);
router.put("/:requestId/payment-confirm", auth, roleMiddleware("admin"),paymentConfirm);
// router.put("/user/helper/:helperId/payment-confirm", auth, roleMiddleware("admin"), confirmHelperPayment);  
// ✅ Payment status per request
router.get("/:requestId/payment-status", auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json({ confirmed: request.paymentStatus === "confirmed" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Legacy: get latest request by user
router.get("/user/:userId/latest-payment-status", auth, async (req, res) => {
  try {
    const request = await Request.findOne({ userId: req.params.userId }).sort({ createdAt: -1 });
    if (!request) return res.json({ confirmed: false });
    res.json({ confirmed: request.paymentStatus === "confirmed", requestId: request._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/pending-payments", auth, pendingPayments);
router.put("/helper/:helperId/payment-confirm", auth, roleMiddleware("admin"), confirmHelperPayment);
router.get("/helper-pending-payments", auth, roleMiddleware("admin"),getAllHelperPendingPayments);
// router.get("all-helper-pending-payments", auth,  getHelperPendingPayments);

router.put("/:id/complete", auth, completeRequest);
router.put("/:id/rate", auth, rateRequest);
router.put("/users/helper/:helperId/payment-pending",auth,helperPaymentPending)
router.delete("/delete/:id", auth, deleteHelperRequest);
export default router;
