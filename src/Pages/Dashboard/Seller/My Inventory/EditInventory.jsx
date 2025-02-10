
import { useNavigate, useParams } from "react-router-dom";
import { imageUpload } from "../../../../Api/utils";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";

const EditInventory = () => {
  const { user} = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams(); // To get the product ID from URL

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data } = await axiosSecure.get(`/product/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product data", error);
      }
    };

    fetchProductData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const productName = form.productName.value;
    const image = form.image.files[0]; 
    const shopName = form.shopName.value;
    const description = form.description.value;
    const quantity = parseInt(form.quantity.value, 10);
    const price = parseFloat(form.price.value);
    const discountPercentage = parseFloat(form.discountPercentage.value);
    const category = form.category.value;
    const bkashNumber = form.bkashNumber.value;
    const nogodNumber = form.nogodNumber.value;
    const shopPunnumber = form.shopPunnumber.value;
    const sizes = Array.from({ length: 7 }, (_, index) => form[`size${index + 1}`].value);
    const deliveryPrice = parseFloat(form.deliveryPrice.value);

    const discountAmount = (price * discountPercentage) / 100;
    const discountedPrice = price - discountAmount;

    try {
      const imageUrl = image ? await imageUpload(image) : product.image;

      const productData = {
        productName,
        image: imageUrl,
        shopName,
        description,
        quantity,
        price,
        discountedPrice,
        category,
        bkashNumber,
        nogodNumber,
        shopPunnumber,
        sizes,
        seller: {
          name: user?.displayName,
          image: user?.photoURL,
          email: user?.email,
        },
        deliveryPrice,
        discountPercentage,
      };

      await axiosSecure.put(`/products/${id}`, productData);

      Swal.fire({
        title: 'Success!',
        text: 'Product updated successfully!',
        icon: 'success',
        confirmButtonText: 'Cool'
      });

      navigate('/dashboard/my-inventory');
      form.reset();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
      console.error("Error updating product", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-auto bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit Product</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Product Name Field */}
          <div>
            <label htmlFor="productName" className="block text-sm font-semibold text-gray-700">Product Name</label>
            <input
              type="text"
              id="productName"
              name="productName"
              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              defaultValue={product.productName}
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
              defaultValue={product.shopName}
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
              defaultValue={product.description}
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
              defaultValue={product.quantity}
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
              defaultValue={product.price}
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
              defaultValue={product.discountPercentage}
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
              defaultValue={product.deliveryPrice}
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
              defaultValue={product.category}
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
              defaultValue={product.bkashNumber}
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
              defaultValue={product.nogodNumber}
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
              defaultValue={product.shopPunnumber}
              required
            />
          </div>

          {/* Size Fields */}
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index}>
              <label htmlFor={`size${index + 1}`} className="block text-sm font-semibold text-gray-700">Size {index + 1}</label>
              <input
                type="text"
                id={`size${index + 1}`}
                name={`size${index + 1}`}
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                defaultValue={product.sizes[index] || ''}
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center">
            <button type="submit" className="w-full bg-blue-500 text-white p-4 mt-4 rounded-md hover:bg-blue-600">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInventory;
