// frontend/src/pages/AdminHelpers.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminHelpers = () => {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHelpers();
  }, []);

  const fetchHelpers = async () => {
    try {
      const res = await api.get("http://localhost:5000/api/admin/helpers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHelpers(res.data);
    } catch (err) {
      console.error("Failed to fetch helpers:", err);
      alert("Failed to fetch helpers");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(
        `http://localhost:5000/api/admin/helpers/${action}/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchHelpers(); // refresh list
    } catch (err) {
      console.error("Action failed:", err);
      alert("Action failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Helper Approval</h1>

      {loading ? (
        <p>Loading...</p>
      ) : helpers.length === 0 ? (
        <p>No helpers available</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {helpers.map((helper) => (
              <tr key={helper._id} className="text-center">
                <td className="p-2 border">{helper.name}</td>
                <td className="p-2 border">{helper.email}</td>
                <td className="p-2 border">{helper.status || "pending"}</td>
                <td className="p-2 border space-x-2">
                  {helper.status !== "approved" && (
                    <button
                      onClick={() => handleAction(helper._id, "approve")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                  )}
                  {helper.status !== "rejected" && (
                    <button
                      onClick={() => handleAction(helper._id, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminHelpers;
