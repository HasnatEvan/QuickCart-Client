import PropTypes from 'prop-types';
import { FaShoppingCart } from 'react-icons/fa'; // Importing the cart icon
import { Link } from 'react-router-dom';

const Card = ({ product }) => {
  // Destructure properties from the product object
  const { _id, productName, image, price, discountPercentage } = product;

  // Calculate discounted price if discountPercentage exists
  const discountedPrice = discountPercentage
    ? price - (price * discountPercentage) / 100
    : price;

  return (
    <Link to={`/product/${_id}`}> {/* Using the product's ID to generate the URL */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6 transition-transform transform hover:scale-105 duration-300">
        <img
          src={image}
          alt={productName}
          className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg mb-5"
        />
        <h3 className="lg:text-lg font-semibold text-gray-800 mb-3">{productName}</h3>
        <div className="flex justify-between items-center mt-3">
          {/* Show original price if discount exists */}
          {discountPercentage ? (
            <div className="flex flex-row gap-3">
              <span className="font-bold text-gray-800 flex items-center">
                <FaShoppingCart className="mr-2" /> {/* Cart icon with margin */}
                <span className="line-through text-gray-500">{price} BDT</span>
              </span>
              <span className="font-bold text-red-600">
                {discountedPrice.toFixed(2)} BDT {/* Display discounted price */}
              </span>
            </div>
          ) : (
            <span className="font-bold text-gray-800 flex items-center">
              <FaShoppingCart className="mr-2" /> {price} BDT
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

// PropTypes validation
Card.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Make sure to validate the `id`
    productName: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired, // Changed to number for price
    discountPercentage: PropTypes.number, // Added discount percentage as optional
  }).isRequired,
};

export default Card;
