import "../app/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { supabase } from "../utils/supabase";
import Image from "next/image";

export default function ViewGroup() {

    
    const [groups, setGroups] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const router = useRouter();
 


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

        checkUser();
        
        
    }, []);

    useEffect(() => {
        if (!user) return;  // Ensures user is available
    
        const fetchGroups = async () => {
            const { data, error } = await supabase.from("groupMember").select("group").eq("user_id", user.id); //fetches all groups that match user id
            if (data) {
                setGroups(data.map((groupMember) => groupMember.group));
                console.log("Groups retrieved: ", data);
            } else {
                console.error("Error fetching groups:", error);
            }
        };
    
        fetchGroups();
    }, [user]);

    const handleMyGroup = async (groupId) => {

        router.push(`/group/${groupId}`);
    }


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
                <h2 className="text-4xl font-bold mb-6 text-red-700 text-center">
                    Your Groups
                </h2>

                {groups.length === 0 ? (
                    <p className="text-center text-gray-400">No groups found.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {groups.map((groupId) => (
                            <button
                                key={groupId}
                                onClick={() => handleMyGroup(groupId)}
                                className="w-full bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded transition font-semibold"
                            >
                                {groupId}
                            </button>
                        ))}
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
