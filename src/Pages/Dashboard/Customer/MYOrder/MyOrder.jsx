import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import OrdersDataRow from "./OrdersDataRow";

const MyOrder = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/customer-orders/${user?.email}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-5">
        ❌ Error loading orders. Please try again later.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">📦 My Orders</h2>
      <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-lime-500 text-white text-center">
          <tr>
            <th className="px-4 py-3 border">Product</th>
            <th className="px-4 py-3 border">Name</th>
            <th className="px-4 py-3 border">Price</th>
            <th className="px-4 py-3 border">Quantity</th>
            <th className="px-4 py-3 border">Status</th>
            <th className="px-4 py-3 border">Address</th>
            <th className="px-4 py-3 border">Number</th>
            <th className="px-4 py-3 border">Size</th>
            <th className="px-4 py-3 border">Transaction ID</th>
            <th className="px-4 py-3 border">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrdersDataRow key={order._id} order={order} refetch={refetch} />
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-gray-500 py-6">
                ❌ No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrder;
