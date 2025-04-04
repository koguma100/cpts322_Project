import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import Image from 'next/image';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [sport, setSport] = useState(null);
  const [groups, setGroups] = useState([]); // Change to an array to hold multiple groups
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      setLoading(true);
      setError(null); // Reset error state

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('profile')
        .select('*')
        .eq('id', id)
        .single();

      if (userError) {
        setError('Error fetching user: ' + userError.message);
        setLoading(false);
        return;
      }

      if (!userData) {
        setError('User not found');
        setLoading(false);
        return;
      }

      setUser(userData);

      // Fetch associated sport
      const { data: sportData, error: sportError } = await supabase
        .from('userSport')
        .select('sport')
        .eq('user_id', id)
        .single();

      if (sportError) {
        console.error('Error fetching sport:', sportError.message);
      }

      setSport(sportData?.sport || "Not specified");

      // Fetch groups the user is a member of
      const { data: groupData, error: groupError } = await supabase
        .from('groupMember')
        .select('group(name)') // Assuming 'group' is the foreign key to the group table
        .eq('user_id', id);

      if (groupError) {
        console.error('Error fetching groups:', groupError.message);
      }

      // Set groups, mapping to get group names
      setGroups(groupData?.map(g => g.group.name) || []); // Extract group names
      setLoading(false);
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      {user.profilePicture ? (
        <Image
          src={user.profilePicture}
          alt={`${user.username}'s profile picture`}
          width={150}
          height={150}
          className="rounded-full"
        />
      ) : (
        <div className="rounded-full bg-gray-300 w-36 h-36 flex items-center justify-center">
          <span>No Image</span>
        </div>
      )}
      <p>Bio: {user.bio}</p>
      <p>Sport: {sport}</p>
      <p>Groups: {groups.length > 0 ? groups.join(', ') : "Not a member of any groups"}</p>
    </div>
  );
}
