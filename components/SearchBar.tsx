'use client'
import { useState } from "react";
import { Search, X, Bot, Loader2 } from "lucide-react";
import { aiResponse } from "../app/actions/ai";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [response, setResponse] = useState("");

  const handleSearch = async () => {
    try {
      setLoadingAi(true);
      const res = await aiResponse(query);
      console.log(res)
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div>
      <div className="border w-screen p-2">
        <input
          placeholder="Search Your Git Problem?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      <div className="p-4">
        <h1 className="font-semibold">{query}</h1>

        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 mt-2"
        >
          {loadingAi ? "Loading..." : "RESPONSE"}
        </button>

        <div className="mt-4">
          {loadingAi && <p>Loading AI response...</p>}
          {response && <p>{response}</p>}
        </div>
      </div>
    </div>
  );
}