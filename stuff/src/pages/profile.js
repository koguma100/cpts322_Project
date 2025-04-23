import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import Image from 'next/image';
import Link from 'next/link';
import "../app/globals.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userCur, setUserCur] = useState(null);
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

      const checkUser = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data?.session?.user) {
          router.push("/login");
        } else {
          setUserCur(data.session.user);
        }
      };
      checkUser();

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


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
        
  
        <p className="mb-2">Bio: {user.bio}</p>
        <p className="mb-2">Sport: {sport}</p>
        <p>
          Groups: {groups.length > 0 ? groups.join(', ') : "Not a member of any groups"}
          
        </p>
          {/* Invite & Back Buttons */}
          <div className="flex gap-4 mt-4">
            
            {user.id != userCur.id &&
            
            <button
              onClick={() => router.push({
                pathname: "/viewGroup",
                query: { from: 'profile',
                  inviterId: user.id 
                 }
              })}
              className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded transition"
            >
              Invite
            </button>

            }

            <button
              onClick={() => router.push("/home")}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded transition"
            >
              Back to Home
            </button>
          </div>
      </div>
    </div>
    </div>
  );
}
