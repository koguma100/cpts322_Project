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
      .from("profile")  // Search in the 'profile' table
      .select("id, username")
      .ilike("username", `%${searchQuery}%`);  // Search using 'ilike' for partial matching

    if (error) {
      console.error("Error searching for user:", error.message);
      return;
    }

    // If the user is found, navigate to their profile with the id
    if (data && data.length > 0) {
      router.push(`/profile?id=${data[0].id}`);  // Pass id as query parameter
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
