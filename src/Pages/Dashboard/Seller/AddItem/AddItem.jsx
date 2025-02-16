import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { imageUpload } from "../../../../Api/utils";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from 'sweetalert2';

const AddItem = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate(); // Initialize navigate
  const [isLoading, setIsLoading] = useState(false);  // Add local loading state

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading to true when the form is submitted
    const form = event.target;

    const productName = form.productName.value;
    const image = form.image.files[0]; // Handle file input
    const shopName = form.shopName.value;
    const description = form.description.value;
    const quantity = parseInt(form.quantity.value, 10); // <-- Converting quantity to number
    const price = parseFloat(form.price.value);         // <-- Converting price to number (float)
    const discountPercentage = parseFloat(form.discountPercentage.value); // Discount Percentage
    const category = form.category.value; // Category is now selected from a dropdown
    const bkashNumber = form.bkashNumber.value;
    const nogodNumber = form.nogodNumber.value;
    const shopPunnumber = form.shopPunnumber.value;  // Shop Punnumber Field
    const sizes = Array.from({ length: 7 }, (_, index) => form[`size${index + 1}`].value);
    const deliveryPrice = parseFloat(form.deliveryPrice.value); // <-- Converting deliveryPrice to number

    // Calculate the discounted price
    const discountAmount = (price * discountPercentage) / 100;
    const discountedPrice = price - discountAmount;

    try {
      // Image upload handling
      const imageUrl = await imageUpload(image);

      // Seller information
      const seller = {
        name: user?.displayName,
        image: user?.photoURL,
        email: user?.email,
      };

      // Product data (with numeric values)
      const productData = {
        productName,
        image: imageUrl,  // Upload image URL instead of image file
        shopName,
        description,
        quantity,        // This is now a number
        price,           // This is now a number
        discountedPrice, // This is the new discounted price
        category,
        bkashNumber,
        nogodNumber,
        shopPunnumber,   // New field added
        sizes,
        seller,
        deliveryPrice,   // This is now a number
        discountPercentage, // The discount percentage is included
      };

      // Post product data to the backend
      await axiosSecure.post('/products', productData);

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Product added successfully!',
        icon: 'success',
        confirmButtonText: 'Cool'
      });
      navigate('/dashboard/my-inventory');

      // Optionally reset the form
      form.reset();

    } catch (error) {
      // Show error message
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
      console.error("Error adding product", error);
    } finally {
      setIsLoading(false); // Set loading to false when the process is finished
    }
  };

  return (
    <div className="flex justify-center items-center h-auto bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Add New Product</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Product Name Field */}
          <div>
            <label htmlFor="productName" className="block text-sm font-semibold text-gray-700">Product Name</label>
            <input
              type="text"
              id="productName"
              name="productName"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Name"
              required
            />
          </div>

          {/* Product Image Field */}
          <div>
            <label htmlFor="productImage" className="block text-sm font-semibold text-gray-700">Product Image</label>
            <input
              type="file"
              id="productImage"
              name="image"
              accept="image/*"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Shop Name Field */}
          <div>
            <label htmlFor="shopName" className="block text-sm font-semibold text-gray-700">Shop Name</label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Shop Name"
              required
            />
          </div>

          {/* Description Field */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Description"
              required
            />
          </div>

          {/* Quantity Field */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Quantity"
              required
            />
          </div>

          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Price"
              required
            />
          </div>

          {/* Discount Percentage Field */}
          <div>
            <label htmlFor="discountPercentage" className="block text-sm font-semibold text-gray-700">Discount Percentage (%)</label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Discount Percentage"
            />
          </div>

          {/* Delivery Price Field */}
          <div>
            <label htmlFor="deliveryPrice" className="block text-sm font-semibold text-gray-700">Delivery Price</label>
            <input
              type="text"
              id="deliveryPrice"
              name="deliveryPrice"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Delivery Price"
              required
            />
          </div>

          {/* Category Field as Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="clothing">Clothing</option>
              <option value="food">Food</option>
              <option value="gadget">Gadget</option>
              <option value="free-delivery">Free Delivery</option>
              <option value="discount">Discount</option>
            </select>
          </div>

          {/* Bkash Number Field */}
          <div>
            <label htmlFor="bkashNumber" className="block text-sm font-semibold text-gray-700">Bkash Number</label>
            <input
              type="text"
              id="bkashNumber"
              name="bkashNumber"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Bkash Number"
              required
            />
          </div>

          {/* Nogod Number Field */}
          <div>
            <label htmlFor="nogodNumber" className="block text-sm font-semibold text-gray-700">Nogod Number</label>
            <input
              type="text"
              id="nogodNumber"
              name="nogodNumber"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Nogod Number"
              required
            />
          </div>

          {/* Shop Punnumber Field */}
          <div>
            <label htmlFor="shopPunnumber" className="block text-sm font-semibold text-gray-700">Shop Punnumber</label>
            <input
              type="text"
              id="shopPunnumber"
              name="shopPunnumber"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Shop Punnumber"
              required
            />
          </div>

          {/* Size Fields */}
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index}>
              <label htmlFor={`size${index + 1}`} className="block text-sm font-semibold text-gray-700">
                Size {index + 1} (Optional)
              </label>
              <input
                type="text"
                id={`size${index + 1}`}
                name={`size${index + 1}`}
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter size ${index + 1}`}
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center col-span-1 sm:col-span-2 md:col-span-3 mt-6">
            <button
              type="submit"
              className="w-full sm:w-full bg-lime-500 text-white p-3 rounded-md hover:bg-lime-800-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-ring loading-md"></span>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
