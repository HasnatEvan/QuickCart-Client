import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AiOutlineClose } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { FaShopify } from "react-icons/fa";
import { BiMoney } from "react-icons/bi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import OrderModel from './OrderModel'; // Import the modal component
import useRole from '../../Hooks/useRole';

const CardDetails = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
  const [selectedSize, setSelectedSize] = useState(''); // State to manage selected size
  const [role] = useRole();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/product/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error fetching product details: {error.message}
      </div>
    );
  }

  // Calculate discounted price if a discount percentage exists
  const discountedPrice = product.discountPercentage
    ? product.price - (product.price * product.discountPercentage) / 100
    : product.price;

  // Disable button if the role is 'seller' or 'admin'
  const isDisabled = role === 'seller' || role === 'admin';

  return (
    <div className="p-6 relative">
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row relative">
        {/* Close Icon */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <AiOutlineClose className="w-6 h-6" />
        </button>

        {/* Product Image */}
        <div className="sm:w-1/2 mb-4 sm:mb-0 flex justify-center items-center">
          <img
            src={product.image}
            alt={`${product.productName} - ${product.category}`}
            className="w-full h-[500px] object-contain rounded-lg p-2"
            loading="lazy"
          />
        </div>

        {/* Product Details */}
        <div className="sm:w-1/2 sm:pl-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {product.productName}
          </h2>

          {/* Price */}
          <div className="mb-4">
            <p className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <BiMoney className="text-green-600" /> Price:
              {product.discountPercentage ? (
                <>
                  <span className="line-through text-gray-500">{product.price} BDT</span>
                  <span className="text-red-600 ml-2">
                    {discountedPrice.toFixed(2)} BDT (Discounted)
                  </span>
                </>
              ) : (
                <span>{product.price} BDT</span> // When no discount is available
              )}
            </p>
          </div>

          <p className="text-gray-700 mb-4">{product.description}</p>

          {/* Shop & Category */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <FaShopify className="text-blue-600" /> Shop: {product.shopName}
            </h4>
            <p className="text-gray-600">Available Quantity: {product.quantity}</p>
            {product.shopPhoneNumber && (
              <p className="text-gray-600 mt-2">
                <strong>Shop Phone:</strong> {product.shopPhoneNumber}
              </p>
            )}
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-800">Sizes Available:</h4>
            <select
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Select Size</option>
              {product.sizes.map((size, index) =>
                size ? <option key={index} value={size}>{size}</option> : null
              )}
            </select>
          </div>

          {/* Seller Info */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800">Seller Information:</h4>
            <div className="flex items-center space-x-3">
              <img
                src={product.seller.image}
                alt={product.seller.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">Name: {product.seller.name}</p>
                <p className="font-semibold">Seller Number: {product.shopPunnumber}</p>
                <p className="text-gray-600 flex items-center gap-2">
                  <MdEmail className="text-red-600" /> {product.seller.email}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons - Order Now & Add to Cart */}
          <div className="mt-4 flex flex-wrap gap-4 justify-between">
            {/* Order Now Button */}
            <button
              disabled={isDisabled || product.quantity === 0}
              onClick={() => setIsModalOpen(true)}
              className={`relative w-full sm:w-1/2 lg:w-1/4 py-3 flex items-center justify-center gap-2 rounded-md text-white font-semibold transition duration-300 ease-in-out 
              ${product.quantity > 0 && !isDisabled ? 'bg-lime-500 hover:bg-lime-600' : 'bg-gray-400 cursor-not-allowed'}
              before:absolute before:inset-0 before:border-2 before:border-lime-500 before:rounded-md before:opacity-0 before:transition-all before:duration-500
              hover:before:opacity-100 hover:before:scale-105`}
            >
              <FaShoppingCart />
              {isDisabled ? 'You Cannot Buy' : product.quantity > 0 ? 'Order Now' : 'Out of Stock'}
            </button>

            {/* Add to Cart Button */}
            <button
              disabled={isDisabled || product.quantity === 0}
              onClick={() => console.log('Added to cart')}
              className={`relative w-full sm:w-1/2 lg:w-1/4 py-3 flex items-center justify-center gap-2 rounded-md text-white font-semibold transition duration-300 ease-in-out 
              ${product.quantity > 0 && !isDisabled ? 'bg-lime-500 hover:bg-lime-600' : 'bg-gray-400 cursor-not-allowed'}
              before:absolute before:inset-0 before:border-2 before:border-lime-500 before:rounded-md before:opacity-0 before:transition-all before:duration-500
              hover:before:opacity-100 hover:before:scale-105`}
            >
              <AiOutlineShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {isModalOpen && (
        <OrderModel
          closeModal={() => setIsModalOpen(false)}
          productName={product.productName}
          price={discountedPrice.toFixed(2)} // Pass the discounted price
          size={selectedSize}
          deliveryPrice={product.deliveryPrice} // Assuming this field is available in the response
          bkashNumber={product.bkashNumber} // Assuming this field is available in the response
          nogodNumber={product.nogodNumber} // Assuming this field is available in the response
          quantity={product.quantity}
          _id={product._id} // Passing _id to OrderModel
          seller={product.seller} // Pass the entire seller object to the modal
        />
      )}
    </div>
  );
};

export default CardDetails;
