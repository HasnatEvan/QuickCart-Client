import { Link, useNavigate, useLocation } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import useAuth from '../Hooks/useAuth';
import { imageUpload } from '../Api/utils';
import Swal from 'sweetalert2';
import axios from 'axios';
import signup from '../../src/assets/SignUp.json';
import Lottie from 'react-lottie';
import { useState } from 'react';

const Signup = () => {
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [loading, setLoading] = useState(false); // Loading State

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Sign Up ক্লিক করলেই লোডিং শুরু

    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const image = form.image.files[0];

    try {
      const photoUrl = await imageUpload(image);
      console.log("Uploaded photo URL:", photoUrl);

      const userData = { name, email, photoUrl };
      await axios.post(`http://localhost:5000/users/${email}`, userData);

      const userCredential = await createUser(email, password);
      await updateUserProfile(name, photoUrl);

      await userCredential.user.reload();

      Swal.fire({
        icon: 'warning',
        title: 'Verify Your Email',
        text: 'A verification email has been sent to your inbox. Please verify before logging in.',
      });

      form.reset();
      setLoading(false); // ফর্ম রিসেট হলে লোডিং বন্ধ

      const checkVerification = setInterval(async () => {
        await userCredential.user.reload();
        if (userCredential.user.emailVerified) {
          clearInterval(checkVerification);
          Swal.fire({
            icon: 'success',
            title: 'Email Verified!',
            text: 'Redirecting you to the home page...',
          });
          navigate(from, { replace: true });
        }
      }, 3000);

    } catch (error) {
      console.error("Sign Up Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Sign Up Failed',
        text: error.message || 'There was an error creating your account.',
      });
      setLoading(false); // Error হলে লোডিং বন্ধ
    }
  };

  const options = {
    loop: true,
    autoplay: true,
    animationData: signup,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen bg-gray-50 py-12 px-4 md:px-0">
      <div className="w-full md:w-1/2 flex justify-center items-center mb-6 md:mb-0">
        <Lottie options={options} height={window.innerWidth < 768 ? 200 : 300} width={window.innerWidth < 768 ? 200 : 300} />
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
            <input type="text" id="name" name="name" className="w-full p-2 mt-1 border border-gray-300 rounded-md" placeholder="Enter your name" required />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
            <input type="email" id="email" name="email" className="w-full p-2 mt-1 border border-gray-300 rounded-md" placeholder="Enter your email" required />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
            <input type="password" id="password" name="password" className="w-full p-2 mt-1 border border-gray-300 rounded-md" placeholder="Enter your password" required />
          </div>

          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-semibold text-gray-700">Profile Photo</label>
            <input required type="file" id="photo" name="image" accept="image/*" className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md mt-4 flex justify-center items-center" disabled={loading}>
            {loading ? <span className="loading loading-ring loading-lg"></span> : 'Sign Up'}
          </button>

          <div className="flex justify-center mt-2">
            <GoogleLogin />
          </div>
        </form>

        <div className="mt-4 text-center">
          <p>Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
