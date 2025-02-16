import Swal from "sweetalert2";
import PropTypes from "prop-types";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useState } from "react";

const OrdersDataRow = ({ order, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const { name, image, price, quantity, status, address,customerPhone, size, transactionId, _id, productId } = order;
  const [loading, setLoading] = useState(false);

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
          // Update stock first
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

  return (
    <tr className="border-b text-center">
      <td className="px-4 py-2">
        <img src={image} alt={name} className="w-12 h-12 object-cover rounded mx-auto" />
      </td>
      <td className="px-4 py-2">
        <div className="whitespace-nowrap overflow-x-auto">{name}</div>
      </td>

      <td className="px-4 py-2">{Number(price).toFixed(2)}</td>

      <td className="px-4 py-2">{quantity}</td>
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
      <td className="px-4 py-2">{address}</td>
      <td className="px-4 py-2">{customerPhone}</td>
      <td className="px-4 py-2">{size ? size : "-"}</td>
      <td className="px-4 py-2">{transactionId || "Free-Delivery"}</td>
      <td className="px-4 py-2">
        {(status.toLowerCase() === "pending" || status.toLowerCase() === "canceled") && (
          <button
            onClick={() => handleCancel(_id)}
            className={`py-1 px-4 rounded transition duration-300 ${loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-red-500 hover:bg-red-700 text-white"
              }`}
            disabled={loading}
          >
            {loading ? "Cancelling..." : "Cancel"}
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
    customerPhone: PropTypes.string.isRequired,
    size: PropTypes.string,
    productId: PropTypes.string.isRequired,
    transactionId: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default OrdersDataRow;
