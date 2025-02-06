import PropTypes from 'prop-types';
import { FaShoppingCart } from 'react-icons/fa'; // Importing the cart icon
import { Link } from 'react-router-dom';

const Card = ({ product }) => {
  // Destructure properties from the product object
  const { _id, productName, image, price } = product;

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
          <span className="font-bold text-gray-800 flex items-center">
            <FaShoppingCart className="mr-2" /> {/* Cart icon with margin */}
            {price} BDT
          </span>
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
    price: PropTypes.string.isRequired,
  }).isRequired,
};

export default Card;
