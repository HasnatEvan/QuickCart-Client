import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import ManageUserRow from "../ManageUserRow";

const ManageUsers = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: users = [],  refetch } = useQuery({
        queryKey: ['users', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/all-users/${user?.email}`);
            return data;
        },
    });

    // Sorting users so that 'Seller' appears at the top
    const sortedUsers = users.sort((a, b) => {
        if (a.role === "seller" && b.role !== "seller") return -1;
        if (a.role !== "seller" && b.role === "seller") return 1;
        return 0; // Keep other roles in the same order
    });

    return (
        <div className="overflow-x-auto p-5">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map(userData => (
                        <ManageUserRow key={userData._id} user={userData} refetch={refetch} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;
