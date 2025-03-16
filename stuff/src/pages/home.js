import "../app/globals.css";
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import Image from "next/image";


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
    <div className="MainPage">
    <Image
      src ="/Images/LEBRON.jpg"
      alt="Background"
      layout="fill"
      objectFit="cover"
      quality={100}
      className="z-[-1]"
      />

    
    
      <div className=" flex space-x-4">
      
      
      {/* <h2 className="text-2xl ml-100">Subheading</h2>
      <p className="text-gray-200-center text-center text-2xl mt-10 ml-5">This is a paragraph with gray text.</p>
      <span className="text-red-500">This is a span element.</span> */}

      </div>

      <div className="Title and User Info flex justify-between w-full">



        <div className="User Info absolute top-0 left-0 flex justify-start items-start w-1/4 p-4">
          
          <div className="User">

            {user ? (
            <h2 className="text-red-500 text-2xl"> Logged in as {user.email}</h2>
             ) : (
              <p>Loading...</p>
              )}

          </div>


          <div className="Logout absolute top-0 left-120 flex justify-center items-center w-1/4 bg-gray-500">
          
            <button onClick={handleLogout} className="text-2xl text-center text-red-500">Log out</button>

          </div>


        </div>

        <div className="Title absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center">

          <h1 className="text-red-500 text-9xl font-bold text-center self-center" style={{ fontFamily: 'Prism'}}>STUFF</h1>

        </div>

      </div>

      
    </div>
  );
}
