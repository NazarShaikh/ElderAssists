
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const RequestHelper = () => {
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [duration, setDuration] = useState("1 day");
  const [helpers, setHelpers] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch helpers
  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const res = await api.get("/helpers");
        setHelpers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching helpers:", err);
      }
    };
    if (user) fetchHelpers();
  }, [user]);

  // Amount calculator
  const getAmount = (duration) => {
    switch (duration) {
      case "1 hour": return 100;
      case "Half day": return 300;
      case "1 day": return 500;
      case "1 week": return 3000;
      case "1 month": return 10000;
      default: return 100;
    }
  };

  // Submit request
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedHelper) return alert("Select a helper");

  try {
    setLoading(true);

    const res = await api.post("/requests", {
      helperId: selectedHelper._id,
      address,
      duration,
      description,
      amount: getAmount(duration),
    });

    const { requestId, request } = res.data;

    if (!requestId) {
      throw new Error("Request ID not returned from backend");
    }

    const amount = getAmount(duration);

    // Save for refresh support
    localStorage.setItem(
      "latestRequest",
      JSON.stringify({ request, amount })
    );

    // ✅ Redirect to payment page
    navigate(`/user/payment/${requestId}`, {
      state: { request, amount },
    });

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Request a Helper</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Enter service address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full rounded-xl border px-4 py-3"
          />

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          >
            <option value="1 hour">1 hour | ₹{getAmount("1 hour")} INR</option>
            <option value="Half day">Half day | ₹{getAmount("Half day")} INR</option>
            <option value="1 day">1 day | ₹{getAmount("1 day")} INR</option>
            <option value="1 week">1 week | ₹{getAmount("1 week")} INR</option>
            <option value="1 month">1 month | ₹{getAmount("1 month")} INR</option>
          </select>

          <textarea
            rows="4"
            placeholder="Describe the help you need"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full rounded-xl border px-4 py-3"
          />

          <div>
            <h3 className="text-lg font-semibold mb-3">Select a Helper</h3>
            {helpers.map((h) => (
              <label
                key={h._id}
                className={`flex gap-5 p-4 border rounded-xl cursor-pointer mb-4 ${
                  selectedHelper?._id === h._id
                    ? "border-orange-400 bg-orange-50"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  checked={selectedHelper?._id === h._id}
                  onChange={() => setSelectedHelper(h)}
                />
                <div>
                  <p className="font-semibold">{h.name}</p>
                  <p className="text-sm">{h.email}</p>
                </div>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-xl"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestHelper;