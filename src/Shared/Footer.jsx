import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-lime-500 text-white py-8">
            <div className="container mx-auto px-4">
                {/* Responsive Footer Grid */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
                    
                    {/* Brand Info */}
                    <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
                        <h2 className="text-2xl font-bold">QuickCart</h2>
                        <p className="text-gray-200 mt-2 text-sm md:text-base">
                            The best place to shop your favorite products.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="w-full md:w-1/3 flex flex-col items-center lg:ml-64 md:items-start">
                        <h3 className="text-xl font-semibold">Quick Links</h3>
                        <ul className="mt-2 space-y-2">
                            <li><a href="/" className="hover:text-gray-200 text-sm md:text-base">Home</a></li>
                            <li><a href="/products" className="hover:text-gray-200 text-sm md:text-base">Products</a></li>
                            <li><a href="/dashboard" className="hover:text-gray-200 text-sm md:text-base">Dashboard</a></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="w-full md:w-1/3 flex flex-col items-center lg:ml-52 md:items-start">
                        <h3 className="text-xl font-semibold">Follow Us</h3>
                        <div className="flex justify-center md:justify-start space-x-6 mt-3">
                            <a href="#" className="text-blue-500 hover:text-blue-400">
                                <FaFacebook size={24} />
                            </a>
                            <a href="#" className="text-blue-400 hover:text-blue-300">
                                <FaTwitter size={24} />
                            </a>
                            <a href="#" className="text-pink-500 hover:text-pink-400">
                                <FaInstagram size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="text-center text-gray-200 mt-8 border-t border-gray-400 pt-4">
                    <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} QuickCart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
