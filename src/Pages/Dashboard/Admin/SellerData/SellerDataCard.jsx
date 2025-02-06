import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2"; // Import SweetAlert2

const SellerDataCard = ({ seller, refetch }) => {
    const { name, email, phone, photo, role, _id } = seller;
    const axiosSecure = useAxiosSecure();

    // Handle seller deletion with SweetAlert confirmation
    const handleDelete = async (_id) => {
        // Show SweetAlert confirmation before deleting
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This seller will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/seller/${_id}`); // Correct endpoint for deleting a seller
                Swal.fire('Deleted!', 'The seller has been deleted.', 'success'); // Success message
                refetch(); // Refresh data after deletion
            } catch (error) {
                console.error("Error deleting seller:", error);
                Swal.fire('Error!', 'There was an issue deleting the seller.', 'error'); // Error message
            }
        }
    };

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="p-3">{name}</td>
            <td className="p-3">{email}</td>
            <td className="p-3">{phone}</td>
            <td className="p-3">
                {photo ? (
                    <img src={photo} alt="Seller" className="w-10 h-10 rounded-full" />
                ) : (
                    <span>No photo</span>
                )}
            </td>
            <td className="p-3">{role}</td>
            <td className="p-3">
                {/* Navigate to seller's detailed view page */}
                <Link to={`/dashboard/seller/${_id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2">
                        View
                    </button>
                </Link>
                {/* Delete button */}
                <button
                    onClick={() => handleDelete(_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};

// PropTypes validation for SellerDataCard
SellerDataCard.propTypes = {
    seller: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        photo: PropTypes.string,
        role: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired, // Added validation for _id
    }).isRequired,
    refetch: PropTypes.func.isRequired, // Added prop validation for refetch
};

export default SellerDataCard;
