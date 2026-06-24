import React, { useEffect, useState } from "react";
import api from "../services/api";

const HelperDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  

  const fetchRequests = async () => {
    try {
      const res = await api.get("/requests/helper");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure to ${status} this request?`)) return;
    await api.put(`/requests/${status}/${id}`);
    fetchRequests();
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    await api.delete(`/requests/delete/${id}`);
    fetchRequests();
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 pt-24 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Service Requests
        </h1>

        <div className="space-y-5">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-xl shadow-md p-5"
            >
              {/* TOP SECTION */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                {/* USER */}
                <div>
                  <p className="text-sm text-orange-600 font-semibold">
                    User
                  </p>

                  <p className="text-lg font-semibold text-gray-800">
                    {req.userName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {req.userEmail}
                  </p>
                </div>

                {/* STATUS + DATE */}
                <div className="flex items-center justify-between gap-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                      req.status
                    )}`}
                  >
                    {req.status.toUpperCase()}
                  </span>

                  <span className="text-sm text-gray-500">
                    {new Date(req.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-5  mt-4 flex-wrap">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === req._id ? null : req._id)
                  }
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
                >
                  {expandedId === req._id
                    ? "Hide Details"
                    : "View Details"}
                </button>

                <button
                  onClick={() => deleteRequest(req._id)}
                  className="px-4 py-2 bg-[#8A1D53] text-white rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>

              {/* DETAILS */}
{/* DETAILS */}
{req.status === "accepted" && (
  <button
    onClick={async () => {
      if (!window.confirm("Mark work as done?")) return;
      await api.put(`/requests/${req._id}/mark-done`);
      fetchRequests();
    }}
    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 mt-4"
  >
    ✔ Mark Work Done
  </button>
)}

              {expandedId === req._id && (
                <div className="mt-4 border-t pt-4 space-y-4">

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-xs uppercase text-orange-600 font-semibold mb-1">
                      Service Description
                    </p>

                    <p className="text-gray-800 font-medium">
                      {req.description}
                    </p>
                  </div>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <b>Address:</b> {req.address}
                    </p>

                    <p>
                      <b>Duration:</b> {req.duration}
                    </p>
                    <p>
                      <b>Price:</b> {req.amount} INR
                    </p>
                    <p>
                      <b>Rating:</b> {req.rating} ⭐
                    </p>
                    <p className="text-sm text-gray-700">
                <b>Requested:</b>{" "}
                {req.createdAt
                  ? new Date(req.createdAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>

              <p className="text-sm text-gray-700">
                <b>Completed:</b>{" "}
                {req.updatedAt
                  ? new Date(req.updatedAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => updateStatus(req._id, "accept")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => updateStatus(req._id, "reject")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HelperDashboard;