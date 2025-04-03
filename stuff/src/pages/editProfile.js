// editProfile.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

export default function EditProfile() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [DOB, setDOB] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            const { data, error } = await supabase.auth.getSession();
            
            if (error || !data?.session?.user) {
                console.error("Error fetching session:", error?.message || "User session not found");
                return;
            }
    
            const user = data.session.user; // Get the logged-in user
            console.log("Authenticated User ID:", user.id);
    
            let { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id) // Ensure you're using 'id'
                .single();
    
            if (profileError) {
                console.error("Error fetching profile:", profileError.message);
            } else {
                console.log("Fetched profile:", profile);
            }
    
            setUser(user);
            setUsername(profile?.username || '');
            setDOB(profile?.DOB || '');
            setBio(profile?.bio || '');
            setLocation(profile?.location || '');
            setProfilePic(profile?.profile_pic || '');
        }
        fetchUser();
    }, []);
    
    


    async function handleUpdateProfile(e) {
        e.preventDefault();
    
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data?.session?.user) {
            alert("User authentication error: " + (error?.message || "User not found"));
            return;
        }
    
        const user = data.session.user;
        alert("Updating profile for: " + user.id);
    
        // Build the update object dynamically
        const updateData = {};
        if (username) updateData.username = username;
        if (DOB) updateData.DOB = DOB;
        if (bio) updateData.bio = bio;
        if (location) updateData.location = location;
        if (profilePic) updateData.profilePicture = profilePic; // Change 'profile_pic' to 'profilePicture'
    
        alert("New Profile Data: " + JSON.stringify(updateData));
    
        // Perform the update and capture the response
        const response = await supabase
            .from('profile')  // Make sure the table is 'profile'
            .update(updateData)
            .eq('id', user.id)
            .select();
    
        alert("Supabase Response: " + JSON.stringify(response));
    
        if (response.error) {
            alert("Failed to update profile: " + (response.error.message || "Unknown error"));
        } else {
            alert("Profile updated successfully!");
            router.push('/home');
        }
    }
    

    async function handleProfilePicUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
    
        const { data, error } = await supabase.storage
            .from('profile-pics')
            .upload(`public/${user.id}`, file, { upsert: true });
        
        if (error) {
            alert("Failed to upload image: " + error.message);
            return;
        }
    
        // Construct the URL for the uploaded profile picture
        const url = `https://your-supabase-url/storage/v1/object/public/profile-pics/public/${user.id}`;
        setProfilePic(url); // Save the URL in state to update the profile
    }
    

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="w-full p-2 border rounded-md" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Date of Birth</label>
                    <input 
                        type="date" 
                        value={DOB} 
                        onChange={(e) => setDOB(e.target.value)} 
                        className="w-full p-2 border rounded-md" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Bio</label>
                    <textarea 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Location</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        className="w-full p-2 border rounded-md" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Profile Picture</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProfilePicUpload} 
                        className="w-full p-2 border rounded-md" 
                    />
                    {profilePic && <img src={profilePic} alt="Profile" className="mt-2 w-24 h-24 rounded-full" />}
                </div>
                <div classname="mb-4">
                    <button 
                        type="submit" 
                        onClick={() => router.push('/home')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save Changes
                    </button>
                </div>
                
            </form>
        </div>
    );
}
