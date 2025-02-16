import Banner from "./Banner";
import DiscountItem from "./DiscountItem";
import FreeDeliveryItem from "./FreeDeliveryItem";
import Review from "./Review";

const Home = () => {
    return (
        <div className="font-primary">
           <Banner></Banner>
           <DiscountItem></DiscountItem>
           <FreeDeliveryItem></FreeDeliveryItem>
           <Review></Review>
        </div>
    );
};

export default Home;