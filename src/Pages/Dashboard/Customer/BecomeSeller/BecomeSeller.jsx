import { imageUpload } from "../../../../Api/utils";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useState } from "react";
import Swal from 'sweetalert2';

const BecomeSeller = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const sellerInfo = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    try {
      setLoading(true);

      // ছবি আপলোড করুন
      sellerInfo.nidFront = await imageUpload(formData.get("nidFront"));
      sellerInfo.nidBack = await imageUpload(formData.get("nidBack"));
      sellerInfo.photo = await imageUpload(formData.get("photo"));

      // ব্যাকএন্ডে পাঠানো
      await axiosSecure.post(`/sellers/${sellerInfo.email}`, sellerInfo);

      Swal.fire("Success!", "Seller information submitted successfully!", "success");

      // ইউজার স্ট্যাটাস আপডেট
      await axiosSecure.patch(`users/${user?.email}`);

      Swal.fire("Success!", "Successfully applied to become a seller!", "success");

      form.reset(); // ফর্ম রিসেট করা
    } catch (error) {
      console.error("Error submitting seller info:", error); // এভাবে ব্যবহার করুন
      Swal.fire("Error!", "You have already requested, wait for some time", "error");
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded shadow-lg">
      <h2 className="text-2xl mb-4 text-center">Become a Seller</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      {["name", "email", "phone"].map((field, i) => (
  <div key={i}>
    <label className="block mb-1 capitalize" htmlFor={field}>{field}</label>
    <input
      type={field === "email" ? "email" : "text"}
      id={field}
      name={field}
      defaultValue={
        field === "name" ? user?.displayName : field === "email" ? user?.email : ""
      }
      className="w-full p-2 border rounded"
      required
    />
  </div>
))}


        {["nidFront", "nidBack", "photo"].map((field, i) => (
          <div key={i}>
            <label className="block mb-1 capitalize" htmlFor={field}>Upload {field.replace(/([A-Z])/g, " $1")}</label>
            <input type="file" id={field} name={field} accept="image/*" className="w-full p-2 border rounded" required />
          </div>
        ))}

        <div className="text-center">
          <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-700" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-md"></span> : "Send Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BecomeSeller;
