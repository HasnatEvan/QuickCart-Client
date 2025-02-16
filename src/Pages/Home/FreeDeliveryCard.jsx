import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const FreeDeliveryCard = ({ item }) => {
    const { productName, shopName, price, image } = item;

    return (
        <div className="bg-white p-3 rounded-xl shadow-md transition-transform transform hover:scale-105 duration-300">
            <img
                src={image}
                alt={productName}
                className="w-full h-36 object-contain rounded-lg mx-auto"
            />

            <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-900">{productName}</h3>
                <p className="text-xs text-gray-600">Shop: {shopName}</p>

                <div className="mt-2">
                    <span className="font-bold text-gray-800 text-sm">{price} BDT</span>
                </div>

                <Link to={'/products'}>
                    <button className="mt-2 w-full bg-lime-500 text-white py-1 rounded-lg hover:bg-green-600 transition duration-200">
                        Buy Now
                    </button>
                </Link>
            </div>
        </div>
    );
};

// PropTypes Validation
FreeDeliveryCard.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string.isRequired,   
        productName: PropTypes.string.isRequired,
        shopName: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
    }).isRequired,
};

export default FreeDeliveryCard;
