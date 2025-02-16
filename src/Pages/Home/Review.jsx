import { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaCheckCircle } from "react-icons/fa";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/reviews")
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  const handleImageClick = (url) => {
    setModalImage(url);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="lg:text-4xl text-3xl md:text-2xl font-bold mb-6 text-center">
          Customer Reviews
        </h2>
        <p className="text-sm text-center mb-8">
          Read real reviews from verified customers, complete with ratings, images, and helpful insights to guide your shopping decisions.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-2 md:p-3 rounded-lg shadow-md flex flex-col justify-between text-center"
            >
              {/* User Info & Rating */}
              <div className="flex flex-col items-center mb-2">
                <img
                  src={review.userPhoto}
                  alt="Reviewer"
                  className="w-8 h-8 rounded-full mb-1"
                />
                <h3 className="text-xs font-semibold">{review.name}</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      } text-xs`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Text with Scroll */}
              <p className="text-gray-700 text-xs mb-2 overflow-y-auto max-h-[50px]">
                {review.review}
              </p>

              {/* Review Image */}
              {review.photoUrl && (
                <img
                  src={review.photoUrl}
                  alt="Review"
                  className="w-full h-24 md:h-28 object-contain rounded-md mb-2 cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
                  onClick={() => handleImageClick(review.photoUrl)}
                />
              )}

              {/* Date & Verified Purchase */}
              <div className="text-xs text-gray-500 flex justify-between">
                <span>{new Date(review.date).toLocaleDateString()}</span>
                <span className="text-green-500 flex items-center">
                  <FaCheckCircle className="mr-1 text-xs" />
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Full-Size Image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <img
            src={modalImage}
            alt="Full Size Review"
            className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl rounded shadow-lg"
          />
        </div>
      )}
    </section>
  );
};

export default Reviews;
