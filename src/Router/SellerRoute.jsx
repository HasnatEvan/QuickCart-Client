import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import useRole from "../Hooks/useRole";

const SellerRoute = ({ children }) => {
    const [role, isLoading] = useRole();

    if (isLoading) {
        return <span className="loading loading-bars loading-lg"></span>;
    }

    return role === "seller" ? children : <Navigate to="/dashboard" replace />;
};

// Add prop types validation
SellerRoute.propTypes = {
    children: PropTypes.node.isRequired, // Validate that children is required and is a node
};

export default SellerRoute;
