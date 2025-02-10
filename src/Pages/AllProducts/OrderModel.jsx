import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import useAuth from "../../Hooks/useAuth";
import PropTypes from "prop-types";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const OrderModel = ({
  closeModal,
  productName,
  price,
  size,
  seller,
  deliveryPrice,
  bkashNumber,
  nogodNumber,
  quantity,
  _id,
}) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalPrice, setTotalPrice] = useState(price);
  const [loading, setLoading] = useState(false); // New loading state

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= quantity) {
      setSelectedQuantity(value);
      setTotalPrice(value * price + deliveryPrice);
    }
  };

  const handleConfirmOrder = async () => {
    if (!customerPhone.trim()) {
      Swal.fire({
        title: "Oops!",
        text: "Please enter your phone number.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (!customerAddress.trim()) {
      Swal.fire({
        title: "Oops!",
        text: "Please enter your delivery address.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (deliveryPrice > 0 && !transactionId.trim()) {
      Swal.fire({
        title: "Oops!",
        text: "Please enter your transaction ID.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (deliveryPrice > 0 && !paymentMethod) {
      Swal.fire({
        title: "Oops!",
        text: "Please select a payment method.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true); // Set loading state to true

    const updatedOrderInfo = {
      customer: {
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL,
      },
      productId: _id,
      price: totalPrice,
      quantity: selectedQuantity,
      transactionId,
      paymentMethod,
      customerPhone,
      deliveryPrice,
      address: customerAddress,
      seller: seller?.email,
      size: size || "No size available",
      status: "pending",
    };

    try {
      const response = await axiosSecure.post("/orders", updatedOrderInfo);
      if (response.data.insertedId) {
        const updateStock = await axiosSecure.patch(`/products/quantity/${_id}`, {
          quantityToUpdate: selectedQuantity,
          status: "decrease",
        });

        if (updateStock.data.modifiedCount > 0) {
          Swal.fire({
            title: "Success!",
            text: "Order placed successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate('/dashboard/my-orders');
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Stock update failed. Please check inventory.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to place order. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <Dialog open={true} as="div" className="relative z-10" onClose={closeModal}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center px-4">
        <DialogPanel className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl rounded-lg bg-white shadow-lg max-h-[calc(100vh-50px)] overflow-y-auto">
          <div className="px-4 py-6 mt-10">
            <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
              Confirm Your Order
            </DialogTitle>

            <div className="mt-4 text-gray-600 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>Product:</strong> {productName}</p>
                <p><strong>Price:</strong> {price} BDT</p>
                <p><strong>Size:</strong> {size || "Not Selected"}</p>
                {deliveryPrice > 0 && (
                  <p><strong>Delivery Charge:</strong> {deliveryPrice} BDT</p>
                )}
                <p><strong>Available Quantity:</strong> {quantity}</p>
                <p><strong>Customer:</strong> {user?.displayName}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium">Quantity:</label>
                  <input
                    type="number"
                    value={selectedQuantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={quantity}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {deliveryPrice > 0 && (
                  <div>
                    <label className="block text-gray-700 font-medium">Transaction ID:</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter transaction ID"
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Customer Phone:</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Delivery Address:</label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Enter delivery address"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                ></textarea>
              </div>

              {deliveryPrice > 0 && (
                <div>
                  <p className="font-medium text-gray-700">Select Payment Method:</p>
                  <div className="flex flex-col md:flex-row gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment"
                        value="bkash"
                        checked={paymentMethod === "bkash"}
                        onChange={() => setPaymentMethod("bkash")}
                        className="text-indigo-500"
                      />
                      <span>Bkash ({bkashNumber})</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment"
                        value="nagad"
                        checked={paymentMethod === "nagad"}
                        onChange={() => setPaymentMethod("nagad")}
                        className="text-indigo-500"
                      />
                      <span>Nagad ({nogodNumber})</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-between gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-lime-500 text-white rounded-md text-sm sm:text-base md:text-lg lg:text-xl"
                onClick={handleConfirmOrder}
              >
                {loading ? (
                  <span className="loading loading-ball loading-lg"></span>
                ) : (
                  `Confirm Order (${deliveryPrice > 0 ? `${deliveryPrice} BDT` : `${price} BDT`})`
                )}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

OrderModel.propTypes = {
  closeModal: PropTypes.func.isRequired,
  productName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  size: PropTypes.string,
  seller: PropTypes.object,
  deliveryPrice: PropTypes.number.isRequired,
  bkashNumber: PropTypes.string.isRequired,
  nogodNumber: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  _id: PropTypes.string.isRequired,
};

export default OrderModel;
