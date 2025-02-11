import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Card from "./Card";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const AllProducts = () => {
  const [searchShop, setSearchShop] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: Products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/products");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  const filteredProducts = Products.filter((product) =>
    product.shopName.toLowerCase().includes(searchShop.toLowerCase()) &&
    product.category.toLowerCase().includes(searchCategory.toLowerCase()) &&
    product.productName.toLowerCase().includes(searchProduct.toLowerCase()) &&
    (selectedCategory === "" || product.category === selectedCategory)
  );

  const categories = [...new Set(Products.map((product) => product.category))];

  return (
    <div className="flex">
      {/* Sidebar (Fixed for Desktop) */}
      <div className="hidden md:block w-64 bg-gray-100 p-4 border-r min-h-screen fixed">
        <h2 className="text-xl font-semibold mb-4 bg-white p-3 rounded shadow-md sticky top-0 z-10">
          Categories
        </h2>
        <ul className="mt-2 space-y-2">
          <li
            className={`cursor-pointer p-2 rounded font-medium ${
              selectedCategory === "" ? "bg-lime-500 text-white" : "bg-white"
            }`}
            onClick={() => setSelectedCategory("")}
          >
            All Products
          </li>
          {categories.map((category, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 rounded font-medium ${
                selectedCategory === category ? "bg-lime-500 text-white" : "bg-white"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="md:hidden p-3 text-lime-500 fixed top-14 left-4 rounded z-50"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars size={22} />
      </button>

      {/* Mobile Sidebar with Close Button */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-gray-100 p-4 border-r z-50">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-red-500 text-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes />
          </button>

          <h2 className="text-xl font-semibold mb-4 bg-white p-3 rounded shadow-md">
            Categories
          </h2>
          <ul className="mt-2 space-y-2">
            <li
              className={`cursor-pointer p-2 rounded font-medium ${
                selectedCategory === "" ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => {
                setSelectedCategory("");
                setIsSidebarOpen(false);
              }}
            >
              All Products
            </li>
            {categories.map((category, index) => (
              <li
                key={index}
                className={`cursor-pointer p-2 rounded font-medium ${
                  selectedCategory === category ? "bg-blue-500 text-white" : "bg-white"
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsSidebarOpen(false);
                }}
              >
                {category.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 mt-12 md:mt-0 md:ml-64">
        {/* Search Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Shop Name"
            value={searchShop}
            onChange={(e) => setSearchShop(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Search by Category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Search by Product Name"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Products Grid (Mobile = 2 Cards, Large Screens = More Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
