import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const DiscountCard = ({ item }) => {
    const { productName, shopName, price, discountedPrice, image } = item;

    return (
        <div className="bg-white p-3 rounded-xl shadow-md mb-4 transition-transform transform hover:scale-105 duration-300 relative overflow-hidden w-full sm:w-52">
            {/* Product Image */}
            <div className="relative">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-36 object-contain rounded-lg mx-auto"
                />
                {/* Discount Badge */}
                {discountedPrice < price && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        -{(((price - discountedPrice) / price) * 100).toFixed(0)}%
                    </span>
                )}
            </div>

            {/* Product Info */}
            <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-900">{productName}</h3>
                <p className="text-xs text-gray-600">Shop: {shopName}</p>

                {/* Price Section */}
                <div className="flex justify-between items-center mt-2">
                    {discountedPrice < price ? (
                        <div className="flex flex-row gap-2 items-center">
                            <span className="font-bold text-gray-500 line-through text-xs">
                                {price} BDT
                            </span>
                            <span className="font-bold text-red-600 text-sm">
                                {discountedPrice.toFixed(2)} BDT
                            </span>
                        </div>
                    ) : (
                        <span className="font-bold text-gray-800 text-sm">{price} BDT</span>
                    )}
                </div>

                {/* Buy Now Button */}
                <Link to={'/products'}>
                    <button className="mt-2 w-full bg-lime-500 text-white py-1 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105">
                        Buy Now
                    </button>
                </Link>
            </div>
        </div>
    );
};

DiscountCard.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        
productName: PropTypes.string.isRequired,
        shopName: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        discountedPrice: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
    }).isRequired,
};

export default DiscountCard;
