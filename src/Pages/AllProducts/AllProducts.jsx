import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Card from "./Card";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from '../../../src/assets/logo.png';

const AllProducts = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Combined search state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState(""); // Default to no selection

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

  // Filter products based on search query
  const filteredProducts = Products.filter((product) =>
    product.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter((product) =>
    selectedCategory === "" || product.category === selectedCategory
  );

  // Sort products based on price (either low to high or high to low)
  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (sortOption) {
      case "priceAsc":
        return a.price - b.price; // Low to high price sorting
      case "priceDesc":
        return b.price - a.price; // High to low price sorting
      default:
        return 0; // No sorting applied by default
    }
  });

  const categories = [...new Set(Products.map((product) => product.category))];

  return (
    <div className="flex font-primary">
      {/* Sidebar (Fixed for Desktop) */}
      <div className="hidden md:block w-64 bg-gray-100 p-4 min-h-screen sticky top-0">
        <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded shadow-md sticky top-0 z-10">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h2 className="text-xl font-semibold">Categories</h2>
        </div>

        <ul className="mt-2 space-y-2">
          <li
            className={`cursor-pointer p-2 rounded font-medium ${selectedCategory === "" ? "bg-lime-500 text-white" : "bg-white"
              }`}
            onClick={() => setSelectedCategory("")}
          >
            All Products
          </li>
          {categories.map((category, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 rounded font-medium ${selectedCategory === category ? "bg-lime-500 text-white" : "bg-white"
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
        <div className="fixed top-0 left-0 w-64 h-full bg-gray-100 p-4 z-50">
          <button
            className="absolute top-4 right-4 text-red-500 text-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes />
          </button>

          <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded shadow-md">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <h2 className="text-xl font-semibold">Categories</h2>
          </div>

          <ul className="mt-2 space-y-2">
            <li
              className={`cursor-pointer p-2 rounded font-medium ${selectedCategory === "" ? "bg-blue-500 text-white" : "bg-white"
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
                className={`cursor-pointer p-2 rounded font-medium ${selectedCategory === category ? "bg-blue-500 text-white" : "bg-white"
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

      {/* Main Content (Scrollable) */}
      <div className="flex-1 md:mt-0 overflow-auto max-h-screen -mt-2">
        {/* Search and Sort Section (Fixed) */}
        <div className="sticky top-0 z-20 bg-white shadow-md mb-6 flex flex-col md:flex-row gap-4 justify-between items-center py-4">
          {/* "All Products" Title */}
          <div className="text-2xl mb-4 md:mb-0 md:text-left text-center w-full md:w-auto lg:ml-10 ">
            All Products
          </div>

          <div className="flex flex-wrap gap-4 justify-between items-center w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Now"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 rounded w-full sm:w-80 md:w-72"
            />

            {/* Sort By Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border p-2 rounded w-full sm:w-48 md:w-48"
            >
              <option value="">Select Sort Option</option>
              <option value="priceAsc">Sort by Price (Low to High)</option>
              <option value="priceDesc">Sort by Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Products Grid (Scrollable) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <Card key={product._id} product={product} />
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
