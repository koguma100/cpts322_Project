import "../app/globals.css";
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error} = await supabase.auth.getSession()

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
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      router.push("/login"); // Redirect after logout
    }
  };

  return (
    <div className="">
      <h1 className="text-blue-700">Home</h1>
      {user ? (
        <p>Logged in as {user.email}</p>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
