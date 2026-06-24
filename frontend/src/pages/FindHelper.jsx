import React, { useEffect, useState } from "react";
import api from "../services/api";

const FindHelper = () => {
  const [helpers, setHelpers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedHelperId, setSelectedHelperId] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHelpers();
  }, []);

const fetchHelpers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("/helpers", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Helpers API response:", res.data);

    const helpersData = Array.isArray(res.data.helpers)
      ? res.data.helpers
      : Array.isArray(res.data)
      ? res.data
      : [];

    setHelpers(helpersData);
  } catch (err) {
    console.error("Failed to load helpers:", err.response || err.message);
    setHelpers([]);
  } finally {
    setLoading(false);
  }
};


  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setSelectedHelperId(id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Find a Helper</h1>

      {loading ? (
        <p className="text-gray-600">Loading helpers...</p>
      ) : helpers.length === 0 ? (
        <p className="text-gray-600">No helpers available</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpers.map((helper) => {
            // const feedbacks = Array.isArray(helper.feedbacks) ? helper.feedbacks : [];
           const rating =
  helper.ratingCount > 0
    ? `${helper.rating.toFixed(1)} ⭐ (${helper.ratingCount})`
    : "No ratings yet";

            const completedServices =
              typeof helper.completedServices === "number" ? helper.completedServices : 0;

            return (
              <div
                key={helper._id}
                onClick={() => toggleExpand(helper._id)}
                className={`rounded-xl p-5 cursor-pointer transition-all border ${
                  expandedId === helper._id
                    ? "bg-white border-orange-400 shadow-2xl ring-1 ring-orange-200 scale-[1.02]"
                    : "bg-white border-gray-200 hover:shadow-lg"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{helper.name}</h2>
                    <p className="text-sm text-gray-500">{helper.email}</p>
                  </div>

                  <input
                    type="radio"
                    name="selectedHelper"
                    checked={selectedHelperId === helper._id}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => setSelectedHelperId(helper._id)}
                    className="w-5 h-5 accent-white"
                  />
                </div>

                {expandedId === helper._id && (
  <div className="mt-4 border-t border-orange-300 pt-3 text-sm space-y-2">
    
    <p>
      <b>Rating:</b> {rating}
    </p>

    <p>
      <b>Completed Services:</b> {completedServices}
    </p>

    {/* ✅ ADD THESE TWO LINES HERE */}
    <p>
      <b>Experience:</b> {helper.experience || "Not provided"}
    </p>

    <p>
      <b>Skills:</b> {helper.skills || "Not provided"}
    </p>

  </div>
)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FindHelper;
