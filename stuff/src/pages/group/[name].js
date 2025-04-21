import "../../app/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Image from "next/image";

export default function GroupPage() {
    const router = useRouter();
    const { name } = router.query;
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [user, setUser] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [processedMembers, setProcessedMembers] = useState([]);
    const [confirmLeave, setConfirmLeave] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error fetching user:", error?.message);
                router.push("/login");
            } else if (!data?.session?.user) {
                router.push("/login");
            } else {
                setUser(data.session.user);
            }
        };

        const fetchMembers = async () => {
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

        const fetchGroupData = async () => {
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

        checkUser();
        fetchMembers();
        fetchGroupData();
    }, [name]);

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("profile")
                .select("*")
                .in("id", members.map((groupMember) => groupMember.user_id));
            if (error) {
                console.error("Error fetching profiles:", error);
            } else {
                setProfiles(data);
            }
            setLoading(false);
        };

        if (members.length > 0) {
            fetchProfiles();
        }
    }, [members]);

    useEffect(() => {
        if (members.length > 0 && profiles.length > 0) {
            const merged = members.map((member) => {
                const profile = profiles.find((p) => p.id === member.user_id);
                return {
                    user_id: member.user_id,
                    username: profile ? profile.email : "Unknown",
                    isLeader: member.isLeader,
                };
            });
            setProcessedMembers(merged);
        }
    }, [members, profiles]);

    const confirmLeaveGroup = async () => {
        if (!user) return;

        const { error } = await supabase
            .from("groupMember")
            .delete()
            .match({ user_id: user.id, group: name });

        if (error) {
            console.error("Error leaving group:", error);
            return;
        }

        router.push("/viewGroup");
    };

    if (loading) return <p className="text-center text-gray-400">Loading group...</p>;
    if (!groupData) return <p className="text-center text-red-500">Group not found</p>;

    return (
        <div 
            className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6"
            style={{ backgroundImage: "url('/Images/LEBRON.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="relative z-10 max-w-lg w-full bg-gray-800 bg-opacity-90 p-8 rounded-xl shadow-lg text-center">
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

                <h1 className="text-4xl font-bold text-red-700 mt-4">{groupData.name}</h1>
                <p className="mt-2 text-gray-300">{groupData.description}</p>
                <p className="mt-2 text-gray-400">Sport: {groupData.sport}</p>
                <p className="mt-2 text-gray-400">Location: {groupData.location}</p>
                <p className="mt-2 text-gray-400">Visibility: {groupData.public ? "Public" : "Private"}</p>

                <h2 className="text-2xl font-bold mt-6 mb-4 text-red-500">Group Members</h2>
                <div className="flex flex-col gap-2">
                    {processedMembers.length === 0 ? (
                        <p className="text-gray-400">No Members.</p>
                    ) : (
                        processedMembers.map((member) => (
                            <p
                                key={member.user_id}
                                className="bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded transition font-semibold flex justify-between items-center cursor-pointer"
                                onClick={() => router.push(`/profile?id=${member.user_id}`)}
                            >
                                <span>{member.username}</span>
                                {member.isLeader && (
                                    <span className="ml-2 text-white font-bold">(Leader)</span>
                                )}
                            </p>
                        ))
                    )}
                </div>

                {/* Button Row */}
                <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
                    {/* Leave Group Button */}
                    {!confirmLeave ? (
                        <button
                            className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded transition"
                            onClick={() => setConfirmLeave(true)}
                        >
                            Leave Group
                        </button>
                    ) : (
                        <div className="flex flex-col items-start text-left">
                            <p className="text-gray-300 mb-2">Are you sure you want to leave this group?</p>
                            <div className="flex gap-3">
                                <button
                                    className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded transition"
                                    onClick={confirmLeaveGroup}
                                >
                                    Yes, Leave
                                </button>
                                <button
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
                                    onClick={() => setConfirmLeave(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Join Group Button (only shows if public and user isn't already a member) */}
                    {groupData.public && !processedMembers.some(m => m.user_id === user?.id) && (
                        <button
                            onClick={async () => {
                                if (!user) return;

                                const { error } = await supabase.from("groupMember").insert([
                                    {
                                        user_id: user.id,
                                        group: name,
                                        isLeader: false,
                                    },
                                ]);

                                if (error) {
                                    console.error("Error joining group:", error);
                                    alert("Failed to join group.");
                                } else {
                                    router.reload();
                                }
                            }}
                            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded transition"
                        >
                            Join Group
                        </button>
                    )}

                    {/* Group Chat Link - Only show if in group */}
                    {groupData.public && processedMembers.some(m => m.user_id === user?.id) && (
                    <div className="">
                        <button
                            onClick={() => router.push(`/groupChat?group=${name}`)}
                            className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded transition"
                        >
                            Go to Group Chat
                        </button>
                    </div>
                    )}

                    {/* Back Button */}
                    <button
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition"
                        onClick={() => router.back()}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}
