import { Link, useNavigate, useLocation } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import useAuth from '../Hooks/useAuth';
import { imageUpload } from '../Api/utils';
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios'; // Import axios if it's not imported yet

const Signup = () => {
  const { createUser, updateUserProfile, loading } = useAuth(); // loading state
  const navigate = useNavigate(); // Create a navigate instance
  const location = useLocation(); // Get the current location

  // Get the "from" path from the state (for redirection)
  const from = location.state?.from?.pathname || '/'; 

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    // Extract values from the form
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const image = form.image.files[0];

    try {
      // Upload the image and get the URL
      const photoUrl = await imageUpload(image);
      console.log("Uploaded photo URL:", photoUrl);

      const userData = {
        name,
        email,
        photoUrl,  // Send image URL from ImgBB
      };
      const response = await axios.post(`http://localhost:5000/users/${email}`, userData);
      console.log("User data sent to the backend:", response.data);

      // Create user and update profile with the uploaded photo URL
      await createUser(email, password);
      await updateUserProfile(name, photoUrl);

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Sign Up Successful',
        text: 'Your account has been created successfully!',
      });

      // Optionally, you can reset the form here
      form.reset();

      // Navigate to the previous location or home page
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Sign Up Error:", error);
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Sign Up Failed',
        text: error.message || 'There was an error creating your account.',
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
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
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-semibold text-gray-700">Profile Photo</label>
            <input
              required
              type="file"
              id="photo"
              name="image"
              accept="image/*"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md mt-4 flex justify-center items-center"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <span className="loading loading-ring loading-lg"></span> // Spinner
            ) : (
              'Sign Up' // Button Text
            )}
          </button>

          <div className="flex justify-center mt-2">
            {/* Google Login Button */}
            <GoogleLogin />
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
