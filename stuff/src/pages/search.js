import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabase";
import SearchBar from "./searchBar";

export default function SearchPage() {
  const router = useRouter();
  const { query: searchQuery, sport, group } = router.query;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      let baseQuery = supabase.from("profile").select("id, username");

      // Apply username filter (check for not null)
      if (searchQuery) {
        baseQuery = baseQuery.ilike("username", `%${searchQuery}%`);
      }

      // Apply sport filter
      if (sport) {
        const { data: sportUsers } = await supabase
          .from("userSport")
          .select("user_id")
          .eq("sport", sport);

        const userIds = sportUsers?.map((u) => u.user_id) || [];
        baseQuery = baseQuery.in("id", userIds);
      }

      // Apply group filter
      if (group) {
        const { data: groupUsers } = await supabase
          .from("groupMember")
          .select("user_id")
          .eq("group", group);

        const userIds = groupUsers?.map((u) => u.user_id) || [];
        baseQuery = baseQuery.in("id", userIds);
      }

      // Fetch data with additional filter to exclude NULL profiles
      const { data, error } = await baseQuery
        .not("username", "is", null)  // Filter out profiles with NULL usernames

      if (error) {
        console.error("Search error:", error.message);
      } else {
        setResults(data);
      }

      setLoading(false);
    };

    fetchResults();
  }, [searchQuery, sport, group]);

  const handleUserClick = (userId) => {
    router.push(`/profile?id=${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Find Users</h1>

      {/* Search Bar with filters */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-4xl">
          <SearchBar />
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-3xl mx-auto">
        {loading && <p className="text-center">Loading...</p>}

        {!loading && results.length === 0 && (
          <p className="text-center text-gray-500">No users found.</p>
        )}

        {!loading &&
          results.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="cursor-pointer p-4 bg-white mb-3 rounded shadow hover:bg-gray-100 transition"
            >
              <p className="text-lg font-semibold">{user.username}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
