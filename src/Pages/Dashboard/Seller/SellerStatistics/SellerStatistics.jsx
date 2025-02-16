import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup"; // সংখ্যা অ্যানিমেশন
import Calendar from "react-calendar"; // ক্যালেন্ডার লাইব্রেরি
import "react-calendar/dist/Calendar.css"; // ক্যালেন্ডারের স্টাইল
import { Line } from "react-chartjs-2"; // গ্রাফ লাইব্রেরি
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js সেটআপ
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SellerStatistics = () => {
    const axiosSecure = useAxiosSecure();
    const { data: stats, isLoading } = useQuery({
        queryKey: ["seller-statistics"],
        queryFn: async () => {
            const { data } = await axiosSecure.get("/seller-statistics");
            return data;
        },
    });

    // Loading state
    if (isLoading) return <p className="text-center text-lg font-semibold">Loading...</p>;

    // Chart Data Setup
    const chartData = {
        labels: stats?.orders?.map(order => new Date(order.orderDate).toLocaleDateString("en-GB")) || [],
        datasets: [
            {
                label: 'Order Price',
                data: stats?.orders?.map(order => order.price) || [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Seller Statistics</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Orders */}
                <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
                    <h3 className="text-xl font-semibold mb-2">Total Orders</h3>
                    <p className="text-3xl">
                        <CountUp start={0} end={stats?.totalOrders || 0} duration={2.5} separator="," />
                    </p>
                </div>

                {/* Total Sales */}
                <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
                    <h3 className="text-xl font-semibold mb-2">Total Sales</h3>
                    <p className="text-3xl">
                        <CountUp start={0} end={stats?.totalPrice || 0} duration={2.5} prefix="৳" separator="," />
                    </p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-center mb-4">Orders List</h3>
                {stats?.orders?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="border px-4 py-2">Serial</th>
                                    <th className="border px-4 py-2">Customer Name</th>
                                    <th className="border px-4 py-2">Order Date</th>
                                    <th className="border px-4 py-2">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.orders.map((order, index) => (
                                    <tr className="text-center border-b hover:bg-gray-100" key={order._id}>
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{order.customer?.name || "N/A"}</td>
                                        <td className="border px-4 py-2">{new Date(order.orderDate).toLocaleDateString("en-GB")}</td>
                                        <td className="border px-4 py-2">৳{order.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No orders found.</p>
                )}
            </div>

            {/* Calendar and Graph Section */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Calendar */}
                <div className="p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
                    <h3 className="text-xl font-semibold text-center mb-4">Select a Date</h3>
                    <Calendar 
                        className="shadow-lg rounded-lg w-full"
                        onChange={(date) => console.log(date)}
                        value={new Date()}
                    />
                </div>

                {/* Graph */}
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-center mb-4">Order Price Graph</h3>
                    <Line data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default SellerStatistics;
