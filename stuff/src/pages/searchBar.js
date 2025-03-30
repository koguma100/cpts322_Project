import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from '../utils/supabase'; 

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Function to handle search
  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    // Query Supabase to search for the username
    const { data, error } = await supabase
      .from("profile") 
      .select("username")
      .ilike("username", `%${searchQuery}%`); 

    if (error) {
      console.error("Error searching for user:", error.message);
      return;
    }

    // If the user is found, navigate to their profile
    if (data && data.length > 0) {
      router.push(`/profile?username=${data[0].username}`);
    } else {
      alert("User not found");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a user..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
