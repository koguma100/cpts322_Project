import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import Image from 'next/image';
import "../app/globals.css";

export default function GroupPage() {
    const router = useRouter();
    const { group } = router.query;
    const [groupData, setGroupData] = useState(null);
    const [members, setMembers] = useState([]);
    const [memberData, setMemberData] = useState([]);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profile')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (!error) setUser(data);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!group) return;
        const fetchGroupData = async () => {
            const { data, error } = await supabase
                .from('group')
                .select('*')
                .eq('name', group)
                .single();
            if (!error) 
            {
                setGroupData(data);
                console.log(data);
            }
        };
        fetchGroupData();
    }, [group]);

    useEffect(() => {
        if (!groupData) return;
        const fetchGroupMembers = async () => {
            const { data, error } = await supabase
                .from('groupMember')
                .select('*')
                .eq('group', groupData.name);
            if (!error) setMembers(data);
        };
        fetchGroupMembers();
    }, [groupData]);

    useEffect(() => {
        if (!members.length) return;
        const fetchMemberData = async () => {
            const memberPromises = members.map(async (member) => {
                const { data, error } = await supabase
                    .from('profile')
                    .select('*')
                    .eq('id', member.user_id)
                    .single();
                return !error ? data : null;
            });
            const memberDataArray = await Promise.all(memberPromises);
            setMemberData(memberDataArray.filter(Boolean));
        };
        fetchMemberData();
    }, [members]);

    useEffect(() => {
        if (!groupData) return;
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('message')
                .select('*')
                .eq('group', groupData.name)
                .order('created_at', { ascending: true });
            if (!error) setMessages(data);
        };
        fetchMessages();
    }, [groupData]);

    useEffect(() => {
        if (!groupData) return;

        const channel = supabase
            .channel(`realtime-messages-${groupData.name}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'message',
                    filter: `group=eq.${groupData.name}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [groupData]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !groupData) return;

        const { error } = await supabase.from('message').insert([
            {
                group: groupData.name,
                sender_id: user.id,
                content: newMessage,
            }
        ]);

        if (!error) {
            setNewMessage('');
        }
    };

    const getUserProfile = (id) => {
        return memberData.find((u) => u.id === id);
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            {/* Header */}
            <header className="bg-gray-900 shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">{groupData?.name} - {groupData?.sport}</h1>
                <div className="flex items-center space-x-8">
                    <a className="font-bold text-med text-red-500 hover:text-red-400 no-underline hover:underline select-none" onClick={() => router.push('/home')}>Home</a>
                    <a className="font-bold text-med text-red-500 hover:text-red-400 no-underline hover:underline select-none" onClick={() => router.push('/group/' + groupData?.name)}>Back to Group</a>    
                </div>
                <span className="text-gray-400 text-sm">Logged in as: {user?.username}</span>
            </header>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-950 border-r border-gray-800 p-4 overflow-y-auto">
                    <h2 className="font-semibold mb-2 text-red-500">Members</h2>
                    <ul className="space-y-2">
                        {memberData.map((member) => (
                            <li key={member.id} className="flex items-center space-x-2">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                                    {member.profilePicture ? (
                                        <Image
                                            src={member.profilePicture}
                                            alt={`${member.username || 'User'} avatar`}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-600" />
                                    )}
                                </div>
                                <span className="text-sm text-white">{member.username || member.email}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Chat Area */}
                <main className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
                    <div className="overflow-y-auto flex-1 space-y-4 pr-2">
                        {messages.map((msg) => {
                            const sender = getUserProfile(msg.sender_id);
                            const isOwn = msg.sender_id === user?.id;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >   
                                    <div className="flex flex-col" key={msg.id + '1'}>
                                        <div className={`max-w-xs p-3 rounded-lg ${isOwn ? 'bg-blue-800 text-white' : 'bg-blue-500 text-white'}`} key={msg.id + '2'}>
                                            <div className="text-base font-semibold mb-1 text-white" key={msg.id + '3'}>
                                                {sender?.username || sender?.email || 'Unknown'}
                                            </div>
                                            <div key={msg.id + '4'}>{msg.content}</div>
                                        </div>
                                        <div className={`text-xs text-gray-400 ${isOwn ? 'ml-2' : 'mr-2'}`} key={msg.id + '5'}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="mt-4 flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 border border-gray-700 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
