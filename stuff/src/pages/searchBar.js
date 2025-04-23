import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabase";
import "../app/globals.css";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sport, setSport] = useState("");
  const [group, setGroup] = useState("");
  const [sportsOptions, setSportsOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFilters = async () => {
      const { data: sportData } = await supabase.from("sport").select("name");
      const { data: groupData } = await supabase.from("group").select("name");

      setSportsOptions(sportData?.map((s) => s.name) || []);
      setGroupOptions(groupData?.map((g) => g.name) || []);
    };

    fetchFilters();
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set("query", searchQuery);
    if (sport) queryParams.set("sport", sport);
    if (group) queryParams.set("group", group);

    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <input
        type="text"
        placeholder="Search by username..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 rounded border border-gray-300 w-full sm:w-1/3"
      />
      <select
        value={sport}
        onChange={(e) => setSport(e.target.value)}
        className="p-2 rounded border border-gray-300 w-full sm:w-1/4"
      >
        <option value="">All Sports</option>
        {sportsOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={group}
        onChange={(e) => setGroup(e.target.value)}
        className="p-2 rounded border border-gray-300 w-full sm:w-1/4"
      >
        <option value="">All Groups</option>
        {groupOptions.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <button
        onClick={handleSearch}
        className="bg-red-800 hover:bg-red-900 text-white p-2 px-4 rounded w-full sm:w-auto"
      >
        Search
      </button>
    </div>
  );
}
