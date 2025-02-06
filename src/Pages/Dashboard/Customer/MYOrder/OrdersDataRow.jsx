import Swal from "sweetalert2";
import PropTypes from "prop-types";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useState } from "react"; // Added to manage loading state

const OrdersDataRow = ({ order, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const { name, image, price, quantity, status, address, size, transactionId, _id,productId } = order;
  const [loading, setLoading] = useState(false); // Manage loading state

  const handleCancel = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "Once canceled, you will not be able to recover this order!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Cancel it!",
    }).then(async (result) => {
        if (result.isConfirmed) {
            setLoading(true); // Start loading
            try {
                // Delete order
                const response = await axiosSecure.delete(`/orders/${id}`);

                // Update stock if the order is canceled
                const updateStock = await axiosSecure.patch(
                    `/products/quantity/${productId}`,
                    { quantityToUpdate: quantity, status: 'increase' } // Increase stock
                );

                // Check if both delete and stock update are successful
                if (response.status === 200 && updateStock.status === 200) {
                    Swal.fire("Canceled!", "Your order has been canceled.", "success");
                    refetch(); // ✅ Refresh UI
                } else {
                    Swal.fire("Failed!", "Something went wrong during cancellation or stock update.", "error");
                }
            } catch (error) {
                // Enhanced error handling
                Swal.fire("Error!", `Failed to cancel the order. Error: ${error.message}`, "error");
            } finally {
                setLoading(false); // Stop loading
            }
        }
    });
};


  return (
    <tr className="border-b">
      <td className="px-4 py-2 flex items-center space-x-2">
        <img src={image} alt={name} className="w-12 h-12 object-cover rounded" />
        <span className="ml-2">{name}</span>
      </td>
      <td className="px-10 py-2">{price}</td>
      <td className="px-4 py-2">{quantity}</td>
      <td className="px-4 py-2">
        <span
          className={`px-2 py-1 rounded-full ${
            status === "pending"
              ? "bg-yellow-500 text-white"
              : status === "approved"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-2">{address}</td>
      <td className="px-4 py-2">{size ? size : "-"}</td>
      <td className="px-4 py-2">{transactionId}</td>
      <td className="px-4 py-2">
        {status === "pending" && (
          <button
            onClick={() => handleCancel(_id)}
            className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-700 transition duration-300"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Cancelling..." : "Cancel"} {/* Show loading text */}
          </button>
        )}
      </td>
    </tr>
  );
};

// ✅ **Props Validation**
OrdersDataRow.propTypes = {
  order: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    size: PropTypes.string,
    productId: PropTypes.string.isRequired,
    transactionId: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default OrdersDataRow;
