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






export const getHelperUserInsights = async (req, res) => {
  try {

    const helperId = req.user._id;

    const insights = await Request.aggregate([

      // get only requests handled by logged-in helper
      {
        $match:{
          helperId: helperId
        }
      },

      // group requests by user
      {
        $group:{
          _id:"$userId",

          totalRequests:{
            $sum:1
          },

          completedRequests:{
            $sum:{
              $cond:[
                {$eq:["$status","completed"]},
                1,
                0
              ]
            }
          },

          ongoingRequests:{
            $sum:{
              $cond:[
                {$eq:["$status","accepted"]},
                1,
                0
              ]
            }
          },

          cancelledRequests:{
            $sum:{
              $cond:[
                {$eq:["$status","cancelled"]},
                1,
                0
              ]
            }
          },

          avgRating:{
            $avg:"$rating"
          },

          totalSpent:{
            $sum:"$amount"
          }

        }
      },


      // get user details
      {
        $lookup:{
          from:"users",
          localField:"_id",
          foreignField:"_id",
          as:"user"
        }
      },


      {
        $unwind:"$user"
      },


      {
        $project:{
          _id:0,

          name:"$user.name",
          email:"$user.email",

          totalRequests:1,
          completedRequests:1,
          ongoingRequests:1,
          cancelledRequests:1,

          avgRating:{
            $round:[
              {$ifNull:["$avgRating",0]},
              1
            ]
          },

          totalSpent:1
        }
      }

    ]);


    res.json(insights);


  } catch(error){

    console.log(error);

    res.status(500).json({
      message:"Failed to load insights"
    });

  }
};