import PropTypes from "prop-types";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing Edit and Delete Icons
import { Link } from "react-router-dom";

const MyInventoryRow = ({ product, refetch }) => {
    const {
        productName,
        image,
        shopName,
        quantity,
        price,
        category,
        sizes,
        bkashNumber,
        nogodNumber,
        deliveryPrice,
        _id,
    } = product;
    const axiosSecure = useAxiosSecure();

    // Handle Delete with SweetAlert Confirmation
    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/products/${_id}`);
                Swal.fire("Deleted!", "Product has been deleted.", "success");
                refetch();
            } catch {
                Swal.fire("Error!", "Failed to delete product.", "error");
            }
        }
    };

    return (
        <tr className="border-t border-gray-300 hover:bg-indigo-50">
            <td className="p-3 text-center border">
                <img
                    src={image}
                    alt={productName}
                    className="w-16 h-16 object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105"
                />
            </td>
            <td className="p-3 border text-center text-gray-800 font-semibold">
                <div className="whitespace-nowrap overflow-x-auto">{productName}</div>
            </td>

            <td className="p-3 border text-left text-gray-600">{shopName}</td>
            <td className="p-3 border text-center text-gray-800">{price} BDT</td>
            <td className="p-3 border text-center text-gray-800">{quantity}</td>
            <td className="p-3 border text-left text-gray-600">{category}</td>
            <td className="p-3 border text-left">
                {sizes.length > 0 ? (
                    <div className="flex gap-2">
                        {sizes.map((size, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm">
                                {size}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-400">N/A</span>
                )}
            </td>

            <td className="p-3 border text-left text-gray-600">{bkashNumber || "N/A"}</td>
            <td className="p-3 border text-left text-gray-600">{nogodNumber || "N/A"}</td>
            <td className="p-3 border text-center text-gray-600">{deliveryPrice || 'Free'}</td>
            <td className="p-3 text-center flex justify-center items-center mt-3 space-x-3">
               <Link to={`/dashboard/edit-products/${_id}`}>
               <button className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg">
                    <FaEdit className="text-white" /> {/* Edit Icon */}
                    <span className="hidden md:block">Edit</span>
                </button>
               </Link>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                    <FaTrashAlt className="text-white" /> {/* Delete Icon */}
                    <span className="hidden md:block">Delete</span>
                </button>
            </td>
        </tr>
    );
};

MyInventoryRow.propTypes = {
    product: PropTypes.shape({
        productName: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        shopName: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        category: PropTypes.string.isRequired,
        sizes: PropTypes.array.isRequired,
        bkashNumber: PropTypes.string,
        nogodNumber: PropTypes.string,
        deliveryPrice: PropTypes.number.isRequired,
        _id: PropTypes.string.isRequired,
    }).isRequired,
    refetch: PropTypes.func.isRequired,
};

export default MyInventoryRow;
