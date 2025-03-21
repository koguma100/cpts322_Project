import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import "../app/globals.css";

const verifyEmail = () => {
    const router = useRouter();
    
    return (
        <div className="relative flex min-h-screen text-white flex-col text-lg">
              <Image
                src="/Images/LEBRON.jpg"
                alt="Background"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-[-1] opacity-90"
              />

            <p className=" m-4">
                Please verify your email address to activate your account.
            </p>
            <div>
                <button className="text-red-700 hover:underline ml-4 select-none" onClick={() => router.push("/login")}>
                    Return to Login 
                </button>
            </div>
        </div>
    )
}

export default verifyEmail;