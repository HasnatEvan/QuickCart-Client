import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaAsterisk,
  FaUsers,
  FaBoxOpen,
  FaPlusCircle,
  FaShoppingCart,
  FaUserTie,
} from "react-icons/fa";
import PropTypes from "prop-types";
import useRole from "../Hooks/useRole";
import { motion } from "framer-motion"; // Import motion from framer-motion

const SidebarItem = ({ to, icon: Icon, label }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-white font-bold flex items-center gap-2 p-2 rounded bg-lime-700"
          : "text-white flex items-center gap-2 p-2 rounded hover:bg-lime-500"
      }
    >
      <Icon />
      {label}
    </NavLink>
  </li>
);

SidebarItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
};

const DashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, isLoading] = useRole();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!isLoading) {
      if (role === "customer") {
        navigate("/dashboard/my-orders");
      } else if (role === "admin") {
        navigate("/dashboard/manage-users");
      } else if (role === "seller") {
        navigate("/dashboard/my-inventory");
      }
    }
  }, [role, isLoading, navigate]);

  return (
    <div>
      <div className="flex h-screen">
        {/* Toggle Button for Mobile */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-lime-700 text-white p-2 rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </button>

        {/* Sidebar */}
        <div
          className={`lg:w-1/6 w-64 bg-lime-600 text-white p-4 h-full fixed lg:static z-40 transition-all duration-300 ${
            isSidebarOpen ? "left-0" : "-left-64"
          }`}
        >
          {/* QuickCart Title with Jump Animation */}
          <motion.div
            animate={{
              y: [0, -20, 0], // Jump effect: moves up and then comes back down
              scale: [1, 1.1, 1], // Slight scale-up effect while jumping
            }}
            transition={{
              repeat: Infinity, // Repeats the animation infinitely
              duration: 5, // Duration of each jump cycle
              ease: "easeInOut", // Smooth easing
            }}
            whileHover={{ scale: 1.1 }} // Slight hover effect to scale the text
            className="text-center mb-4"
          >
            <h2 className="text-xl font-bold text-white">QuickCart-BD</h2>
          </motion.div>

          <ul className="menu text-white">
            {/* Admin */}
            {role === "admin" && (
              <>
                <SidebarItem to="/dashboard/statistics" icon={FaAsterisk} label="Statistics" />
                <SidebarItem to="/dashboard/manage-users" icon={FaUsers} label="Manage Users" />
                <SidebarItem to="/dashboard/seller-data" icon={FaUserTie} label="Seller Data" />
                <div className="divider"></div>
              </>
            )}

            {/* Seller */}
            {role === "seller" && (
              <>
                <SidebarItem to="/dashboard/my-inventory" icon={FaBoxOpen} label="My Inventory" />
                <SidebarItem to="/dashboard/addItem" icon={FaPlusCircle} label="Add Item" />
                <SidebarItem to="/dashboard/manage-orders" icon={FaClipboardList} label="Manage Orders" />
                <div className="divider"></div>
              </>
            )}

            {/* Customer */}
            {role === "customer" && (
              <>
                <SidebarItem to="/dashboard/my-orders" icon={FaShoppingCart} label="My Orders" />
                <SidebarItem to="/dashboard/become-seller" icon={FaUserTie} label="Become A Seller" />
                <div className="divider"></div>
              </>
            )}

            {/* All User */}
            <SidebarItem to="/" icon={FaHome} label="Home" />
            <SidebarItem to="/dashboard/profile" icon={FaUser} label="Profile" />
            <SidebarItem to="#" icon={FaSignOutAlt} label="Logout" />
          </ul>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
