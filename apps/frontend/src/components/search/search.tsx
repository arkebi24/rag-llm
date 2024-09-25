import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit } from "lucide-react";

interface SearchComponentProps {
  onSearch: (query: string) => void;
}

export default function SearchComponent({ onSearch }: SearchComponentProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl bg-transparent">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Enter your search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow text-neutral-400 border border-gray-500 bg-transparent rounded-xl h-14 w-full "
        />
        <Button
          onClick={handleSearch}
          className="w-full md:w-auto h-14 text-white border border-gray-500 bg-transparent rounded-xl"
        >
          <BrainCircuit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
