import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabase";

export default function SearchBarGroup() {
  const [groupName, setGroupName] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [sportsOptions, setSportsOptions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSports = async () => {
      const { data, error } = await supabase.from("sport").select("name");
      if (error) {
        console.error("Error fetching sports:", error.message);
      } else {
        setSportsOptions(data?.map((s) => s.name) || []);
      }
    };

    fetchSports();
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (groupName) queryParams.set("groupName", groupName);
    if (selectedSport) queryParams.set("sport", selectedSport);

    router.push(`/searchGroup?${queryParams.toString()}`);
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-2xl ml-10">
        <input
          type="text"
          placeholder="Search by group name..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="p-2 rounded border border-gray-300 w-full sm:w-1/2"
        />
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="p-2 rounded border border-gray-300 w-full sm:w-1/4"
        >
          <option value="">All Sports</option>
          {sportsOptions.map((s) => (
            <option key={s} value={s}>
              {s}
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
    </div>
  );
}
