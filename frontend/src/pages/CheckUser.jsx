


import React, { useEffect, useState } from "react";
import api from "../services/api";

const CheckUser = () => {
 const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserInsights();
  }, []);

  const fetchUserInsights = async () => {
    try {
     const res = await api.get("/helpers/insights");

console.log("INSIGHTS:", res.data);

setInsights(res.data);
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

  if (!insights)
    return (
      <p className="text-center mt-10 text-gray-600">
        No user data available.
      </p>
    );

  return (
<div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 pt-24 px-4">

<div className="max-w-5xl mx-auto">

<h1 className="text-3xl font-bold mb-8">
Helper Insights
</h1>


<div className="grid sm:grid-cols-2 gap-6">


<div className="bg-white p-6 rounded-xl shadow">
<p>Total Requests:</p>
<h2 className="text-2xl font-bold">
{insights.totalRequests}
</h2>
</div>



<div className="bg-white p-6 rounded-xl shadow">
<p>Completed:</p>
<h2 className="text-2xl font-bold">
{insights.completed}
</h2>
</div>



<div className="bg-white p-6 rounded-xl shadow">
<p>Ongoing:</p>
<h2 className="text-2xl font-bold">
{insights.ongoing}
</h2>
</div>



<div className="bg-white p-6 rounded-xl shadow">
<p>Cancelled:</p>
<h2 className="text-2xl font-bold">
{insights.cancelled}
</h2>
</div>



<div className="bg-white p-6 rounded-xl shadow">
<p>Average Rating:</p>

<h2 className="text-2xl font-bold">
{insights.avgRating} ⭐
</h2>

</div>



{/* <div className="bg-white p-6 rounded-xl shadow">

<p>Total Spent:</p> */}

{/* <h2 className="text-2xl font-bold">
₹{insights.totalSpent}
</h2> */}

{/* </div> */}


</div>



<div className="bg-white mt-8 p-6 rounded-xl shadow">

<h2 className="text-xl font-bold mb-4">
Recent Requests
</h2>


{
insights.recentRequests.length > 0 ?

insights.recentRequests.map((req,index)=>(

<div key={index} className="border-b py-3">

<p>
User:
{req.userId?.name}
</p>

<p>
Status:
{req.status}
</p>

</div>


))

:

<p>
No recent activity
</p>

}


</div>


</div>

</div>
);
};

export default CheckUser;