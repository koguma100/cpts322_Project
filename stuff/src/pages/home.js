import "../app/globals.css";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session?.user) {
        router.push("/login");
      } else {
        setUser(data.session.user);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
    else router.push("/login");
  };

  return (
    <div className="MainPage relative min-h-screen">
      <Image
        src="/Images/LEBRON.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-[-1]"
      />

      <div className="Title and User Info flex justify-between w-full">
        <div className="User Info flex flex-col w-1/5 gap-4 p-4 m-4 bg-gray-900/75 rounded">
          <div className="User flex">
            {user ? (
              <p className="text-xs text-gray-500 font-bold">Logged in as {user.email}</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div className="Logout flex gap-2 w-full justify-center">
            <div className="flex justify-center w-1/2 bg-red-800 hover:bg-red-900 rounded">
              <button onClick={handleLogout} className="text-white">Log out</button>
            </div>
            <div className="flex justify-center w-1/2 bg-red-800 hover:bg-red-900 rounded">
              <button onClick={() => router.push("/editProfile")} className="text-white">Edit Profile</button>
            </div>
          </div>
        </div>

        <div className="Title absolute top-0 left-1/2 transform -translate-x-1/2 p-4 m-2 rounded">
          <h1 className="text-6xl text-red-800 font-bold text-center" style={{ fontFamily: "Prism" }}>
            STUFF
          </h1>
        </div>
      </div>

      <div className="Actions flex flex-col w-1/4 gap-4 items-center p-4 mx-10 my-10 bg-gray-900/75 rounded">
        <div className="flex justify-center items-center w-full bg-red-800 hover:bg-red-900 p-2 rounded">
          <button onClick={() => router.push("/search")} className="text-white">
            Search for Users
          </button>
        </div>
        <div className="flex justify-center items-center w-full bg-red-800 hover:bg-red-900 p-2 rounded">
          <button onClick={() => router.push("/createGroup")} className="text-white">
            Create Group
          </button>
        </div>
        <div className="flex justify-center items-center w-full bg-red-800 hover:bg-red-900 p-2 rounded">
          <button onClick={() => router.push("/viewGroup")} className="text-white">
            View Groups
          </button>
        </div>
        <div className="flex justify-center items-center w-full bg-red-800 hover:bg-red-900 p-2 rounded">
          <button className="text-white">Messages</button>
        </div>
      </div>
    </div>
  );
}
