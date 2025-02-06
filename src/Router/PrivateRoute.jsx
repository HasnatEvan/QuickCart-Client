import { useLocation, Navigate } from "react-router-dom"; // Import Navigate
import useAuth from "../Hooks/useAuth";
import PropTypes from 'prop-types'; // Import PropTypes

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (user) return children;

  return <Navigate to="/login" state={{ from: location }} replace={true} />;
};

// Add prop types validation for 'children'
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
