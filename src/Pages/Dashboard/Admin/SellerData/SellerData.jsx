import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import SellerDataCard from "./SellerDataCard";

const SellerData = () => {
    const axiosSecure = useAxiosSecure();

    const { data: sellers = [],  refetch } = useQuery({
        queryKey: ['sellers'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/sellers');
            return data;
        },
    });
    
    

    return (
        <div className="overflow-x-auto p-5">
            <h2 className="text-2xl font-bold mb-4">Seller Data</h2>
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Phone</th>
                        <th className="p-3 text-left">Photo</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sellers.map((seller) => (
                        <SellerDataCard key={seller.email} seller={seller} refetch={refetch} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SellerData;
