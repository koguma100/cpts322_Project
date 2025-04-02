import "../../app/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Image from "next/image";

export default function GroupPage() {
    const router = useRouter();
    const { name } = router.query; // Get the group name from the URL
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [user, setUser] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [processedMembers, setProcessedMembers] = useState([]);


    useEffect(() => {


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

        const fetchMembers = async () => { //fetch members of group
            setLoading(true);
            const { data, error } = await supabase
                .from("groupMember")
                .select("*")
                .eq("group", name);
        
            if (error) {
                console.error("Error fetching members:", error);
            } else {
                setMembers(data);
        }
        setLoading(false);
        };


        const fetchGroupData = async () => { //fetch group's info 
            setLoading(true);
            const { data, error } = await supabase
                .from("group")
                .select("*")
                .eq("name", name)
                .single();

            if (error) {
                console.error("Error fetching group:", error);
            } else {
                setGroupData(data);
            }
            setLoading(false);
        };

        fetchMembers();
        fetchGroupData();
    }, [name]);
    
    useEffect(() => {

        const fetchProfiles = async () => { //fetch members of group's profiles for username
            setLoading(true);
            const { data, error } = await supabase
                .from("profile")
                .select("*")
                .in("id", (members.map((groupMember) => groupMember.user_id)))
        
            if (error) {
                console.error("Error fetching members:", error);
            } else {
                setProfiles(data);
        }
        setLoading(false);
        };

        
        fetchProfiles();
    }, [members]);

    useEffect(() => {
        if (members.length > 0 && profiles.length > 0) {
            const mergedMembers = members.map((member) => {  //Combines each user's profile with their member profile ...
                const profile = profiles.find((p) => p.id === member.user_id);     //so that isLeader and username can both be found
                return {
                    user_id: member.user_id,
                    username: profile ? profile.email : "Unknown", // Displays "Unknown" if profile is unable to be found for member
                    isLeader: member.isLeader, 
                };
            });
    
            setProcessedMembers(mergedMembers); // Save processed members to state
        }
    }, [members, profiles]);


    

    if (loading) return <p className="text-center text-gray-400">Loading group...</p>; //ensures group and member data is loaded before returning screen
    if (!groupData) return <p className="text-center text-red-500">Group not found</p>;




   

    
    return (    
        <div 
            className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6"
            style={{ backgroundImage: "url('/Images/LEBRON.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
           
    
            {/* Main Content Box */}
            <div className="relative z-10 max-w-lg w-full bg-gray-800 bg-opacity-90 p-8 rounded-xl shadow-lg text-center">
                
                {/* Group Image */}
                <div className="flex justify-center">
                    {groupData.image ? (
                        <img
                            src={groupData.image}
                            alt="Group"
                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-400">
                            <span>No Image</span>
                        </div>
                    )}
                </div>
    
                {/* Group Name & Details */}
                <h1 className="text-4xl font-bold text-red-700 mt-4">{groupData.name}</h1>
                <p className="mt-2 text-gray-300">{groupData.description}</p>
                <p className="mt-2 text-gray-400">Sport: {groupData.sport}</p>
                <p className="mt-2 text-gray-400">Location: {groupData.location}</p>
    
                {/* Members Section */}
                <h2 className="text-2xl font-bold mt-6 mb-4 text-red-500">Group Members</h2>
    
                <div className="flex flex-col gap-2">
                    {processedMembers.length === 0 ? (

                    <p className="text-gray-400">No Members.</p>

                    ) : ( //for each member
                            
                             processedMembers.map((member) => (
                            <p
                                key={member.user_id}
                                className="bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded transition font-semibold flex justify-between items-center"
                            >
                                {/* Username */}
                            <span>{member.username}</span> 

                                {/* Is leader */}
                            {member.isLeader && (

                                <span className="ml-2 text-white font-bold">(Leader)</span>

                            )}
                            </p>
                        ))
                    )}
                </div>

    
                {/* Back Button */}
                <button
                    className="mt-6 bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded transition"
                    onClick={() => router.push("/viewGroup")}
                >
                    Back to Groups
                </button>
            </div>
        </div>
    );
    
}
