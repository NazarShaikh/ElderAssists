// import { NavLink } from "react-router-dom";
// import { Home, UserPlus, LogOut, Search } from "lucide-react";

// const UserSidebar = ({ onLinkClick }) => {
//   const baseLink =
//     "flex items-center gap-3 px-4 py-2 rounded transition-all duration-300 text-[#8A1D53] hover:bg-[#F28C28]/20 hover:translate-x-1";
//   const activeLink =
//     "flex items-center gap-3 px-4 py-2 rounded bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-white font-semibold shadow-md scale-[1.03]";

//   return (
//     <div className="h-full flex flex-col p-6 bg-gradient-to-b from-[#fff3e8] via-[#fbdcc4] to-[#f3c2aa]">
//       <h2 className="text-xl font-bold mb-10 bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-transparent bg-clip-text">
//         User Menu
//       </h2>

//       <div className="flex flex-col gap-2">
//         <NavLink
//           to="/user/dashboard"
//           className={({ isActive }) => (isActive ? activeLink : baseLink)}
//           onClick={onLinkClick}
//         >
//           <Home size={18} /> Dashboard
//         </NavLink>

//         <NavLink
//           to="/user/request"
//           className={({ isActive }) => (isActive ? activeLink : baseLink)}
//           onClick={onLinkClick}
//         >
//           <UserPlus size={18} /> Request Helper
//         </NavLink>

//         <NavLink
//           to="/user/find-helper"
//           className={({ isActive }) => (isActive ? activeLink : baseLink)}
//           onClick={onLinkClick}
//         >
//           <Search size={18} /> Find Helper
//         </NavLink>
//         <NavLink
//           to="/user/payment/:requestId"
//           className={({ isActive }) => (isActive ? activeLink : baseLink)}
//           onClick={onLinkClick}
//         >
//           <Search size={18} /> Payment
//         </NavLink>
//       </div>
// {/* <li>
//   <NavLink
//     to="/user/payment"
//     className={({ isActive }) =>
//       isActive ? "text-yellow-600 font-bold" : "text-gray-700"
//     }
//   >
//     Payment
//   </NavLink>
// </li> */}
//       <button
//         onClick={() => {
//           localStorage.clear();
//           window.location.href = "/";
//         }}
//         className="flex items-center gap-3 px-4 py-2 rounded text-[#8A1D53] hover:bg-[#F28C28]/20 mt-auto transition font-medium"
//       >
//         <LogOut size={18} /> Logout
//       </button>
//     </div>
//   );
// };

// export default UserSidebar;

import { NavLink } from "react-router-dom";
import { Home, UserPlus, LogOut, Search } from "lucide-react";

const UserSidebar = ({ onLinkClick }) => {
  const baseLink =
    "flex items-center gap-3 px-4 py-2 rounded transition-all duration-300 text-[#8A1D53] hover:bg-[#F28C28]/20 hover:translate-x-1";
  const activeLink =
    "flex items-center gap-3 px-4 py-2 rounded bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-white font-semibold shadow-md scale-[1.03]";

  // Logout handler with confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-b from-[#fff3e8] via-[#fbdcc4] to-[#f3c2aa]">
      <h2 className="text-xl font-bold mb-10 bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-transparent bg-clip-text">
        User Menu
      </h2>

      <div className="flex flex-col gap-2">
        <NavLink
          to="/user/dashboard"
          className={({ isActive }) => (isActive ? activeLink : baseLink)}
          onClick={onLinkClick}
        >
          <Home size={18} /> Dashboard
        </NavLink>

        <NavLink
          to="/user/request"
          className={({ isActive }) => (isActive ? activeLink : baseLink)}
          onClick={onLinkClick}
        >
          <UserPlus size={18} /> Request Helper
        </NavLink>

        <NavLink
          to="/user/find-helper"
          className={({ isActive }) => (isActive ? activeLink : baseLink)}
          onClick={onLinkClick}
        >
          <Search size={18} /> Find Helper
        </NavLink>

        <NavLink
          to="/user/payment/:requestId"
          className={({ isActive }) => (isActive ? activeLink : baseLink)}
          onClick={onLinkClick}
        >
          <Search size={18} /> Payment
        </NavLink>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded text-[#8A1D53] hover:bg-[#F28C28]/20 mt-auto transition font-medium"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default UserSidebar;
