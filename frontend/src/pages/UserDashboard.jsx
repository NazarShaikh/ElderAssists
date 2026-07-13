

import React, { useEffect, useState } from "react";  
import { useNavigate } from "react-router-dom";  
import api from "../services/api";  
  
const UserDashboard = () => {  
  const [requests, setRequests] = useState([]);  
  const [expandedId, setExpandedId] = useState(null);  
  const [ratingValue, setRatingValue] = useState({});  
  const [latestRequest, setLatestRequest] = useState(null);  
  const [loadingPage, setLoadingPage] = useState(true);  

  const navigate = useNavigate();  
  
  const fetchRequests = async () => {  
    try {  
      const res = await api.get("/requests/user");  

      const sortedRequests = (res.data || []).sort(  
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)  
      );  

      setRequests(sortedRequests);  

      // 🔥 FALLBACK: find latest pending payment
      const pending = sortedRequests.find(  
        (r) => r.paymentStatus === "pending"  
      );  

      if (pending) {  
        setLatestRequest(pending);  
      }  

    } catch (err) {  
      console.error("Fetch error:", err);  
    }  
  };  
  
  useEffect(() => {  
    const init = async () => {  
      try {  
        const res = await api.get("/latest");  

        if (res.data && res.data._id) {  
          setLatestRequest(res.data);  
        } else {  
          setLatestRequest(null);  
        }  

      } catch (err) {  
        console.log("No latest request");  
      } finally {  
        setLoadingPage(false);  
      }  
    };  
  
    init();  
    fetchRequests();  

    // 🔥 REFRESH WHEN USER RETURNS
    window.addEventListener("focus", fetchRequests);

    return () => {
      window.removeEventListener("focus", fetchRequests);
    };

  }, []);  

  // 🔥 SAFE REDIRECT (FIXED)
  useEffect(() => {
    if (
      latestRequest &&
      latestRequest._id &&
      latestRequest.paymentStatus === "pending"
    ) {
      navigate(`/user/payment/${latestRequest._id}`, {
        state: { request: latestRequest, amount: latestRequest.amount },
      });
    }
  }, [latestRequest, navigate]);

  
  const completeRequest = async (id) => {  
    if (!window.confirm("Mark service as completed?")) return;  
    await api.put(`/requests/${id}/complete`);  
    fetchRequests();  
  };  
  
  const deleteRequest = async (id) => {  
    if (!window.confirm("Delete this request?")) return;  
    await api.delete(`/requests/delete/${id}`);  
    fetchRequests();  
  };  
  
  const submitRating = async (id) => {  
    if (!ratingValue[id]) return alert("Select rating first");  
    await api.put(`/requests/${id}/rate`, { rating: ratingValue[id] });  
    setRatingValue((prev) => ({ ...prev, [id]: "" }));  
    fetchRequests();  
  };  
  
  const goToPayment = (requestId, amount) => {  
    navigate(`/user/payment/${requestId}`, { state: { amount } });  
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
  
  if (loadingPage) return <h2>Loading...</h2>;  

  return (  
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-10 py-6">  
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">  
        My Service Requests  
      </h1>  
  
      {requests.length === 0 ? (  
        <p className="text-center text-gray-500">No requests found.</p>  
      ) : (  
        <div className="space-y-6">  
          {requests.map((req) => (  
            <div  
              key={req._id}  
              className="bg-white rounded-2xl shadow-md border p-4 sm:p-6 transition hover:shadow-lg"  
            >  
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">  
                <div className="break-words">  
                  <p className="text-base sm:text-lg font-semibold text-gray-800">  
                    <span className="text-orange-600 font-bold text-xs sm:text-sm">  
                      Helper:  
                    </span>{" "}  
                    {req.helperName || "Helper not assigned"}  
                  </p>  
                  {req.helperEmail && (  
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">  
                      {req.helperEmail}  
                    </p>  
                  )}  
                </div>  
  
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">  
                  <span  
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-center ${statusColor(  
                      req.status  
                    )}`}  
                  >  
                    {req.status.toUpperCase()}  
                  </span>  
  
                  <p className="text-xs sm:text-sm text-gray-500">  
                    {new Date(req.createdAt).toLocaleDateString("en-IN", {  
                      day: "numeric",  
                      month: "short",  
                      year: "numeric",  
                    })}  
                  </p>  
                </div>  
              </div>  
  
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4">  
                <button  
                  onClick={() =>  
                    setExpandedId(expandedId === req._id ? null : req._id)  
                  }  
                  className="w-full sm:w-auto px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100"  
                >  
                  {expandedId === req._id ? "Hide Details" : "View Details"}  
                </button>  
  
                <button  
                  onClick={() => deleteRequest(req._id)}  
                  className="w-full sm:w-auto px-4 py-2 bg-[#8A1D53] text-white rounded-lg text-sm"  
                >  
                  Delete  
                </button>  
  
                {req.status === "accepted" &&  
                  req.paymentStatus === "pending" && (  
                    <button  
                      onClick={() => goToPayment(req._id, req.amount)}  
                      className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm"  
                    >  
                      💳 Pay Now  
                    </button>  
                  )}  
  
                {req.status === "pending_confirmation" && (  
                  <button  
                    onClick={() => completeRequest(req._id)}  
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg text-sm"  
                  >  
                    ✔ Mark Completed  
                  </button>  
                )}  
              </div>  
  
              {expandedId === req._id && (  
                <div className="mt-6 border-t pt-5 space-y-4">  
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">  
                    <p className="text-xs uppercase tracking-wide text-orange-600 font-semibold mb-2">  
                      Helper Details  
                    </p>  
                    <p className="text-sm text-gray-800">  
                      <b>Experience:</b> {req.helperExperience || "Not provided"}  
                    </p>  
                    <p className="text-sm text-gray-800">  
                      <b>Skills:</b> {req.helperSkills || "Not provided"}  
                    </p>  
                  </div>  
  
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">  
                    <p className="text-xs uppercase tracking-wide text-orange-600 font-semibold mb-1">  
                      Service Description  
                    </p>  
                    <p className="text-sm sm:text-base font-medium text-gray-800">  
                      {req.description}  
                    </p>  
                  </div>  
  
                  <div className="text-sm text-gray-700 space-y-1">  
                    <p><b>Address:</b> {req.address}</p>  
                    <p><b>Duration:</b> {req.duration}</p>  
                    <p><b>Amount:</b> {req.amount} INR</p>  
                  </div>  
  
                  {req.status === "completed" && (  
                    <>  
                      {!req.rating ? (  
                        <div className="flex flex-col sm:flex-row gap-3">  
                          <select  
                            value={ratingValue[req._id] || ""}  
                            onChange={(e) =>  
                              setRatingValue({  
                                ...ratingValue,  
                                [req._id]: Number(e.target.value),  
                              })  
                            }  
                            className="w-full sm:w-auto border px-3 py-2 rounded-lg text-sm"  
                          >  
                            <option value="">Rate</option>  
                            {[1, 2, 3, 4, 5].map((r) => (  
                              <option key={r} value={r}>  
                                {r} ⭐  
                              </option>  
                            ))}  
                          </select>  
  
                          <button  
                            onClick={() => submitRating(req._id)}  
                            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"  
                          >  
                            Submit Rating  
                          </button>  
                        </div>  
                      ) : (  
                        <p className="text-green-700 font-semibold text-sm">  
                          Rating Given: {req.rating} ⭐  
                        </p>  
                      )}  
                    </>  
                  )}  
                </div>  
              )}  
            </div>  
          ))}  
        </div>  
      )}  
    </div>  
  );  
};  
  
export default UserDashboard;