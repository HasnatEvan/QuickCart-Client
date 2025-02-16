import axios from 'axios';
import { useEffect, useState } from 'react';
import FreeDeliveryCard from './FreeDeliveryCard';

const FreeDeliveryItem = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/products")
            .then(response => {
                const allProducts = response.data;
                const freeDeliveryItems = allProducts.filter(item => item.category === "free-delivery");
                setData(freeDeliveryItems);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h2 className="lg:text-4xl text-3xl my-10 font-bold mb-4 text-center">Free Delivery Items</h2>
            <p className="text-lg text-center">
            Explore our collection of items with free delivery! Shop conveniently without any extra delivery charges on these exclusive products.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4">
                {data.map(item => (
                    <FreeDeliveryCard key={item._id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default FreeDeliveryItem;
