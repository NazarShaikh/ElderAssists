import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
  //     const res = await axios.post(
  // "https://elderassists-backend.onrender.com/api/auth/login",
        formData,
        { validateStatus: (s) => s < 500 }
      );

      if (res.status === 200) {
        toast.success("Login successful!");
       localStorage.setItem(
  "user",
  JSON.stringify({
    ...res.data.user,
    token: res.data.token,
  })
);

        if (res.data.user.role === "admin") navigate("/admin");
        else if (res.data.user.role === "helper") navigate("/helper");
        else navigate("/user");
      } else {
        toast.error(res.data.message || "Login failed!");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

 return (
  <div
    className="
    min-h-screen 
    flex items-center justify-center
    px-4 py-6
    bg-gradient-to-br from-[#fff3e8] via-[#fbdcc4] to-[#f3c2aa]
    relative
  "
  >
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-20 -z-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1607746882042-944635dfe10e')",
      }}
    />

    {/* Login Card */}
    <div
      className="
      w-full max-w-xs sm:max-w-sm
      bg-white/85 backdrop-blur-lg
      rounded-xl shadow-xl
      p-5 sm:p-6
      border border-orange-200
    "
    >
      {/* Logo */}
      <div className="text-center mb-5">
        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full
          bg-gradient-to-r from-[#8A1D53] to-[#F28C28]
          flex items-center justify-center shadow-md">
          <span className="text-white text-xl sm:text-2xl font-bold">
            EA
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold mt-3
          bg-gradient-to-r from-[#8A1D53] to-[#F28C28]
          text-transparent bg-clip-text">
          ElderAssist
        </h1>

        <p className="text-[11px] text-gray-500 mt-1">
          Care • Support • Trust
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-[#8A1D53]">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full mt-1 p-2 text-sm rounded-md border
              focus:ring-2 focus:ring-[#F28C28] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#8A1D53]">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full mt-1 p-2 text-sm rounded-md border
              focus:ring-2 focus:ring-[#F28C28] focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 text-sm rounded-md text-white font-semibold
            bg-gradient-to-r from-[#8A1D53] to-[#F28C28]
            hover:opacity-90 transition shadow-sm"
        >
          Login
        </button>
      </form>

      <p className="text-[10px] text-center text-gray-500 mt-4">
        Secure access for Users & Helpers
      </p>
    </div>
  </div>
);
};

export default Login;