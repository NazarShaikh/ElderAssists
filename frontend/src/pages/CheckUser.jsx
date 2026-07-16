


import React, { useEffect, useState } from "react";
import api from "../services/api";

const CheckUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserInsights();
  }, []);

  const fetchUserInsights = async () => {
    try {
      const res = await api.get("/helpers/insights");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load user insights.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading user insights...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  if (users.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">
        No user data available.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 pt-24 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          User Insights
        </h1>

        <div className="grid gap-6 sm:grid-cols-2">
          {users.map((u, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition"
            >
              {/* USER INFO */}
              <div className="mb-4">
                <p className="text-xl font-semibold text-gray-800">
                  {u.name}
                </p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <p><b>Total Requests:</b> {u.totalRequests}</p>
                <p><b>Completed:</b> {u.completedRequests}</p>
                <p><b>Ongoing:</b> {u.ongoingRequests}</p>
                <p><b>Cancelled:</b> {u.cancelledRequests}</p>
              </div>

              {/* RATING & MONEY */}
              <div className="mt-3 text-sm text-gray-700">
                <p>
                  <b>Avg Rating Given:</b>{" "}
                  {u.avgRating ? `${u.avgRating} ⭐` : "Not Rated"}
                </p>
                <p>
                  <b>Total Spent:</b> ₹{u.totalSpent || 0}
                </p>
              </div>

              {/* RECENT REQUESTS */}
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Recent Requests:
                </p>

                {u.recentRequests && u.recentRequests.length > 0 ? (
                  <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                    {u.recentRequests.map((req, i) => (
                      <li key={i}>
                        {req.description || "No description"} —{" "}
                        <span className="capitalize">{req.status}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CheckUser;