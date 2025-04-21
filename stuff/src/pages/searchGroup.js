import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabase";
import SearchBar from "./searchBarGroup";

export default function SearchGroupPage() {
  const router = useRouter();
  const { query: searchQuery, sport, location } = router.query;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);

      let baseQuery = supabase.from("group").select("name, sport, location, description");

      if (searchQuery) {
        baseQuery = baseQuery.ilike("name", `%${searchQuery}%`);
      }

      if (sport) {
        baseQuery = baseQuery.eq("sport", sport);
      }

      if (location) {
        baseQuery = baseQuery.ilike("location", `%${location}%`);
      }

      const { data, error } = await baseQuery;

      if (error) {
        console.error("Search error:", error.message);
      } else {
        setResults(data);
      }

      setLoading(false);
    };

    fetchGroups();
  }, [searchQuery, sport, location]);

  const handleGroupClick = (groupName) => {
    router.push(`/group/${groupName}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/home")}
        className="absolute top-6 left-6 bg-red-800 hover:bg-red-900 text-white font-semibold py-2 px-4 rounded shadow transition"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-4 text-center">Find Groups</h1>

      <div className="flex justify-center mb-6">
        <div className="w-full max-w-4xl">
          <SearchBar />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {loading && <p className="text-center">Loading...</p>}

        {!loading && results.length === 0 && (
          <p className="text-center text-gray-500">No groups found.</p>
        )}

        {!loading &&
          results.map((group, index) => (
            <div
              key={index}
              onClick={() => handleGroupClick(group.name)}
              className="cursor-pointer p-4 bg-white mb-3 rounded shadow hover:bg-gray-100 transition"
            >
              <p className="text-lg font-semibold">{group.name}</p>
              <p className="text-sm text-gray-600">{group.sport} – {group.location}</p>
              <p className="text-sm text-gray-500">{group.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
