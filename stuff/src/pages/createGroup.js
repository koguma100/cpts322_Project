import "../app/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { supabase } from "../utils/supabase";
import Image from "next/image";

export default function CreateGroup() {
    const [formData, setFormData] = useState({
        name: "",
        image: null,
        description: "",
        sport: "",
        location: "",
    });
    const [image, setImage] = useState(null);
    const [sportsOptions, setSportsOptions] = useState([]);
    const [user, setUser] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const fetchSports = async () => {
            const { data, error } = await supabase.from("sport").select("name");
            if (data) {
                setSportsOptions(data.map((sport) => sport.name));
                console.log("Sports retrieved: ", data);
            } else {
                console.error("Error fetching sports:", error);
            }
        };

        const checkUser = async () => {
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                // Safely check for error before accessing message
                console.error("Error fetching user:", error?.message);
                router.push("/login");
            } else if (!data?.session?.user) {
                router.push("/login"); // If no user in session, redirect to login
            } else {
                setUser(data.session.user); // The user object is in data.session.user
            }

        };

        checkUser();
        fetchSports();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                setImage(event.target.result); // Set the uploaded image as base64
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // first add image to storage if used
        if (formData.image) {
            const { data, error } = await supabase.storage
                .from('group-images') // Bucket name
                .upload(`group-${Date.now()}-${formData.image.name}`, formData.image);

            if (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image.');
                return;
            }
        }
    };

    return (
        <div className="">
            <Image
                src="/Images/LEBRON.jpg"
                alt="Background"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-[-1]"
            />

            <form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto p-6 bg-gray-900 bg-opacity-75 text-white rounded-lg shadow-lg border-2 border-gray-600 mt-8"
            >
                <h2 className="text-4xl font-bold mb-6 text-red-700 text-center">
                    Create Group
                </h2>

                {/* Group Name */}
                <label className="block mb-2">
                    Group Name
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                </label>

                {/* Group Image */}
                <div className="flex justify-between items-center mb-4 space-x-4">
                    <div className="flex-grow">
                        <label className="block mb-2">
                            Group Image
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none"
                            />
                        </label>
                    </div>

                    {/* Circle Placeholder or Image */}
                    <div className="flex-shrink-0 mt-4">
                        {image ? (
                            <img
                                src={image}
                                alt="Group"
                                className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-400">
                                {/* You can add a placeholder icon or text here */}
                                <span>No Image</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <label className="block mb-2">
                    Description
                    <textarea
                        name="description"
                        maxLength="300"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                    {/* Character limit */}
                    <div className="text-right text-sm text-gray-600">
                        {formData.description.length}/300 characters
                    </div>
                </label>

                {/* Sport */}
                <label className="block mb-2">
                    Sport
                    <select
                        name="sport"
                        value={formData.sport}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                    >
                        <option value="">Select a sport</option>
                        {sportsOptions.map((sport) => (
                            <option key={sport} value={sport} className="bg-gray-700 text-white">
                                {sport}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Location */}
                <label className="block mb-4">
                    Location
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                </label>

                <div className="flex justify-between items-center mb-4 space-x-4">
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded transition"
                    >
                        Create Group
                    </button>
                    {/* Cancel Button */}
                    <button
                        onClick={() => router.push("/home")}
                        className="w-full bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded transition"
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </div>

    );
}
