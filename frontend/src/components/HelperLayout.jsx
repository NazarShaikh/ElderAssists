// import React from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { Home, Users, LogOut } from "lucide-react";
// import Navbar from "./Navbar";

// const HelperLayout = () => {
//   const navigate = useNavigate();
//   const helper = JSON.parse(localStorage.getItem("user"));

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   const baseLink =
//     "flex items-center gap-3 px-4 py-2 rounded transition-all duration-300 text-[#8A1D53] hover:bg-[#F28C28]/20 hover:translate-x-1";

//   const activeLink =
//     "flex items-center gap-3 px-4 py-2 rounded bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-white font-semibold shadow-md scale-[1.03]";

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* SIDEBAR */}
//       <aside
//         className="
//           fixed top-0 left-0 h-screen w-64 z-50
//           bg-gradient-to-b from-[#fff3e8] via-[#fbdcc4] to-[#f3c2aa]
//           shadow-xl p-6 flex flex-col
//         "
//       >
//         {/* HEADER */}
//         <h2 className="text-xl font-bold mb-10 bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-transparent bg-clip-text">
//           Helper Menu
//         </h2>

//         {/* WELCOME */}
//         {/* <p className="text-sm text-gray-700 mb-6">
//           Welcome, <b>{helper?.name}</b>
//         </p> */}

//         {/* MENU */}
//         <div className="flex flex-col gap-2">
//           <NavLink
//             to="/helper/dashboard"
//             className={({ isActive }) => (isActive ? activeLink : baseLink)}
//           >
//             <Home size={18} /> Dashboard
//           </NavLink>

//           <NavLink
//             to="/helper/check-user"
//             className={({ isActive }) => (isActive ? activeLink : baseLink)}
//           >
//             <Users size={18} /> Check User
//           </NavLink>
//         </div>

//         {/* LOGOUT */}
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 px-4 py-2 rounded text-[#8A1D53] hover:bg-[#F28C28]/20 mt-auto transition font-medium"
//         >
//           <LogOut size={18} /> Logout
//         </button>
//       </aside>

//       {/* MAIN AREA */}
//       <div className="flex-1 ml-64">
//         {/* NAVBAR */}
//         <Navbar />

//         {/* PAGE CONTENT */}
//         <main className="pt-24 px-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default HelperLayout;




















import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Users, LogOut, Menu, X } from "lucide-react";
import Navbar from "./Navbar";

const HelperLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const baseLink =
    "flex items-center gap-3 px-4 py-2 rounded transition-all duration-300 text-[#8A1D53] hover:bg-[#F28C28]/20 hover:translate-x-1";

  const activeLink =
    "flex items-center gap-3 px-4 py-2 rounded bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-white font-semibold shadow-md";

 const SidebarContent = () => (
  <div className="flex flex-col h-full">

    <div>
      <h2 className="text-xl font-bold mb-10 bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-transparent bg-clip-text">
        Helper Menu
      </h2>

      <div className="flex flex-col gap-2">
        <NavLink
          to="/helper/dashboard"
          className={({ isActive }) => (isActive ? activeLink : baseLink)}
          onClick={() => setOpen(false)}
        >
          <Home size={18} /> Dashboard
        </NavLink>

        <NavLink
          to="/helper/check-user"
          className={({ isActive }) => (isActive ? activeLink : baseLink)}
          onClick={() => setOpen(false)}
        >
          <Users size={18} /> Check User
        </NavLink>
      </div>
    </div>

    {/* LOGOUT BUTTON AT BOTTOM */}
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 rounded text-[#8A1D53] hover:bg-[#F28C28]/20 mt-auto transition font-medium"
    >
      <LogOut size={18} /> Logout
    </button>

  </div>
);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* NAVBAR */}
      <Navbar toggleSidebar={()=> setOpen(true)}/>

      {/* MOBILE MENU BUTTON */}
      {/* <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-24 left-4 z-50 bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-white p-2 rounded shadow"
      >
        <Menu size={20} />
      </button> */}

      <div className="flex flex-1 ">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex fixed top-20 left-0 bottom-0 w-64 z-40 bg-gradient-to-b from-[#fff3e8] via-[#fbdcc4] to-[#f3c2aa] shadow-xl p-6 flex-col">
          <SidebarContent />
        </aside>

        {/* MOBILE SIDEBAR */}
        {open && (
          <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
            <aside className="w-64 h-full bg-white p-6 flex flex-col shadow-xl">
              <button
                onClick={() => setOpen(false)}
                className="self-end mb-6"
              >
                <X size={22} />
              </button>
              <SidebarContent />



              
            </aside>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 md:ml-64 pt-24 p-4 sm:p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HelperLayout;