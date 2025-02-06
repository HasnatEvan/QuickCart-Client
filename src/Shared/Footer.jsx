import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                {/* Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                    
                    {/* Brand Info */}
                    <div>
                        <h2 className="text-2xl font-bold">QuickCart</h2>
                        <p className="text-gray-400 mt-2">
                            The best place to shop your favorite products.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold">Quick Links</h3>
                        <ul className="mt-2 space-y-2">
                            <li><a href="/" className="hover:text-blue-400">Home</a></li>
                            <li><a href="/products" className="hover:text-blue-400">Products</a></li>
                            <li><a href="/dashboard" className="hover:text-blue-400">Dashboard</a></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-xl font-semibold">Follow Us</h3>
                        <div className="flex justify-center md:justify-start space-x-4 mt-3">
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
                <div className="text-center text-gray-400 mt-8 border-t border-gray-700 pt-4">
                    <p>&copy; {new Date().getFullYear()} QuickCart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
