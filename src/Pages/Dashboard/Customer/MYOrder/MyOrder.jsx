
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
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="text-left">
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Size</th>
            <th className="px-4 py-2">Transaction ID</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrdersDataRow key={order._id} order={order} refetch={refetch} />
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-gray-500 py-4">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrder;
