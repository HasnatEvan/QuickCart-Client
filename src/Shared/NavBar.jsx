import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io"; // Import the IoIosArrowDown icon
import { motion } from "framer-motion"; // Import Framer Motion
import useAuth from "../Hooks/useAuth";
import Swal from "sweetalert2";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { user, logOut } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                logOut()
                    .then(() => {
                        Swal.fire("Logged Out!", "You have been successfully logged out.", "success");
                    })
                    .catch((error) => {
                        Swal.fire("Error!", error.message, "error");
                    });
            }
        });
    };

    return (
        <>
            <nav className="shadow-md fixed top-0 left-0 w-full z-50 bg-lime-500">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Animated Logo */}
                    <motion.div
                        animate={{ y: [-10, 10, -10] }} // Moves up and down
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} // Super slow motion
                        whileHover={{ scale: 1.1 }} // Slight hover effect
                    >
                        <NavLink to="/" className="text-2xl font-bold text-white">
                            QuickCart-BD
                        </NavLink>
                    </motion.div>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex space-x-6 text-lg">
                        <li>
                            <NavLink to="/" className={({ isActive }) => (isActive ? "text-white font-semibold" : "text-gray-700")}>
                                Home
                            </NavLink>
                        </li>

                        {/* Dropdown Menu */}
                        <li className="relative" ref={menuRef}>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white flex items-center space-x-2">
                                <span>Menu</span>
                                <IoIosArrowDown /> {/* React Icon added here */}
                            </button>
                            {isMenuOpen && (
                                <motion.ul
                                    className="absolute left-0 bg-white shadow-md rounded-lg py-2 w-40 mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <li>
                                        <NavLink
                                            to="/products"
                                            className={({ isActive }) =>
                                                isActive ? "block px-4 py-2 text-gray-700 font-semibold" : "block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            }
                                        >
                                            All Products
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard"
                                            className={({ isActive }) =>
                                                isActive ? "block px-4 py-2 text-white font-semibold" : "block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            }
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                </motion.ul>
                            )}
                        </li>

                        {/* Auth Section */}
                        {user ? (
                            <li className="flex items-center space-x-3">
                                <button onClick={handleLogout} className="text-white hover:text-black">
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) => (isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition")}
                                >
                                    Login
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 focus:outline-none">
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white py-3 shadow-md">
                        <ul className="flex flex-col items-center space-y-3 text-lg">
                            <li>
                                <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => (isActive ? "text-black font-semibold" : "text-gray-700 hover:text-blue-600 transition")}>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/products" onClick={() => setIsOpen(false)} className={({ isActive }) => (isActive ? "text-gray-700 font-semibold" : "text-gray-700 hover:text-blue-600 transition")}>
                                    All Products
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={({ isActive }) => (isActive ? "text-white font-semibold" : "text-gray-700 hover:text-blue-600 transition")}>
                                    Dashboard
                                </NavLink>
                            </li>
                            {/* Auth Section in Mobile Menu */}
                            {user ? (
                                <li className="flex flex-col items-center space-y-2">
                                    <button onClick={handleLogout} className="text-black hover:text-red-700">
                                        Logout
                                    </button>
                                </li>
                            ) : (
                                <li>
                                    <NavLink to="/login" onClick={() => setIsOpen(false)} className={({ isActive }) => (isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition")}>
                                        Login
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </nav>

            {/* Extra padding so content doesn't get hidden behind navbar */}
            <div className="pt-16"></div>
        </>
    );
};

export default NavBar;
