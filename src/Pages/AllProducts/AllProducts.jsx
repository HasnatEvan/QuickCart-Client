import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Card from "./Card";

const AllProducts = () => {
  const { data: Products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/products"); // Correct endpoint
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    ); // Display loading spinner at the center
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6 px-4 py-6">
      {Products.map((product) => (
        <Card key={product.id} product={product} /> // Pass product data to Card component
      ))}
    </div>
  );
};

export default AllProducts;
