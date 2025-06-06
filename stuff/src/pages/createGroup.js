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
    public: true,
  });
  const [image, setImage] = useState(null);
  const [sportsOptions, setSportsOptions] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching user:", error?.message);
        router.push("/login");
      } else if (!data?.session?.user) {
        router.push("/login");
      } else {
        setUser(data.session.user);
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
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;
    const { name, image, description, sport, location } = formData;

    if (image) {
      const { data, error } = await supabase.storage
        .from('group-images')
        .upload(`group-${Date.now()}-${formData.name}`, image);

      if (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload image.');
        return;
      }

      if (data?.path) {
        const { data: publicData } = supabase.storage
          .from('group-images')
          .getPublicUrl(data.path);
        imageUrl = publicData.publicUrl;
      }
    }

    const { data, error } = await supabase.from("group").insert([
      {
        name: name,
        description: description,
        sport: sport,
        location: location,
        image: imageUrl,
        public: formData.public,
      },
    ]);

    if (error) {
      console.error('Error inserting group data:', error);
      setError('Failed to create group.');
      return;
    }

    const { error: memberError } = await supabase.from('groupMember').insert([
      {
        group: name,
        user_id: user.id,
        isLeader: true,
      },
    ]);

    if (memberError) {
      console.error('Error inserting group member:', memberError);
      setError('Failed to add group member.');
      return;
    }

    console.log('Group created successfully:', data);
    router.push(`/group/${name}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
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
        className="relative z-10 w-full max-w-md p-6 bg-gray-900 bg-opacity-75 text-white rounded-lg shadow-lg border-2 border-gray-600"
      >
        <h2 className="text-3xl font-bold mb-6 text-red-700 text-center">
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

          <div className="flex-shrink-0 mt-4">
            {image ? (
              <img
                src={image}
                alt="Group"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-400">
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

        {/* Group Visibility */}
        <label className="block mb-4">
          Group Visibility
          <select
            name="public"
            value={formData.public ? "true" : "false"}
            onChange={(e) =>
              setFormData({ ...formData, public: e.target.value === "true" })
            }
            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>
        </label>

        <div className="flex justify-between items-center mb-4 space-x-4">
          <button
            type="submit"
            className="w-full bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded transition"
          >
            Create Group
          </button>
          <button
            onClick={() => router.push("/home")}
            type="button"
            className="w-full bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded transition"
          >
            Cancel
          </button>
        </div>

        <div className="text-center text-red-700">{error}</div>
      </form>
    </div>
  );
}
