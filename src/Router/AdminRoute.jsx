import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import useRole from "../Hooks/useRole";

const AdminRoute = ({ children }) => {
    const [role, isLoading] = useRole();

    if (isLoading) {
        return
    }

    return role === "admin" ? children : <Navigate to="/dashboard" replace />;
};

// Add prop types validation for AdminRoute
AdminRoute.propTypes = {
    children: PropTypes.node.isRequired, // Validate that children is required and is a node
};

export default AdminRoute;
