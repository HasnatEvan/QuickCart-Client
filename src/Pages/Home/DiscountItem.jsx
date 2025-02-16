import { useEffect, useState } from "react";
import axios from "axios";
import DiscountCard from "./DiscountCard";

const DiscountItem = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/products")
            .then(response => {
                const allProducts = response.data;
                const discountItems = allProducts.filter(item => item.category === "discount");
                setData(discountItems);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h2 className="lg:text-4xl text-3xl my-10 font-bold mb-4 text-center">
                Discount Items
            </h2>
            <p className="text-lg text-center">
                Explore our exclusive discount items with attractive deals on popular brands, carefully selected for the best products at affordable prices.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4">
                {data.map(item => (
                    <DiscountCard key={item._id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default DiscountItem;
