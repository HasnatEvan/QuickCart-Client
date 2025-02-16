import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { FaUsers, FaBoxOpen, FaClipboardList, FaCartPlus } from 'react-icons/fa'; // React Icons import
import CountUp from 'react-countup'; // Importing CountUp

// Chart.js সেটআপ
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Statistics = () => {
    const axiosSecure = useAxiosSecure();
    const { data: stats, isLoading } = useQuery({
        queryKey: ["admin-stat"],
        queryFn: async () => {
            const { data } = await axiosSecure.get("/admin-stat");
            return data;
        },
    });

    if (isLoading) return <p>Loading...</p>;

    // মোট দাম হিসাব করা এবং NaN রোধ করা
    const totalPrice = Math.floor(stats?.todayOrders?.reduce((acc, order) => {
        const price = parseFloat(order.price);
        return acc + (isNaN(price) ? 0 : price);
    }, 0) || 0);

    // তারিখ অনুযায়ী অর্ডারের মোট দাম হিসাব করা
    const orderByDate = stats?.todayOrders?.reduce((acc, order) => {
        const date = new Date(order.orderDate).toLocaleDateString(); // তারিখ বের করা
        const price = parseFloat(order.price);
        if (isNaN(price)) return acc;
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += price; // একই তারিখের দাম যোগ করা
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(orderByDate) || [],
        datasets: [
            {
                label: "Total Price by Date",
                data: Object.values(orderByDate) || [],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Users Card */}
                <div className="bg-blue-500 text-white p-4 rounded-lg flex items-center space-x-3">
                    <FaUsers className="text-3xl" />
                    <div>
                        <h3 className="text-lg font-semibold">Total Users</h3>
                        <p className="text-xl">
                            <CountUp start={0} end={stats?.totalUsers || 0} duration={2.5} separator="," />
                        </p>
                    </div>
                </div>
                {/* Total Products Card */}
                <div className="bg-green-500 text-white p-4 rounded-lg flex items-center space-x-3">
                    <FaBoxOpen className="text-3xl" />
                    <div>
                        <h3 className="text-lg font-semibold">Total Products</h3>
                        <p className="text-xl">
                            <CountUp start={0} end={stats?.totalProducts || 0} duration={2.5} separator="," />
                        </p>
                    </div>
                </div>
                {/* Today's Orders Card */}
                <div className="bg-yellow-500 text-white p-4 rounded-lg flex items-center space-x-3">
                    <FaClipboardList className="text-3xl" />
                    <div>
                    <h3 className="text-lg font-semibold">Today&apos;s Orders</h3>

                        <p className="text-xl">
                            <CountUp start={0} end={stats?.todayOrders?.length || 0} duration={2.5} separator="," />
                        </p>
                    </div>
                </div>
                {/* Total Price Card */}
                <div className="bg-purple-500 text-white p-4 rounded-lg flex items-center space-x-3">
                    <FaCartPlus className="text-3xl" />
                    <div>
                        <h3 className="text-lg font-semibold">Total Price</h3>
                        <p className="text-xl">
                            <CountUp start={0} end={totalPrice} duration={2.5} separator="," prefix="৳" />
                        </p>
                    </div>
                </div>
            </div>

            {/* গ্রাফ চার্ট */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2 text-center">Total Price by Date</h3>
                {/* গ্রাফকে কেন্দ্রবিন্দুতে দেখানোর জন্য w-3/4 এবং mx-auto ব্যবহার করা হয়েছে */}
                <div className="w-3/4 h-64 mx-auto">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Today&apos;s Order List</h3>

                {stats?.todayOrders?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Serial</th>
                                    <th className="border px-4 py-2">Order ID</th>
                                    <th className="border px-4 py-2">Price</th>
                                    <th className="border px-4 py-2">Seller</th>
                                    <th className="border px-4 py-2">Date</th>
                                    <th className="border px-4 py-2">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.todayOrders
                                    .slice() // Array কপি করা
                                    .reverse() // অর্ডার রিভার্স করা
                                    .map((order, index) => (
                                        <tr key={index} className="text-center border-b hover:bg-gray-100">
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2">{order._id}</td>
                                            <td className="border px-4 py-2">৳{order.price}</td>
                                            <td className="border px-4 py-2">{order.seller}</td>
                                            <td className="border px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2">{new Date(order.orderDate).toLocaleTimeString()}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No orders placed today.</p>
                )}
            </div>
        </div>
    );
};

export default Statistics;
