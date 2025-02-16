import { imageUpload } from "../../../../Api/utils";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useState } from "react";
import Swal from 'sweetalert2';
import { AiOutlineShop } from 'react-icons/ai';

const BecomeSeller = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const phone = formData.get("phone");
    if (phone.length !== 11) {
      setPhoneError("Phone number must be exactly 11 digits");
      return;
    } else {
      setPhoneError("");
    }

    const sellerInfo = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone,
      shopName: formData.get("shopName"),
    };

    try {
      setLoading(true);

      sellerInfo.nidFront = await imageUpload(formData.get("nidFront"));
      sellerInfo.nidBack = await imageUpload(formData.get("nidBack"));
      sellerInfo.photo = await imageUpload(formData.get("photo"));

      await axiosSecure.post(`/sellers/${sellerInfo.email}`, sellerInfo);
      Swal.fire("Success!", "Seller information submitted successfully!", "success");

      await axiosSecure.patch(`users/${user?.email}`);
      Swal.fire("Success!", "Successfully applied to become a seller!", "success");

      form.reset();
    } catch (error) {
      console.error("Error submitting seller info:", error);
      Swal.fire("Error!", "You have already requested, wait for some time", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 rounded-lg shadow-lg bg-white border border-lime-500">
      <h2 className="text-2xl mb-6 text-center font-semibold text-lime-600">
        Become a Seller <AiOutlineShop className="inline-block text-lime-500 ml-2" />
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {["name", "email", "phone", "shopName"].map((field, i) => (
          <div key={i}>
            <label className="block mb-1 capitalize text-lime-600" htmlFor={field}>
              {field === "shopName" ? "Shop Name" : field}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              id={field}
              name={field}
              defaultValue={field === "name" ? user?.displayName : field === "email" ? user?.email : ""}
              className="w-full p-3 border border-lime-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              required
            />
            {field === "phone" && phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>
        ))}

        {["nidFront", "nidBack", "photo"].map((field, i) => (
          <div key={i}>
            <label className="block mb-1 capitalize text-lime-600" htmlFor={field}>
              Upload {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="file"
              id={field}
              name={field}
              accept="image/*"
              className="w-full p-3 border border-lime-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              required
            />
          </div>
        ))}

        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 bg-lime-500 text-white rounded-lg font-semibold hover:bg-lime-600 transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Send Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BecomeSeller;
