import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase'; // Ensure this is correct
import { useRouter } from 'next/router';
import Image from "next/image";
import "../app/globals.css";

export default function EditProfile() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [DOB, setDOB] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                let { data: profile } = await supabase
                    .from('profile')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                setUser(user);
                setUsername(profile?.username || '');
                setDOB(profile?.DOB || '');
                setBio(profile?.bio || '');
                setLocation(profile?.location || '');
                setProfilePic(profile?.profilePicture || '');
            }
        }
        fetchUser();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setProfilePic(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleProfilePicUpload = async () => {
        if (!imageFile || !user) return;

        try {
            const { data, error } = await supabase.storage
                .from('profile-pics')
                .upload(`public/${user.id}-${Date.now()}`, imageFile, { upsert: true });

            if (error) {
                console.error('Error uploading image:', error);
                return;
            }

            const { data: publicData, error: urlError } = await supabase.storage
                .from('profile-pics')
                .getPublicUrl(data.path);

            if (urlError) {
                console.error('Error getting public URL:', urlError);
                return;
            }

            const { error: updateError } = await supabase
                .from('profile')
                .update({ profilePicture: publicData.publicUrl })
                .eq('id', user.id);

            if (updateError) {
                console.error('Error updating profile picture:', updateError);
            } else {
                setProfilePic(publicData.publicUrl);
            }
        } catch (err) {
            console.error('Failed to upload image:', err.message);
        }
    };

    const handleProfileUpdate = async () => {
        if (!user) return;

        const { error } = await supabase
            .from('profile')
            .update({
                username,
                DOB,
                bio,
                location,
            })
            .eq('id', user.id);

        if (error) {
            console.error('Error updating profile:', error);
        } else {
            console.log('Profile updated successfully');
        }
    };

    return (
        <div className="bg-gray-800 bg-opacity-100 max-w-lg mx-auto mt-10 p-6 rounded-lg">
            <Image
                src="/Images/LEBRON.jpg"
                alt="Background"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-[-1] opacity-90"
            />
            <h2 className="block text-gray-400 text-center text-2xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                    <label className="block text-gray-400">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-400">Date of Birth</label>
                    <input
                        type="date"
                        value={DOB}
                        onChange={(e) => setDOB(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-400">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-400">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-400">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                    {profilePic && <img src={profilePic} alt="Profile" className="mt-2 w-24 h-24 rounded-full" />}
                </div>

                <div className="flex w-full">
                    <button
                        type="button"
                        onClick={() => {
                            handleProfileUpdate();
                            alert("Profile Updated!")
                            handleProfilePicUpload();
                        }}
                        className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900"
                    >
                        Save Changes
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="px-3 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 ml-auto"
                    >
                        Home
                    </button>
                </div>
            </form>
        </div>
    );
}
