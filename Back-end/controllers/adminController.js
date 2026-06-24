import User from "../models/User.js";
import Request from "../models/Request.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};



export const confirmHelperPayment = async (req, res) => {
  const helper = await User.findById(req.params.helperId);

  if (!helper) return res.status(404).json({ message: "Helper not found" });

  helper.helperPaymentStatus = "confirmed";
  await helper.save();

  res.json({ message: "Helper payment confirmed" });
};


// Block or Unblock a user
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ message: user.isBlocked ? "Blocked" : "Unblocked" });
  } catch (err) {
    console.error("Block/Unblock user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all helpers
export const getAllHelpers = async (req, res) => {
  try {
    const helpers = await User.find({ role: "helper" }).select("-password");
    res.status(200).json(helpers);
  } catch (err) {
    console.error("Get helpers error:", err);
    res.status(500).json({ message: "Failed to fetch helpers" });
  }
};

// Approve a helper
export const approveHelper = async (req, res) => {
  try {
    const { id } = req.params;
    const helper = await User.findById(id);
    if (!helper) return res.status(404).json({ message: "Helper not found" });

    helper.status = "approved";
    await helper.save();

    res.status(200).json({ message: "Helper approved" });
  } catch (err) {
    console.error("Approve helper error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject a helper
export const rejectHelper = async (req, res) => {
  try {
    const { id } = req.params;
    const helper = await User.findById(id);
    if (!helper) return res.status(404).json({ message: "Helper not found" });

    helper.status = "rejected";
    await helper.save();

    res.status(200).json({ message: "Helper rejected" });
  } catch (err) {
    console.error("Reject helper error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Get requests error:", err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};


import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("performedBy", "name email role")
      .populate("targetUser","name email role")
      .populate("relatedRequest","status rating")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    console.error("Get audit logs error:", err);
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};


// Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalHelpers = await User.countDocuments({ role: "helper" });
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: "pending" });
    const acceptedRequests = await Request.countDocuments({ status: "accepted" });
    const completedRequests = await Request.countDocuments({ status: "completed" });
    const pendingPayments = await Request.countDocuments({ paymentStatus: "pending" });

    res.json({
      users: totalUsers,
      helpers: totalHelpers,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      completedRequests,
      pendingPayments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// adminController.js





// Weekly requests stats
export const getWeeklyRequests = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const requests = await Request.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(requests);
  } catch (err) {
    console.error("Weekly requests error:", err);
    res.status(500).json({ message: "Failed to fetch weekly requests" });
  }
};

export const getPendingHelperPayments = async (req, res) => {
  const helpers = await User.find({
    role: "helper",
    helperPaymentStatus: "pending",
  }).select("name email helperPaymentStatus");

  res.json(helpers);
};

export const getPendingPayments = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const requests = await Request.find({ paymentStatus: "pending" });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.paymentStatus = "confirmed";
    await request.save();
    res.json({ message: "Payment verified", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};



export const deleteRequestByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await request.deleteOne();

    res.json({ message: "Request deleted by admin successfully" });
  } catch (error) {
    console.error("Admin delete request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};