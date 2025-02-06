import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom'; 
import { FaBars, FaHome, FaUser, FaSignOutAlt, FaClipboardList, FaAsterisk } from 'react-icons/fa';
import PropTypes from 'prop-types'; // Import PropTypes
import useRole from '../Hooks/useRole';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? 'text-primary font-bold flex items-center gap-2 p-2 rounded '
          : 'flex items-center gap-2 p-2 rounded hover:bg-gray-200'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const [role, isLoading] = useRole(); // Destructure role and isLoading from useRole
  const navigate = useNavigate(); // Initialize navigate function

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar state
  };

  useEffect(() => {
    if (!isLoading) { // Check if isLoading is false
      if (role === 'customer') {
        navigate('/dashboard/myOrders');
      } else if (role === 'admin') {
        navigate('/dashboard/manageUsers');
      } else if (role === 'seller') {
        navigate('/dashboard/addItem');
      }
    }
  }, [role, isLoading, navigate]); // Run effect when role or isLoading changes

  return (
    <div>
      <div className="flex h-screen">
        {/* Toggle Button for Mobile */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-full shadow-md"
          onClick={toggleSidebar} // Call toggle function on click
        >
          <FaBars size={20} />
        </button>

        {/* Sidebar */}
        <div
          className={`lg:w-1/6 w-64 bg-base-200 p-4 h-full fixed lg:static z-40 transition-all duration-300 ${
            isSidebarOpen ? 'left-0' : '-left-64' // Show/Hide sidebar based on state
          }`}
        >
          {/* QuickCart Title */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-primary">QuickCart</h2>
          </div>

          <ul className="menu text-base-content">
            {/* Admin */}
            {role === 'admin' && (
              <>
                <SidebarItem to="/dashboard/statistics" icon={FaAsterisk} label="Statistics" />
                <SidebarItem to="/dashboard/manageUsers" icon={FaUser} label="Manage Users" />
                <SidebarItem to="/dashboard/sellerData" icon={FaUser} label="Seller Data" />
                <div className="divider"></div>
              </>
            )}

            {/* Seller */}
            {role === 'seller' && (
              <>
                <SidebarItem to="/dashboard/my-inventory" icon={FaClipboardList} label="My Inventory" />
                <SidebarItem to="/dashboard/addItem" icon={FaClipboardList} label="Add Item" />
                <SidebarItem to="/dashboard/manageOrder" icon={FaClipboardList} label="Manage Orders" />
                <div className="divider"></div>
              </>
            )}

            {/* Customer */}
            {role === 'customer' && (
              <>
                <SidebarItem to="/dashboard/myOrders" icon={FaClipboardList} label="My Orders" />
                <SidebarItem to="/dashboard/becomeSeller" icon={FaClipboardList} label="Become A Seller" />
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
