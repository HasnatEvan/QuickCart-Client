import PropTypes from 'prop-types';
import { FaShoppingCart, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Card = ({ product }) => {
  const { _id, productName, image, price, discountPercentage, shopName } = product;

  const discountedPrice = discountPercentage
    ? price - (price * discountPercentage) / 100
    : price;

  return (
    <Link to={`/product/${_id}`} className="group">
      <div className="bg-white p-3 rounded-xl shadow-md mb-4 transition-transform transform hover:scale-105 duration-300 relative overflow-hidden">
        {/* Product Image */}
        <div className="relative">
          <img
            src={image}
            alt={productName}
            className="w-full h-36 sm:h-40 object-contain rounded-lg mx-auto"
          />
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-2">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-500 transition">
            {productName}
          </h3>

          <p className="text-xs text-gray-600 flex items-center mt-1">
            <FaTag className="mr-1 text-lime-500" /> {shopName}
          </p>

          {/* Price Section */}
          <div className="flex justify-between items-center mt-2">
            {discountPercentage ? (
              <div className="flex flex-row gap-2 items-center">
                <span className="font-bold text-gray-500 line-through text-xs">
                  {price} BDT
                </span>
                <span className="font-bold text-red-600 text-sm">
                  {discountedPrice.toFixed(2)} BDT
                </span>
              </div>
            ) : (
              <span className="font-bold text-gray-800 text-sm">
                {price} BDT
              </span>
            )}

            {/* Cart Icon */}
            <button className="p-2 bg-lime-500 text-white rounded-full hover:bg-blue-600 transition">
              <FaShoppingCart className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// PropTypes validation
Card.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discountPercentage: PropTypes.number,
    shopName: PropTypes.string.isRequired,
  }).isRequired,
};

export default Card;
