import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";  // SweetAlert Import

const ReviewData = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { data: reviews, isLoading, error } = useQuery({
        queryKey: ['reviews', id],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:5000/reviews/product/${id}`);
            return data;
        },
        enabled: !!id,
    });

    const [editingReview, setEditingReview] = useState(null);
    const [updatedText, setUpdatedText] = useState("");

    // Delete Review
    const deleteMutation = useMutation({
        mutationFn: async (reviewId) => {
            await axios.delete(`http://localhost:5000/reviews/${reviewId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['reviews', id]);
            Swal.fire("Deleted!", "Review has been deleted.", "success");
        }
    });

    // Update Review
    const updateMutation = useMutation({
        mutationFn: async ({ reviewId, updatedReview }) => {
            await axios.put(`http://localhost:5000/reviews/${reviewId}`, { review: updatedReview });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['reviews', id]);
            setEditingReview(null);
            Swal.fire("Updated!", "Review has been updated.", "success");
        }
    });

    if (isLoading) return <p className="text-center text-gray-600 text-lg">🔄 Loading reviews...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">❌ Error: {error.message}</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Customer Reviews</h3>
            {reviews?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <img src={review?.userPhoto || "https://via.placeholder.com/150"} alt="User"
                                        className="w-12 h-12 rounded-full object-cover mr-3 border border-gray-300"/>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900">{review.name}</h4>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, index) => (
                                                <svg key={index} xmlns="http://www.w3.org/2000/svg"
                                                    fill={index < review.rating ? "#FFD700" : "#D1D5DB"}
                                                    viewBox="0 0 24 24" width="18" height="18" className="mr-1">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Edit & Delete Buttons */}
                                {user?.displayName === review.name && (
                                    <div className="flex gap-2">
                                        <button 
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => {
                                                setEditingReview(review._id);
                                                setUpdatedText(review.review);
                                            }}>
                                            ✏️ Edit
                                        </button>
                                        <button 
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                                Swal.fire({
                                                    title: "Are you sure?",
                                                    text: "You won't be able to revert this!",
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#3085d6",
                                                    cancelButtonColor: "#d33",
                                                    confirmButtonText: "Yes, delete it!"
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        deleteMutation.mutate(review._id);
                                                    }
                                                });
                                            }}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Review Text */}
                            {editingReview === review._id ? (
                                <div>
                                    <textarea value={updatedText} onChange={(e) => setUpdatedText(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"/>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => updateMutation.mutate({ reviewId: review._id, updatedReview: updatedText })}
                                            className="px-3 py-1 bg-green-500 text-white rounded-md">
                                            ✅ Save
                                        </button>
                                        <button
                                            onClick={() => setEditingReview(null)}
                                            className="px-3 py-1 bg-gray-400 text-white rounded-md">
                                            ❌ Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-700 mb-3 text-sm italic">{"“" + review.review + "”"}</p>

                            )}

                            {/* Review Image */}
                            {review.photoUrl && (
                                <div className="mt-3">
                                    <img src={review.photoUrl} alt="Review" className="w-full h-auto rounded-lg shadow-md object-cover"/>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg">📭 No reviews available.</p>
            )}
        </div>
    );
};

export default ReviewData;
