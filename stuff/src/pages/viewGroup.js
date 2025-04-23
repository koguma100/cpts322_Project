
import "../app/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { supabase } from "../utils/supabase";
import Image from "next/image";

export default function ViewGroup() {

    
    const [groups, setGroups] = useState([]);
    const [groupsInvited, setGroupsInvited] = useState([]);
    const [user, setUser] = useState(null);
    const [userInvited, setUserInvited] = useState(null);
    const [error, setError] = useState(null);

    const router = useRouter();
    const { from, inviterId } = router.query;
 


    useEffect(() => {
        
        console.log("test");
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
        
        
    }, []);

    useEffect(() => {
        if (!user) return;  // Ensures user is available
    
        const fetchGroups = async () => {
            const { data, error } = await supabase.from("groupMember").select("*").eq("user_id", user.id); //fetches all groups that match user id
            if (error) {
                console.error("Error fetching members:", error);
            } else {
                setGroups(data);
            }
        };
    
        fetchGroups();

        if (from == 'profile')
        {
            const fetchGroupsInvited = async () => {
                const { data, error } = await supabase.from("groupMember").select("*").eq("user_id", inviterId); //fetches all groups that match user id
                if (error) {
                    console.error("Error fetching members:", error);
                } else {
                    setGroupsInvited(data);
                }
            };
        
            fetchGroupsInvited();

            const fetchUserInvited = async () => {
                const { data, error } = await supabase.from("profile").select("email").eq("id", inviterId); //fetches all groups that match user id
                if (error) {
                    console.error("Error fetching members:", error);
                } else {
                    setUserInvited(data[0].email);
                    console.log("type shit");
                    console.log(userInvited);
                }
            };
        
            fetchUserInvited();

            


        }

    }, [user]);



    const handleMyGroup = async (groupId) => {

        router.push(`/group/${groupId}`);
    }

    const handleInvite = async (groupId) => {
       
       
       
        // Generate a unique invite token
        const inviteToken = `${groupId}-${Math.random().toString(36).substring(2, 15)}`;

        // Construct the invite link
        const inviteLink = `${window.location.origin}/group/${groupId}?inviteToken=${inviteToken}`;

        console.log('Generated invite link:', inviteLink);

        // Save the invite link to database
        const { error } = await supabase.from('invite').insert([
            { group_id: groupId, token: inviteToken, link: inviteLink }
        ]);

        if (error) {
            console.error('Error saving invite link:', error);
        } else {
            console.log('Invite link saved!');
           
                navigator.clipboard.writeText(inviteLink);
                prompt("Invite link created! Send to : " + userInvited, inviteLink);
        }


    };
      



    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center">
            {/* Background Image */}
            <Image
                src="/Images/LEBRON.jpg"
                alt="Background"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-[-1]"
            />

            {/* Card Container */}
            <div className="max-w-lg w-full p-6 bg-gray-900 bg-opacity-75 text-white rounded-lg shadow-lg border-2 border-gray-600 mt-8">
            
            
            {/* Title and Notifications */}
<div className="relative mb-6">
  {/* Centered Title */}
  <h2 className="text-4xl font-bold text-red-700 text-center">Your Groups</h2>

  
</div>

                {groups.length === 0 ? (
                    <p className="text-center text-gray-400">No groups found.</p>
                ) : (



                    
                    <div className="flex flex-col gap-4">


                {/* Displays all groups or invitable groups based on previous page */}                 
                {from === 'profile' ? (
                
                
                // Show invitable groups
                (() => {
                    const invitableGroups = groups.filter(
                    group => group.isLeader && !groupsInvited.some(m => m.group === group.group)
                    );

                    return invitableGroups.length > 0 ? (
                    invitableGroups.map(group => (
                        <div
                        key={group.group}
                        className="flex items-center justify-between gap-x-4"
                        >
                        <button
                            onClick={() => handleMyGroup(group.group)}
                            className="w-full bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded transition font-semibold"
                        >
                            {group.group}
                        </button>

                        <button
                            onClick={() => handleInvite(group.group, userInvited)}
                            className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded transition font-semibold"
                        >
                            Invite
                        </button>
                        </div>
                    ))
                    ) : (
                    <p className="text-center text-gray-400">No eligible groups to send invites.</p>
                    );
                })()
                ) : (



                // Show all groups

                groups.length > 0 ? (
                    groups.map(group => (
                    <div
                        key={group.group}
                        className="flex items-center justify-between gap-x-4"
                    >
                        <button
                        onClick={() => handleMyGroup(group.group)}
                        className="w-full bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded transition font-semibold"
                        >
                        {group.group}
                        </button>
                    </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No groups found.</p>
                )
                )}

                            


                    </div>
                )}

                {/* Back Button */}
                <button
                    onClick={() => router.push("/home")}
                    className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded mt-4 transition"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
