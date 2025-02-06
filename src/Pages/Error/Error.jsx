import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Error = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6 md:px-10 lg:px-20">
            <motion.img
                src="https://i.ibb.co/qM4mSbG/404-error.png"
                alt="404 Error"
                className="w-64 sm:w-80 md:w-96 lg:w-[450px] mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            />
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-red-500"
            >
                Oops! Page Not Found
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-gray-600 mt-2 max-w-xl"
            >
                The page you are looking for might have been removed or is temporarily unavailable.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Link to="/">
                    <button className="mt-6 px-5 sm:px-6 py-2 sm:py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-300 text-sm sm:text-base md:text-lg">
                        Go Back to Home
                    </button>
                </Link>
            </motion.div>
        </div>
    );
};

export default Error;
