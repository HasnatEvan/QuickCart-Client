import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

Modal.setAppElement("#root"); // Avoid accessibility issues

const ManageUserRow = ({ user, refetch }) => {
    const { name, email, role, status } = user || {};
    const axiosSecure = useAxiosSecure();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(role);

    // স্ট্যাটাস অনুযায়ী রঙ নির্ধারণের ফাংশন
    const getStatusColor = (status) => {
        if (status === "Requested") return "text-yellow-500";
        if (status === "Verified") return "text-green-500";
        return "text-red-500"; // Default to red if no match
    };

    const handleUpdate = async () => {
        try {
            // Send patch request with the selected role
            await axiosSecure.patch(`/users/role/${email}`, { role: selectedRole });
    
            // Show success alert
            Swal.fire({
                title: "Success!",
                text: `User role updated to ${selectedRole}.`,
                icon: "success",
                confirmButtonText: "OK",
            });
    
            // Refetch user data to reflect the changes
            refetch();
    
            // Close the modal after successful update
            setModalIsOpen(false);
        } catch (error) {
            // Show error alert
            Swal.fire({
                title: "Error!",
                text: error.response?.data || "Failed to update role.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };
    

    return (
        <>
            <tr className="border-b hover:bg-gray-50">
                <td className="p-3">{name}</td>
                <td className="p-3">{email}</td>
                <td className="p-3">{role}</td>
                <td className={`p-3 ${getStatusColor(status)}`}>
                    {status || "Unavailable"}
                </td>

                <td className="p-3">
                    <button
                        onClick={() => setModalIsOpen(true)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                        Update Role
                    </button>
                </td>
            </tr>

            {/* Role Update Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl mb-4">Update User Role</h2>
                <select
                    className="w-full p-2 border rounded mb-4"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                </select>
                <div className="flex justify-end space-x-3">
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        onClick={() => setModalIsOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Update
                    </button>
                </div>
            </Modal>
        </>
    );
};

// **PropTypes Validation**
ManageUserRow.propTypes = {
    user: PropTypes.object.isRequired,
    refetch: PropTypes.func.isRequired,
};

export default ManageUserRow;
