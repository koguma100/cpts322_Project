// pages/profile.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { username } = router.query; 

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return; 

      // Query the 'profile' table for user data based on the username
      const { data, error } = await supabase
        .from('profile') 
        .select('*') 
        .eq('username', username) 
        .single(); 

      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }

      setUser(data); 
    };

    fetchUserData();
  }, [username]); 

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <p>Bio: {user.bio}</p>
      {/* Render other user information as needed */}
    </div>
  );
}
