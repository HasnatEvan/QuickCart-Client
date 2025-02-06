import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../Hooks/useAuth";
import Swal from "sweetalert2"; // Import SweetAlert2

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { user, logOut } = useAuth();

    // Click outside to close menu
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

    // Handle Logout with SweetAlert2
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
                logOut().then(() => {
                    Swal.fire("Logged Out!", "You have been successfully logged out.", "success");
                }).catch(error => {
                    Swal.fire("Error!", error.message, "error");
                });
            }
        });
    };

    return (
        <>
            <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <NavLink to="/" className="text-2xl font-bold text-blue-600">
                        QuickCart
                    </NavLink>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex space-x-6 text-lg">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition"
                                }
                            >
                                Home
                            </NavLink>
                        </li>

                        {/* Dropdown Menu */}
                        <li className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:text-blue-600 transition"
                            >
                                Menu
                            </button>

                            {isMenuOpen && (
                                <ul className="absolute left-0 bg-white shadow-md rounded-lg py-2 w-40 mt-2">
                                    <li>
                                        <NavLink
                                            to="/products"
                                            className={({ isActive }) =>
                                                isActive ? "block px-4 py-2 text-blue-600 font-semibold" : "block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            }
                                        >
                                            All Products
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard"
                                            className={({ isActive }) =>
                                                isActive ? "block px-4 py-2 text-blue-600 font-semibold" : "block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            }
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Auth Section */}
                        {user ? (
                            <li className="flex items-center space-x-3">
                                {/* User Profile */}
                               
                                <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition"
                                    }
                                >
                                    Login
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-700 focus:outline-none"
                    >
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white py-3 shadow-md">
                        <ul className="flex flex-col items-center space-y-3 text-lg">
                            <li>
                                <NavLink
                                    to="/"
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition"
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/products"
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition"
                                    }
                                >
                                    All Products
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition"
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            {/* Auth Section in Mobile Menu */}
                            {user ? (
                                <li className="flex flex-col items-center space-y-2">
                                    <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                                        Logout
                                    </button>
                                </li>
                            ) : (
                                <li>
                                    <NavLink
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) =>
                                            isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition"
                                        }
                                    >
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
