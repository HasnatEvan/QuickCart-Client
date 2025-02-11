import { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import { imageUpload } from "../../../Api/utils";

const Profile = () => {
    const { user, updateUserProfile } = useAuth(); // Assuming `updateUserProfile` is a function to update the user info
    const [role] = useRole();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState(user?.displayName || "");
    const [newPhoto, setNewPhoto] = useState(null);

    // Handle name change
    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    // Handle photo change
    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Assuming `imageUpload` is a function that returns the URL of the uploaded image
            const photoUrl = await imageUpload(file);
            setNewPhoto(photoUrl); // Update the state with the new photo URL
        }
    };

    // Save updates to Firebase
    const handleSaveChanges = async () => {
        if (newName !== user?.displayName) {
            // Update name
            await updateUserProfile(newName, newPhoto);
        }
        if (newPhoto) {
            // Update photo URL if a new photo is uploaded
            await updateUserProfile(newName, newPhoto);
        }
        setIsModalOpen(false); // Close modal after saving changes
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Cover Photo */}
            <div className="relative">
                <img 
                    src={user?.coverPhoto || "https://i.ibb.co/VW3nyTnW/top-view-sewing-accesories-with-scissors.jpg"} 
                    alt="Cover" 
                    className="w-full h-40 object-cover bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400"
                />
                {/* Profile Image Positioned at the Bottom Center */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 w-32 h-32 border-4 border-white rounded-full overflow-hidden shadow-xl">
                    <img 
                        src={newPhoto || user?.photoURL || "https://via.placeholder.com/150"} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Profile Details */}
            <div className="text-center pt-16 pb-6 px-6 space-y-4">
                <h1 className="text-2xl font-semibold text-gray-800">{newName || "No name available"}</h1>
                <p className="text-gray-600">{user?.email || "No email available"}</p>
                <p className="text-lime-600 font-medium mt-2 uppercase">{role || "No role assigned"}</p>
            </div>

            {/* Web Name */}
            <div className="text-center mt-4 pb-6">
                <p className="text-lg text-gray-500 font-semibold">Quickcart-BD</p>
            </div>

            {/* Edit Button */}
            <div className="text-center mt-4 pb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white p-2 rounded-lg"
                >
                    Edit Profile
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={handleNameChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Update your name"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Profile Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="block w-full text-sm text-gray-500"
                            />
                        </div>
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 text-gray-700 p-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="bg-blue-500 text-white p-2 rounded-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
