// pages/login.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import "../app/globals.css";

const Login = () => {
  const [email, setEmail] = useState(''); //Initialize Email
  const [password, setPassword] = useState(''); //Initialize Password
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error)
      {
        setUser(data.user);
        router.push("/home");
      }

    };

    checkUser();  
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    //Check for errors
    if (error)
    { 
        console.log('Error:', error.message);
        setErrorMessage(error.message);
    }
    else 
    {
        console.log('User logged in:', data.user);
        router.push("/home");
    }
  };
  //Redirect to Signup Page
  const handleSignupRedirect = () => {
    router.push('/signup');
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} //Update Email on Input
          required //Makes Email Required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} //Update Password on Input
          required //Makes Password Required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <button onClick={handleSignupRedirect}>Sign up</button>
      </p>
      {errorMessage}
    </div>
  );
};

export default Login;