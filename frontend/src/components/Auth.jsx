// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const Auth = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "user",
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (user) {
//       const role = JSON.parse(user).role;
//       if (role === "admin") navigate("/admin/dashboard");
//       else if (role === "helper") navigate("/helper/dashboard");
//       else navigate("/user/dashboard");
//     }
//   }, [navigate]);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (isLogin) {
//         const res = await axios.post(
//           "http://localhost:5000/api/auth/login",
//           {
//             email: formData.email,
//             password: formData.password,
//           }
//         );

//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("user", JSON.stringify(res.data.user));
//         toast.success("Login successful!");

//         if (res.data.user.role === "admin")
//           navigate("/admin/dashboard");
//         else if (res.data.user.role === "helper")
//           navigate("/helper/dashboard");
//         else navigate("/user/dashboard");
//       } else {
//         await axios.post(
//           "http://localhost:5000/api/auth/register",
//           formData
//         );
//         toast.success("Registered successfully. Please login.");
//         setIsLogin(true);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Server error");
//     }
//   };

//   return (
//     <div className="min-h-screen relative flex items-center justify-center
//       bg-gradient-to-br from-[#fff3e8] via-[#fbdcc4] to-[#f3c2aa]">

//       {/* Background */}
//       <div
//         className="absolute inset-0 bg-cover bg-center opacity-20"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
//         }}
//       />

//       {/* Card */}
//       <div
//         className={`relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl
//         rounded-2xl shadow-2xl border border-orange-200
//         ${isLogin ? "p-8" : "px-8 py-12 my-12"}`}
//       >
//         {/* Logo & Title (ONLY THIS IS BIGGER) */}
//         <div className="text-center mb-10">
//           <div className="flex items-center justify-center ">
//             {/* Icon Logo */}
//             <img
//               src="/assets/logo.png"
//               alt="ElderAssist Logo"
//               className="h-20 w-auto object-contain"
//             />

//             {/* Text Logo */}
//             <img
//               src="/assets/elderAssists.png"
//               alt="ElderAssist"
//               className="h-28 mt-4 w-auto object-contain"
//             />
//           </div>

//           <p className="text-base text-gray-500  tracking-wide">
//             Care • Support • Trust
//           </p>
//         </div>

//         {/* Toggle */}
//         <div className="flex mb-8 rounded-lg overflow-hidden border">
//           <button
//             onClick={() => setIsLogin(true)}
//             className={`w-1/2 py-2 font-semibold transition
//             ${
//               isLogin
//                 ? "bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-white"
//                 : "bg-white text-gray-600"
//             }`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setIsLogin(false)}
//             className={`w-1/2 py-2 font-semibold transition
//             ${
//               !isLogin
//                 ? "bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-white"
//                 : "bg-white text-gray-600"
//             }`}
//           >
//             Register
//           </button>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className={`${isLogin ? "space-y-4" : "space-y-5 mt-6 mb-6"}`}
//         >
//           {!isLogin && (
//             <>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Full Name"
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 rounded-lg border
//                 focus:ring-2 focus:ring-[#F28C28] outline-none"
//               />

//               <select
//                 name="role"
//                 onChange={handleChange}
//                 className="w-full p-3 rounded-lg border
//                 focus:ring-2 focus:ring-[#F28C28] outline-none"
//               >
//                 <option value="user">User</option>
//                 <option value="helper">Helper</option>
//               </select>
//             </>
//           )}

//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             onChange={handleChange}
//             required
//             className="w-full p-3 rounded-lg border
//             focus:ring-2 focus:ring-[#F28C28] outline-none"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             onChange={handleChange}
//             required
//             className="w-full p-3 rounded-lg border
//             focus:ring-2 focus:ring-[#F28C28] outline-none"
//           />

//           <button
//             type="submit"
//             className="w-full py-3 mt-6 rounded-lg text-white font-semibold text-lg
//             bg-gradient-to-r from-[#8A1D53] to-[#F28C28]
//             hover:opacity-90 transition shadow-md"
//           >
//             {isLogin ? "Login" : "Create Account"}
//           </button>
//         </form>

//         <p className="text-xs text-center text-gray-500 mt-6">
//           Secure access for Users & Helpers
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Auth;

























import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    experience: "",
    skills: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const role = JSON.parse(user).role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "helper") navigate("/helper/dashboard");
      else navigate("/user/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Login successful!");

        if (res.data.user.role === "admin")
          navigate("/admin/dashboard");
        else if (res.data.user.role === "helper")
          navigate("/helper/dashboard");
        else navigate("/user/dashboard");
      } else {
        // ✅ ADD THIS (important)
        const dataToSend = {
          ...formData,
          experience:
            formData.role === "helper" ? formData.experience : "",
          skills:
            formData.role === "helper" && formData.skills
              ? formData.skills.split(",").map((s) => s.trim())
              : [],
        };

        await axios.post(
          "http://localhost:5000/api/auth/register",
          dataToSend
        );

        toast.success("Registered successfully. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center  
      bg-gradient-to-br from-[#fff3e8] via-[#fbdcc4] to-[#f3c2aa]">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
        }}
      />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl  
        rounded-2xl shadow-2xl border border-orange-200  
        ${isLogin ? "p-8" : "px-8 py-12 my-12"}`}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center ">
            <img
              src="/assets/logo.png"
              alt="ElderAssist Logo"
              className="h-20 w-auto object-contain"
            />

            <img
              src="/assets/elderAssists.png"
              alt="ElderAssist"
              className="h-28 mt-4 w-auto object-contain"
            />
          </div>

          <p className="text-base text-gray-500 tracking-wide">
            Care • Support • Trust
          </p>
        </div>

        {/* Toggle */}
        <div className="flex mb-8 rounded-lg overflow-hidden border">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 font-semibold transition  
            ${
              isLogin
                ? "bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-white"
                : "bg-white text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 font-semibold transition  
            ${
              !isLogin
                ? "bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-white"
                : "bg-white text-gray-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`${isLogin ? "space-y-4" : "space-y-5 mt-6 mb-6"}`}
        >
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#F28C28]"
              />

              <select
                name="role"
                onChange={handleChange}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#F28C28]"
              >
                <option value="user">User</option>
                <option value="helper">Helper</option>
              </select>

              {/* ✅ NEW FIELDS (only for helper) */}
              {formData.role === "helper" && (
                <>
                  <input
                    type="number"
                    name="experience"
                    placeholder="Experience (in years)"
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#F28C28]"
                  />

                  <input
                    type="text"
                    name="skills"
                    placeholder="Skills (comma separated)"
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#F28C28]"
                  />
                </>
              )}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#F28C28]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#F28C28]"
          />

          <button
            type="submit"
            className="w-full py-3 mt-6 rounded-lg text-white font-semibold text-lg  
            bg-gradient-to-r from-[#8A1D53] to-[#F28C28]"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          Secure access for Users & Helpers
        </p>
      </div>
    </div>
  );
};

export default Auth;