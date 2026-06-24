import User from "../models/User.js";
import Request from "../models/Request.js";



// Get all approved helpers (NO CHANGE)
// export const getAllHelpers = async (req, res) => {
//   try {
//     const helpers = await User.find({
//       role: "helper",
//       status: "approved",
//       isBlocked: false,
//     }).select("-password");

//     res.status(200).json(helpers);
//   } catch (error) {
//     console.error("Get helpers error:", error);
//     res.status(500).json({ message: "Failed to fetch helpers" });
//   }
// };

export const getAllHelpers = async (req, res) => {
  try {
    const helpers = await User.find({
      role: "helper",
      status: "approved",
      isBlocked: false,
    }).select("-password");

    const helpersWithStats = await Promise.all(
      helpers.map(async (helper) => {
        const completedServices = await Request.countDocuments({
          helperId: helper._id,
          status: "completed",
        });

        return {
          ...helper._doc,
          completedServices, // ✅ ADD THIS
        };
      })
    );

    res.status(200).json(helpersWithStats);
  } catch (error) {
    console.error("Get helpers error:", error);
    res.status(500).json({ message: "Failed to fetch helpers" });
  }
};

// Helper -> see his requests
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      helperId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Get helper requests error:", error);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

// ✅ FIXED: Users handled by helper
// export const getUsersHandledByHelper = async (req, res) => {
//   try {
//     const helperId = req.user._id;

//     const users = await Request.aggregate([
//       {
//         $match: {
//           helperId: helperId,
//           status: "completed",
//         },
//       },
//       {
//         $group: {
//           _id: "$userId",
//           completedServices: { $sum: 1 },
//           avgRating: { $avg: "$rating" },
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "_id",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: "$user" },
//       {
//         $project: {
//           _id: 1,
//           userName: "$user.name",
//           userEmail: "$user.email",
//           completedServices: 1,
//           avgRating: { $round: ["$avgRating", 1] },
//         },
//       },
//     ]);

//     res.status(200).json(users);
//   } catch (error) {
//     console.error("Users handled error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };





// Helper -> see all users who requested & completed services
export const getUsersServed = async (req, res) => {
  try {
    const helperId = req.user._id;

    const requests = await Request.find({
      helperId,
      status: "completed",
    })
      .populate("userId", "name email")
      .select("description duration amount createdAt updatedAt rating") // populate user's name & email
      .sort({ updatedAt: -1 }); // latest first

    // Format data for frontend
    const data = requests.map((req) => ({
      requestId: req._id,
      userName: req.userId?.name || "Unknown",
      userEmail: req.userId?.email || "Unknown",
      description: req.description,
     duration:req.duration,
     amount:req.amount,
      requestDate: req.createdAt,
      completedAt: req.updatedAt,
      rating: req.rating,
      // feedback: req.feedback,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Get users served error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserInsights = async (req, res) => {
  try {
    const helperId = req.user._id;

    const users = await Request.aggregate([
      // 1. Only this helper's requests
      {
        $match: {
          helperId: helperId,
        },
      },

      // 2. Group by user
      {
        $group: {
          _id: "$userId",

          totalRequests: { $sum: 1 },

          completedRequests: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },

          ongoingRequests: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
          },

          cancelledRequests: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },

          avgRating: { $avg: "$rating" },

          totalSpent: {
            $sum: {
              $cond: [
                { $eq: ["$status", "completed"] },
                "$amount",
                0,
              ],
            },
          },

          recentRequests: {
            $push: {
              description: "$description",
              status: "$status",
              createdAt: "$createdAt",
            },
          },
        },
      },

      // 3. Sort recent requests (latest first)
      {
        $addFields: {
          recentRequests: {
            $slice: [
              { $reverseArray: "$recentRequests" },
              3, // show last 3
            ],
          },
        },
      },

      // 4. Get user details
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },

      // 5. Final format
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          email: "$user.email",

          totalRequests: 1,
          completedRequests: 1,
          ongoingRequests: 1,
          cancelledRequests: 1,

          avgRating: { $round: ["$avgRating", 1] },
          totalSpent: 1,
          recentRequests: 1,
        },
      },

      // 6. Sort by most active users
      {
        $sort: { totalRequests: -1 },
      },
    ]);

    res.status(200).json(users);
  } catch (error) {
    console.error("User insights error:", error);
    res.status(500).json({ message: "Server error" });
  }
};