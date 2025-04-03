import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [sport, setSport] = useState(null);
  const [group, setGroup] = useState(null);
  const router = useRouter();
  const { id } = router.query;  // Get user id from query parameters

  console.log("ID from query:", id); // Log the id to see if it's being passed correctly

  useEffect(() => {
    if (!id) return;  // Ensure id exists

    const fetchUserData = async () => {
      // Fetch user profile from 'profile' table using the user id
      const { data: userData, error: userError } = await supabase
        .from('profile')
        .select('*')
        .eq('id', id)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }

      setUser(userData);  // Set user data

      // Fetch associated sport from 'userSport' table using the user's id
      const { data: sportData, error: sportError } = await supabase
        .from('userSport')
        .select('sport')
        .eq('user_id', id)
        .single();

      if (sportError) {
        console.error('Error fetching sport:', sportError.message);
        return;
      }

      setSport(sportData?.sport || "Not specified");  // Set sport or default

      // Fetch associated group from 'group' table using the user's id
      const { data: groupData, error: groupError } = await supabase
        .from('group')
        .select('name')
        .eq('user_id', id)
        .single();

      if (groupError) {
        console.error('Error fetching group:', groupError.message);
        return;
      }

      setGroup(groupData?.name || "Not specified");  // Set group or default
    };

    fetchUserData();
  }, [id]);  // Re-run the effect when the user id changes

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <p>Bio: {user.bio}</p>
      <p>Sport: {sport}</p> {/* Display sport */}
      <p>Group: {group}</p> {/* Display group */}
      {/* Render other user information as needed */}
    </div>
  );
}
