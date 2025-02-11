import { useState } from "react";
import { imageUpload } from "../../Api/utils";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ReviewModel = ({ closeModal, _id }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [review, setReview] = useState("");
  const [photo, setPhoto] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let uploadedPhotoUrl = "";
      if (photo) {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(photo.type)) {
          setError("Only JPG, JPEG, and PNG formats are allowed.");
          setLoading(false);
          return;
        }
        uploadedPhotoUrl = await imageUpload(photo);
      }

      const reviewData = {
        name: user?.displayName,
        review,
        rating,
        photoUrl: uploadedPhotoUrl,
        userPhoto: user?.photoURL || "",
        productId: _id,
      };

      await axios.post("http://localhost:5000/reviews", reviewData);

      Swal.fire({
        title: "Review Submitted!",
        text: "Your review has been successfully added.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        queryClient.invalidateQueries(["reviews", _id]);
        setReview("");
        setPhoto(null);
        setRating(0);
        closeModal();
        window.location.reload();
      });

    } catch (err) {
        console.error("Error submitting review:", err);
        setError("Failed to submit review. Please try again.");
      }
       finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Add Review</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center gap-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt="User Profile"
                className="w-10 h-10 rounded-full border"
              />
            )}
            <input
              type="text"
              value={user?.displayName || ""}
              className="w-full p-3 border border-gray-300 rounded-md"
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Rating</label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={rating >= star ? "yellow" : "gray"}
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="cursor-pointer"
                  onClick={() => setRating(star)}
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Upload Photo</label>
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 p-3 rounded-md text-white ${loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"}`}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-1/2 p-3 rounded-md bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ PropTypes validation
ReviewModel.propTypes = {
  closeModal: PropTypes.func.isRequired,
  _id: PropTypes.string.isRequired,
};

export default ReviewModel;
