
import { useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* NAVBAR */}
     <nav
  className="
    fixed top-0 left-0 w-full z-50
    h-20
    bg-gradient-to-r 
    from-white 
    via-[#FE863D]/20 
    to-pink-300/40
    backdrop-blur-lg
    shadow-lg
    border-b border-white/30
    px-4 sm:px-8
    flex justify-between items-center
  "
>
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          {/* MENU BUTTON */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg bg-orange-100 text-orange-500"
          >
            <Menu size={24} />
          </button>

          {/* LOGO */}
          <img
            src="/assets/logo.png"
            alt="ElderAssist"
            className="w-14 h-14 sm:w-12 sm:h-12 object-contain"
          />

          {/* TITLE */}
          <h1 className="text-2xl sm:text-xl font-bold text-[#8A1D53]">
            Elder<span className="text-[#F28C28]">Assist</span>
          </h1>
        </div>

        {/* USER PROFILE */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-[#FE863D]/20 flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-[#FE863D]" />
              </div>

              <span className="hidden sm:block font-semibold text-gray-800">
                {user.name}
              </span>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border overflow-hidden">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    Role: {user.role}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* LOGOUT CONFIRM */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Logout
            </h2>

            <p className="text-gray-600 mt-2">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded bg-[#FE863D] text-white"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;