import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BrainCircuit } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

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
      <div className="flex flex-row md:flex-row gap-4 mb-6">
        <HoverBorderGradient className="w-full">
          <Input
            type="text"
            placeholder="Enter your search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow text-neutral-400 border-none bg-transparent rounded-xl h-8 md:w-[25rem]"
          />
        </HoverBorderGradient>
        <HoverBorderGradient
          onClick={handleSearch}
          className="w-full md:w-auto h-12 text-white bg-transparent rounded-xl"
        >
          <BrainCircuit className="h-4 w-4 mt-2" />
        </HoverBorderGradient>
      </div>
    </div>
  );
}
