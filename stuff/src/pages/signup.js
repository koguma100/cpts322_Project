import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import "../app/globals.css";

const Signup = () => {
  const [email, setEmail] = useState(''); //Initialize Email
  const [password, setPassword] = useState(''); //Initialize Password
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  // checks is a user is already logged in on load
   useEffect(() => {
        const checkUser = async () => {
          const { data, error } = await supabase.auth.getUser();
          if (error) console.error("Error fetching user:", error.message);
          else 
          {
            setUser(data.user);
            router.push("/home");
          }
    
        };
  
        checkUser();  
      }, [])

  const handleSignUp = async (e) => {
    e.preventDefault();
    //Call Signup to make a new user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setUser(signUpData.user);
    //Check for Errors
    if (signUpError) 
    {
        console.log('Error:', signUpError.message);
        setErrorMessage(signUpError.message);
    }
    else {  // update username NOT WORKING YET !!!!
        console.log('User signed up:', signUpData.user);
        const { data: profileData, error: profileError } = await supabase
          .from("Profile") // Table name
          .update({ username: username }) // New value
          .eq("id", signUpData.user.id); // Ensure only the authenticated user updates their own record

        if (profileError) {
          console.error("Error updating username:", profileError);
        } else {
          console.log("Username updated successfully:", profileData);
        }
        router.push("/home");

    }
  };
  //Redirect to Signup Page
  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <h1>Sign Up</h1>
        <input
          type="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} //Update Username on Input
          required //Makes Username Required
        />
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
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Have an account?{' '}
        <button onClick={handleLoginRedirect}>log in</button>
      </p>
      {errorMessage}
    </div>
  );
};

export default Signup;