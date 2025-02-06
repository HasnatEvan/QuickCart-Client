import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import MyInventoryRow from "./MyInventoryRow";

const MyInventory = () => {
    const axiosSecure = useAxiosSecure();
  
    const { data: products = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/products/seller`);
            return data;
        },
    });

    if (isLoading) return <div className="text-center text-lg">Loading...</div>;
    if (isError) return <div className="text-center text-red-500">Error loading products</div>;

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">My Inventory</h1>
            
            {/* টেবিল তৈরি করা হলো */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 text-left">
                            <th className="p-3 border">Image</th>
                            <th className="p-3 border">Product Name</th>
                            <th className="p-3 border">Shop Name</th>
                            <th className="p-3 border">Price (BDT)</th>
                            <th className="p-3 border">Quantity</th>
                            <th className="p-3 border">Category</th>
                            <th className="p-3 border">Sizes</th>
                            <th className="p-3 border">Bkash</th>
                            <th className="p-3 border">Nogod</th>
                            <th className="p-3 border">Delivery (BDT)</th>
                            <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <MyInventoryRow key={product.id} product={product} refetch={refetch} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyInventory;
