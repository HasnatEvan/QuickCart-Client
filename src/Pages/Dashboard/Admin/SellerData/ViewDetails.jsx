import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const ViewDetails = () => {
    const { id } = useParams(); // Get the seller's ID from the URL
    const axiosSecure = useAxiosSecure();

    // Fetch seller data based on ID
    const { data: seller, isLoading, error } = useQuery({
        queryKey: ['seller', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/seller/${id}`);
            return data;
        },
    });

    // Handle loading and error states
    if (isLoading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500">Error loading seller details</div>;

    // Function to trigger image download
    const downloadImage = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Seller Details</h1>

            <div className="space-y-6">
                {/* Seller's Name */}
                <div className="flex justify-between items-center border-b pb-4">
                    <strong className="text-lg text-gray-700">Name:</strong>
                    <p className="text-lg text-gray-600">{seller.name}</p>
                </div>

                {/* Seller's Email */}
                <div className="flex justify-between items-center border-b pb-4">
                    <strong className="text-lg text-gray-700">Email:</strong>
                    <p className="text-lg text-gray-600">{seller.email}</p>
                </div>

                {/* Seller's Phone */}
                <div className="flex justify-between items-center border-b pb-4">
                    <strong className="text-lg text-gray-700">Phone:</strong>
                    <p className="text-lg text-gray-600">{seller.phone}</p>
                </div>

                {/* Seller's Photo */}
                <div className="flex justify-between items-center border-b pb-4">
                    <strong className="text-lg text-gray-700">Photo:</strong>
                    <div className="flex items-center space-x-2">
                        <img
                            src={seller.photo}
                            alt="Seller Photo"
                            className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                        />
                        <button
                            onClick={() => downloadImage(seller.photo, 'seller-photo.jpg')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Download
                        </button>
                    </div>
                </div>

                {/* Seller's NID Front */}
                <div className="flex justify-between items-center border-b pb-4">
                    <strong className="text-lg text-gray-700">NID Front:</strong>
                    <div className="flex items-center space-x-2">
                        <img
                            src={seller.nidFront}
                            alt="NID Front"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                            onClick={() => downloadImage(seller.nidFront, 'nid-front.jpg')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Download
                        </button>
                    </div>
                </div>

                {/* Seller's NID Back */}
                <div className="flex justify-between items-center border-b pb-4">
                    <strong className="text-lg text-gray-700">NID Back:</strong>
                    <div className="flex items-center space-x-2">
                        <img
                            src={seller.nidBack}
                            alt="NID Back"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                            onClick={() => downloadImage(seller.nidBack, 'nid-back.jpg')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Download
                        </button>
                    </div>
                </div>

                {/* Seller's Role */}
                <div className="flex justify-between items-center border-b pb-4">
                    <strong className="text-lg text-gray-700">Role:</strong>
                    <p className="text-lg text-gray-600">{seller.role}</p>
                </div>

                {/* Seller's Timestamp */}
                <div className="flex justify-between items-center">
                    <strong className="text-lg text-gray-700">Timestamp:</strong>
                    <p className="text-lg text-gray-600">{new Date(seller.timestamp).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ViewDetails;
