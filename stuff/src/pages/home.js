import "../app/globals.css";
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import { CreateGroup } from '../pages/createGroup';
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

  const handleCreateGroup = () => {

    router.push("/createGroup");

  }

  const handleEditProfile = () => {
    router.push("/editProfile");
  }
  
  const handleViewGroup = () => {

    router.push("/viewGroup");

  }

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

      {/*Horizontal layout containing user info and Title*/}
      <div className="Title and User Info flex justify-between w-full">


        {/*Verticle layout containing user info*/}
        <div className="User Info flex flex-col w-1/9 sm:w-1/8 md:w-1/7 lg:w-1/6 xl:w-1/5 gap-4 justify-start items-center p-0 sm:p-1 md:p-2 lg:p-3 xl:p-4 m-4 bg-gray-900/75 rounded">
          



          {/*Logged in as*/}
          <div className="User flex">

            {user ? (
            <p className="text-xs text-gray-500 font-bold"> Logged in as {user.email}</p>
             ) : (
              <p>Loading...</p>
              )}

          </div>



        {/*Log out button*/}
        <div className="Logout flex gap-2 w-full justify-center">

          <div className="Logout flex justify-center items-center w-1/2 bg-red-800 hover:bg-red-900 rounded">
          
            <button onClick={handleLogout} className="text-base text-center text-white">Log out</button>

          </div>




          {/*Edit profile button*/}

          <div className="Logout flex justify-center items-center w-1/2 bg-red-800 hover:bg-red-900 rounded">
            <button onClick={handleEditProfile} className="text-base text-center text-white">Edit Profile</button>
          </div>




         </div>

        </div>





              {/*Title*/}
        <div className="Title absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center p-4 m-2 rounded">

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-red-800 font-bol text-center self-center" style={{ fontFamily: 'Prism'}}>STUFF</h1>

        </div>

      </div>



      {/*Verticle Layout containing all action buttons*/}

      <div className="Actions flex flex-col xl:w-1/4 lg:w-1/5 md:w-1/6 sm:w-1/7 w-1/8 xl:gap-10 lg:gap-8 md:gap-6 sm:gap-4 gap-2 items-center p-4 lx:mx-50 lg:mx-40 md:mx-30 sm:mx-20 mx-10 lx:my-25 lg:my-20 md:my-15 sm:my-10 bg-gray-900/75  rounded">

        
        {/*Search button*/}
        
        <div className="Logout flex justify-center items-center w-full bg-red-800 hover:bg-red-900 p-2 rounded">
          
          <button className="xl:text-xl lg:text-xl md:text-lg sm:text-base text-sm text-center text-white" >Search</button>

        </div>

        {/*Create Group button*/}

        <div className="Logout flex justify-center items-center w-full bg-red-800 hover:bg-red-900 p-2 rounded">
          
          <button onClick={handleCreateGroup} className="xl:text-xl lg:text-xl md:text-lg sm:text-base text-sm text-center text-white" >Create Group</button>

        </div>

        {/*View Group button*/}

        <div className="Logout flex justify-center items-center w-full bg-red-800 hover:bg-red-900 p-2 rounded">
          
          <button onClick={handleViewGroup} className="xl:text-xl lg:text-xl md:text-lg sm:text-base text-sm text-center text-white" >View Groups</button>

        </div>

        {/*Messages Button*/}

        <div className="Logout flex justify-center items-center w-full bg-red-800 hover:bg-red-900 p-2 rounded">
          
          <button className="xl:text-xl lg:text-xl md:text-lg sm:text-base text-sm text-center text-white" >Messages</button>

        </div>

      </div>

      
    </div>
  );
}
