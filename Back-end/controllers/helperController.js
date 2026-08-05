import User from "../models/User.js";

/**
 * @route   GET /api/helpers
 * @desc    Get all approved helpers
 * @access  Public (or Protected if you want later)
 */
import Request from "../models/Request.js";

// Get all approved helpers (NO CHANGE)
export const getAllHelpers = async (req, res) => {
  try {
    const helpers = await User.find({
      role: "helper",
      status: "approved",
      isBlocked: false,
    }).select("-password");

    res.status(200).json(helpers);
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
export const getUsersHandledByHelper = async (req, res) => {
  try {
    const helperId = req.user._id;

    const users = await Request.aggregate([
      {
        $match: {
          helperId: helperId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$userId",
          completedServices: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          userName: "$user.name",
          userEmail: "$user.email",
          completedServices: 1,
          avgRating: { $round: ["$avgRating", 1] },
        },
      },
    ]);

    res.status(200).json(users);
  } catch (error) {
    console.error("Users handled error:", error);
    res.status(500).json({ message: "Server error" });
  }
};






export const getHelperInsights = async (req, res) => {
  try {

    const helperId = req.user._id;


    const totalRequests = await Request.countDocuments({
      helperId
    });


    const completed = await Request.countDocuments({
      helperId,
      status:"completed"
    });


    const ongoing = await Request.countDocuments({
      helperId,
      status:"accepted"
    });


    const cancelled = await Request.countDocuments({
      helperId,
      status:"cancelled"
    });


    const ratingData = await Request.aggregate([
      {
        $match:{
          helperId,
          rating:{
            $exists:true
          }
        }
      },
      {
        $group:{
          _id:null,
          avgRating:{
            $avg:"$rating"
          }
        }
      }
    ]);


    const avgRating =
      ratingData.length > 0
      ? Number(ratingData[0].avgRating.toFixed(1))
      : 0;



    const totalSpent = await Request.aggregate([
      {
        $match:{
          helperId,
          status:"completed"
        }
      },
      {
        $group:{
          _id:null,
          total:{
            $sum:"$amount"
          }
        }
      }
    ]);



    const recentRequests = await Request.find({
      helperId
    })
    .populate("userId","name email")
    .sort({
      createdAt:-1
    })
    .limit(5);



    res.json({

      totalRequests,

      completed,

      ongoing,

      cancelled,

      avgRating,

      totalSpent:
      totalSpent.length
      ? totalSpent[0].total
      : 0,


      recentRequests

    });


  } catch(error){

    console.error(
      "Helper insights error:",
      error
    );

    res.status(500).json({
      message:"Failed to fetch insights"
    });

  }
};