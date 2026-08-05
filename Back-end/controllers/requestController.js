import Request from "../models/Request.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import AuditLog from "../models/AuditLog.js";



// controllers/requestController.js
export const getAllHelperPendingPayments = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get requests where helperPaymentStatus is pending
    const requests = await Request.find({ helperPaymentStatus: "pending" })
      .populate("helperId", "name email") // get helper info
      .populate("userId", "name email"); // optional, get user info

    res.json(requests);
  } catch (err) {
    console.error("Failed to fetch helper pending payments:", err);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * GET REQUESTS FOR A HELPER
 */



export const getLatestRequest = async (req, res) => {
  try {
    const request = await Request.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (!request) {
      return res.status(404).json({ message: "No request found" });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getRequestForHelper = async (req, res) => {
  try {
    const  helperId  = req.user._id;

    // if (!helperId || !mongoose.Types.ObjectId.isValid(helperId)) {
    //   return res.status(400).json({ message: "Invalid helper ID" });
    // }

    const requests = await Request.find({ helperId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Fetch helper requests error:", error);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/**
 * GET REQUESTS FOR A USER
 */
export const getUserRequests = async (req, res) => {
  try {
    console.log("Logged in user:", req.user);

    const requests = await Request.find({
      userId: req.user._id,
    })
      .populate("helperId", "name email")
      .sort({ createdAt: -1 });

    console.log("Requests:", requests);

    res.json(requests);
  } catch (error) {
    console.error("GET USER REQUESTS ERROR");
    console.error(error);
    console.error(error.stack);

    res.status(500).json({
      message: error.message,
    });
  }
};





/* ===================== CREATE REQUEST ===================== */
export const createRequest = async (req, res) => {
  try {
    const { helperId, address, duration, description, amount } = req.body;
    const user = req.user;

    const helper = await User.findById(helperId);
    if (!helper) return res.status(404).json({ message: "Helper not found" });

    const unpaidRequest = await Request.findOne({
      userId: user._id,
      paymentStatus: "pending",
    });

    if (unpaidRequest) {
      return res.status(400).json({
        message: "Please wait until payment is confirmed",
      });
    }

    const request = await Request.create({
      userId: user._id,
      helperId: helper._id,
      userName: user.name,
      userEmail: user.email,
      helperName: helper.name,
      helperEmail: helper.email,
      address,
      duration,
      description,
        amount,
      paymentStatus: "pending",
      helperPaymentStatus: "pending",
      status: "pending",
    });

    await AuditLog.create({
      action: "REQUEST_CREATED",
      performedBy: user._id,
      targetUser: helper._id,
      relatedRequest: request._id,
      status: "pending",
      actorRole: "user",
      details: "User created a service request",
    });

  res.status(201).json({
  message: "Request created",
  requestId: request._id,
  request
});
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== ACCEPT REQUEST ===================== */
export const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.helperId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    request.status = "accepted";
    await request.save();

    await AuditLog.create({
      action: "REQUEST_ACCEPTED",
      performedBy: req.user._id,
      targetUser: request.userId,
      relatedRequest: request._id,
      status: "accepted",
      actorRole: "helper",
      details: "Helper accepted the request",
    });

    res.json({ message: "Request accepted", request });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== REJECT REQUEST ===================== */
export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await request.save();

    await AuditLog.create({
      action: "REQUEST_REJECTED",
      performedBy: req.user._id,
      targetUser: request.userId,
      relatedRequest: request._id,
      status: "rejected",
      actorRole: "helper",
      details: "Helper rejected the request",
    });

    res.json({ message: "Request rejected", request });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== COMPLETE REQUEST ===================== */
export const completeRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "completed";
    await request.save();

    await AuditLog.create({
      action: "REQUEST_COMPLETED",
      performedBy: req.user._id,
      targetUser: request.helperId,
      relatedRequest: request._id,
      status: "completed",
      actorRole: "user",
      details: "User marked service as completed",
    });

    res.json({ message: "Service completed", request });
  } catch (error) {
    res.status(500).json({ message: "Failed to complete service" });
  }
};

/* ===================== RATE REQUEST ===================== */
export const rateRequest = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Only completed requests can be rated" });
    }

    if (request.rating) {
      return res
        .status(400)
        .json({ message: "Rating already submitted" });
    }

    // ✅ Save rating on request
    request.rating = rating;
    await request.save();

    // ✅ Update helper rating safely
    const helper = await User.findById(request.helperId);

    if (helper) {
      const currentRating = helper.rating || 0;
      const ratingCount = helper.ratingCount || 0;

      helper.rating =
        (currentRating * ratingCount + rating) / (ratingCount + 1);

      helper.ratingCount = ratingCount + 1;

      await helper.save();
    }

    // ✅ Create audit log (REQUIRED FIELDS ONLY)
    await AuditLog.create({
      action: "RATING_SUBMITTED",
      actorRole: "user",
      performedBy: req.user._id,
      targetUser: request.helperId,
      relatedRequest: request._id,
      status: "completed",
      rating,
      details: `User rated helper ${rating} stars`,
    });

    res.json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("RATE REQUEST ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===================== CANCEL REQUEST ===================== */
export const cancelRequest = async (req, res) => {
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: "cancelled" },
    { new: true }
  );

  await AuditLog.create({
    action: "REQUEST_CANCELLED",
    performedBy: req.user._id,
    targetUser: request.helperId,
    relatedRequest: request._id,
    status: "cancelled",
    actorRole: "user",
    details: "User cancelled the request",
  });

  res.json({ message: "Request cancelled" });
};

/* ===================== DELETE REQUEST ===================== */
export const deleteRequest = async (req, res) => {
  const request = await Request.findById(req.params.id);

  await AuditLog.create({
    action: "REQUEST_DELETED",
    performedBy: req.user._id,
    targetUser: request?.helperId,
    relatedRequest: request?._id,
    status: request?.status,
    actorRole: "user",
    details: "Request deleted",
  });

  await Request.findByIdAndDelete(req.params.id);
  res.json({ message: "Request deleted" });
};







export const deleteHelperRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request)
      return res.status(404).json({ message: "Request not found" });

    await request.deleteOne();
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getHelperUsersSummary = async (req, res) => {
  try {
    if (req.user.role !== "helper") {
      return res.status(403).json({ message: "Access denied" });
    }

    const data = await Request.aggregate([
      {
        $match: {
          helperId: req.user._id,
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$userId",
          userName: { $first: "$userName" },
          userEmail: { $first: "$userEmail" },
          completedServices: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user summary" });
  }
};



export const paymentPending = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.requestId,
      { paymentStatus: "pending" },
      { new: true }
    );

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





// export const paymentConfirm = async (req, res) => {
//   try {
//     const request = await Request.findById(req.params.requestId);
//     if (!request) return res.status(404).json({ message: "Request not found" });

//     request.paymentStatus = "confirmed";
//     await request.save();

//     res.json({ message: "Payment confirmed", request });
//   } catch (error) {
//     console.error("Payment confirm error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const paymentConfirm = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.requestId,
      { paymentStatus: "confirmed" },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ message: "User payment confirmed", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};

// Confirm helper payment
export const confirmHelperPayment = async (req, res) => {
  try {
    const helper = await User.findById(req.params.helperId);

    if (!helper) return res.status(404).json({ message: "Helper not found" });

    helper.helperPaymentStatus = "confirmed";
    await helper.save();

    res.json({ message: "Helper payment confirmed", helper });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to confirm helper payment" });
  }
};



// export const pendingPayments = async (req, res) => {
//   try {
//     const requests = await Request.find({ paymentStatus: "pending" });
//     res.json(requests);
//   } catch (error) {
//     console.error("Pending payments error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const pendingPayments = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const requests = await Request.find({ paymentStatus: "pending" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user payments" });
  }
};


// Mark helper payment as pending
// Mark helper payment as pending
export const helperPaymentPending = async (req, res) => {
  try {
    const helper = await User.findById(req.params.helperId);
    if (!helper) return res.status(404).json({ message: "Helper not found" });

    helper.helperPaymentStatus = "pending";
    await helper.save();

    res.json({ message: "Helper payment marked pending" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get helper payment status
export const getHelperPaymentStatus = async (req, res) => {
  try {
    const helper = await User.findById(req.params.helperId);
    if (!helper) return res.status(404).json({ message: "Helper not found" });

    res.json({ confirmed: helper.helperPaymentStatus === "confirmed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get helper payment status
// export const getHelperPaymentStatus = async (req, res) => {
//   const helper = await User.findById(req.params.helperId);
//   if (!helper) return res.status(404).json({ message: "Helper not found" });

//   res.json({ confirmed: helper.helperPaymentStatus === "confirmed" });
// };

export const getHelperPendingPayments = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const requests = await Request.find({ helperPaymentStatus: "pending" })
      .populate("helperId", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch helper payments" });
  }
};

/**
 * RATING
 */

