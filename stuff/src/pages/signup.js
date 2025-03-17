// pages/signup.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import Image from "next/image";
import "../app/globals.css";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        router.push("/home");
      }
    };
    checkUser();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      setErrorMessage(signUpError.message);
    } else {
      router.push("/verifyEmail");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <Image
        src="/Images/LEBRON.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-[-1] opacity-90"
      />
      <div className="bg-gray-900 bg-opacity-75 p-8 rounded-lg shadow-lg w-96 text-white">
        <h1 className="text-red-700 text-4xl font-bold text-center mb-6" style={{ fontFamily: 'Prism' }}>STUFF</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
          <button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white py-2 rounded">Sign Up</button>
        </form>
        {errorMessage && <p className="text-red-500 mt-2 text-center">{errorMessage}</p>}
        <p className="text-gray-300 text-center mt-4">
          Have an account? <button onClick={() => router.push('/login')} className="text-red-700 hover:underline">Log in</button>
        </p>
      </div>
    </div>
  );
};

export default Signup;