import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import Image from 'next/image';
import Link from 'next/link';
import "../app/globals.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [sport, setSport] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } = await supabase
        .from('profile')
        .select('*')
        .eq('id', id)
        .single();

      if (userError || !userData) {
        setError(userError?.message || 'User not found');
        setLoading(false);
        return;
      }

      setUser(userData);

      const { data: sportData } = await supabase
        .from('userSport')
        .select('sport')
        .eq('user_id', id)
        .single();

      setSport(sportData?.sport || 'Not specified');

      const { data: groupData } = await supabase
        .from('groupMember')
        .select('group(name)')
        .eq('user_id', id);

      setGroups(groupData?.map(g => g.group.name) || []);
      setLoading(false);
    };

    fetchUserData();
  }, [id]);

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <Image
        src="/Images/LEBRON.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-[-1] opacity-30"
      />

      <div className="relative z-10 w-full max-w-2xl p-8 bg-gray-900 bg-opacity-80 text-white rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-4xl font-bold text-center mb-6">{user.username}'s Profile</h1>

        <div className="flex flex-col items-center">
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt={`${user.username}'s profile picture`}
              width={150}
              height={150}
              className="rounded-full mb-4 shadow-md"
            />
          ) : (
            <div className="rounded-full bg-gray-700 w-36 h-36 flex items-center justify-center mb-4 text-white font-bold">
              No Image
            </div>
          )}

          <div className="text-center">
            <p className="mb-2 text-lg"><span className="font-semibold">Bio:</span> {user.bio || 'No bio provided'}</p>
            <p className="mb-4 text-lg"><span className="font-semibold">Sport:</span> {sport}</p>

            <p className="text-lg font-semibold mb-2">Groups:</p>
            {groups.length > 0 ? (
              <ul className="space-y-2">
                {groups.map((groupName) => (
                  <li key={groupName}>
                    <Link
                      href={`/group/${groupName}`}
                      className="text-red-400 hover:text-red-300 hover:underline transition"
                    >
                      {groupName}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Not a member of any groups</p>
            )}
          </div>

          <button
            onClick={() => router.back()}
            className="mt-6 bg-red-600 hover:bg-red-700 transition px-6 py-2 rounded-full text-white font-semibold"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
