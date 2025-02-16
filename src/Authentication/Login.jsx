import { Link, useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import useAuth from '../Hooks/useAuth';
import Swal from 'sweetalert2'; // Import SweetAlert2
import login from '../../src/assets/Login.json'; // Lottie file
import Lottie from 'react-lottie'; // Import Lottie component

const Login = () => {
    const { signIn, loading } = useAuth(); // Get loading state
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            await signIn(email, password);
            Swal.fire({
                title: "Success!",
                text: "Login successful!",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate('/'); // Redirect after closing alert
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    // Lottie animation options
    const options = {
        loop: true,
        autoplay: true,
        animationData: login, // Path to your Lottie JSON file
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-center h-screen bg-gray-50 py-12 px-4 md:px-0">
            {/* Lottie Animation (মোবাইলে উপরে, বড় স্ক্রিনে পাশে) */}
            <div className="w-full md:w-1/2 flex justify-center items-center order-first md:order-none">
                <Lottie options={options} height={250} width={250} />
            </div>

            {/* Form Section */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center md:w-96">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

                <form onSubmit={handleSubmit} className="w-full">
                    {/* Email Field */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            placeholder="Enter your password"
                            required
                        />
                        {/* Forgot Password Link */}
                        <div className="mt-4">
                            <a href="#" className="text-blue-500">Forgot Password?</a>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md mt-4 flex justify-center items-center"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            <span className="loading loading-ball loading-lg"></span> // Spinner
                        ) : (
                            "Login" // Button text when not loading
                        )}
                    </button>

                    <div className="flex justify-center mt-2">
                        {/* Google Login Button */}
                        <GoogleLogin />
                    </div>
                </form>

                {/* Sign Up Link */}
                <div className="mt-4 text-center">
                    <p>
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="text-blue-500">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
