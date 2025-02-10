import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import ManageOrderRow from "./ManageOrderRow";

const ManageOrder = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: orders = [], refetch } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/seller-orders/${user?.email}`);
      return data;
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">Manage Your Orders</h2> {/* Title */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-lime-500 text-white">
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Customer</th>
              <th className="py-2 px-4 border">Customer Email</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border">Payment</th>
              <th className="py-2 px-4 border">DeliveryPrice</th>
              <th className="py-2 px-4 border">TransactionId</th>
              <th className="py-2 px-4 border">Size</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Quantity</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <ManageOrderRow key={order.transactionId} order={order} refetch={refetch} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrder;
