import Swal from "sweetalert2";
import PropTypes from "prop-types";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useState } from "react";

const ManageOrderRow = ({ order, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const { name, image, price, quantity, status, address, customerPhone, size, transactionId, _id, productId, paymentMethod, deliveryPrice, customer } = order;
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

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
        setLoading(true);
        try {
          // Update stock
          const updateStock = await axiosSecure.patch(`/products/quantity/${productId}`, {
            quantityToUpdate: quantity,
            status: "increase",
          });

          if (updateStock.status !== 200) {
            Swal.fire("Error!", "Stock update failed, please try again.", "error");
            return;
          }

          // Delete order
          const response = await axiosSecure.delete(`/orders/${id}`);

          if (response.status === 200) {
            Swal.fire("Canceled!", "Your order has been canceled.", "success");
            refetch();
          } else {
            Swal.fire("Failed!", "Something went wrong during cancellation.", "error");
          }
        } catch (error) {
          Swal.fire("Error!", `Failed to cancel the order. Error: ${error.message}`, "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleStatusChange = async (newStatus) => {
    setCurrentStatus(newStatus);
    try {
      const response = await axiosSecure.patch(`/update-order-status/${_id}`, { status: newStatus });
      if (response.status === 200) {
        Swal.fire("Success!", "Order status has been updated.", "success");
        refetch();
      } else {
        Swal.fire("Failed!", "Failed to update the status.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", `Failed to update the status. Error: ${error.message}`, "error");
    }
  };

  return (
    <tr className="border-b">
      <td className="px-4 py-2 flex items-center space-x-2">
        <img src={image} alt={name} className="w-12 h-12 object-cover rounded" />
      </td>
      <td className="px-4 py-2">
        <div className="whitespace-nowrap overflow-x-auto text-center">{name}</div>
      </td>


      <td className="px-4 py-2">
        <div className="whitespace-nowrap overflow-x-auto">{customer?.name || "-"}</div>
      </td>

      <td className="px-4 py-2">{customer?.email || "-"}</td>
      <td className="px-4 py-2">{customerPhone}</td>
      <td className="px-4 py-2">{address}</td>
      <td className="px-4 py-2">{paymentMethod ||'Free-Delivery'}</td>
      <td className="px-4 py-2">{deliveryPrice || 'Free-Delivery'}</td>
      <td className="px-4 py-2">{transactionId || "Free-Delivery"}</td>
      <td className="px-4 py-2">{size || "No size available"}</td>
      <td className="px-4 py-2">{price}</td>
      <td className="px-10 py-2">{quantity}</td>
      <td className="px-4 py-2">
        <span
          className={`px-2 py-1 rounded-full ${status.toLowerCase() === "pending"
            ? "bg-yellow-500 text-white"
            : status.toLowerCase() === "approved"
              ? "bg-green-500 text-white"
              : status.toLowerCase() === "canceled"
                ? "bg-red-500 text-white"
                : "bg-lime-500 text-white"
            }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="border p-2 font-semibold flex items-center gap-4">
        {/* Status Change Dropdown */}
        <select
          className={`p-2 rounded ${currentStatus === "Pending"
            ? "bg-lime-500 text-white"       // Lime color for Pending
            : currentStatus === "Processing"
              ? "bg-lime-500 text-white"       // Lime color for Processing
              : currentStatus === "Delivered"
                ? "bg-lime-500 text-white"       // Lime color for Delivered
                : currentStatus === "Canceled"
                  ? "bg-lime-500 text-white"       // Lime color for Canceled
                  : "bg-lime-500 text-white"       // Lime color for any other status
            }`}
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Start Processing</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>

        {/* Cancel Button - Only for Pending or Canceled */}
        {(status.toLowerCase() === "pending" || status.toLowerCase() === "canceled") && (
          <button
            onClick={() => handleCancel(_id)}
            className={`py-1 px-4 rounded transition duration-300 ${loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-red-500 hover:bg-red-700 text-white"
              }`}
            disabled={loading}
          >
            {loading ? <span className="animate-spin">⏳</span> : "Cancel"}
          </button>
        )}
      </td>
    </tr>
  );
};

// ✅ **Props Validation**
ManageOrderRow.propTypes = {
  order: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    size: PropTypes.string,
    productId: PropTypes.string.isRequired,
    transactionId: PropTypes.string,
    paymentMethod: PropTypes.string.isRequired,
    deliveryPrice: PropTypes.number.isRequired,
    customerPhone: PropTypes.string.isRequired,
    customer: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ManageOrderRow;
