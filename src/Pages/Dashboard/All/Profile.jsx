import { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import { imageUpload } from "../../../Api/utils";

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const [role] = useRole();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState(user?.displayName || "");
    const [newPhoto, setNewPhoto] = useState(user?.photoURL || "");
    const [isUploading, setIsUploading] = useState(false);

    // Check if user logged in using Google
    const isGoogleUser = user?.providerData?.some(provider => provider.providerId === "google.com");

    // নাম পরিবর্তন হ্যান্ডেল
    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    // ছবি আপলোড হ্যান্ডেল
    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            try {
                const photoUrl = await imageUpload(file);
                setNewPhoto(photoUrl);
            } catch (error) {
                console.error("Image upload failed:", error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    // ইউজার প্রোফাইল আপডেট
    const handleSaveChanges = async () => {
        try {
            if (newName !== user?.displayName || newPhoto !== user?.photoURL) {
                await updateUserProfile(newName, newPhoto);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Profile update failed:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
            {/* কভার ফটো */}
            <div className="relative">
                <img 
                    src={user?.coverPhoto || "https://i.ibb.co/jPjZBt7F/Black-Yellow-Bold-Bag-Fashion-Sale-Banner.png"} 
                    alt="Cover" 
                    className="w-full h-auto object-contain bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400"
                />
                {/* প্রোফাইল ছবি */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 w-32 h-32 border-4 border-white rounded-full overflow-hidden shadow-xl">
                    <img 
                        src={newPhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* প্রোফাইল তথ্য */}
            <div className="text-center pt-16 pb-6 px-6 space-y-4">
                <h1 className="text-2xl font-semibold text-gray-800">{newName || "No name available"}</h1>
                <p className="text-gray-600">{user?.email || "No email available"}</p>
                <p className="text-lime-600 font-medium mt-2 uppercase">{role || "No role assigned"}</p>
            </div>

            {/* ওয়েবসাইট নাম */}
            <div className="text-center mt-4 pb-6">
                <p className="text-lg text-gray-500 font-semibold">Quickcart-BD</p>
            </div>

            {/* এডিট বাটন (Google ইউজার হলে হাইড থাকবে) */}
            {!isGoogleUser && (
                <div className="text-center mt-4 pb-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-lime-500 text-white p-2 rounded-lg"
                    >
                        Edit Profile
                    </button>
                </div>
            )}

            {/* মডাল */}
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
                            {isUploading && <p className="text-blue-500 text-sm mt-2">Uploading...</p>}
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
                                className="bg-lime-500 text-white p-2 rounded-lg"
                                disabled={isUploading}
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
