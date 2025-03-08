import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");

  // Initialize search box with current query
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      setLocation(`/?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      setLocation("/");
      setQuery("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!e.target.value.trim()) {
      setLocation("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for cannabis products..."
        className="pl-9"
        value={query}
        onChange={handleChange}
      />
    </form>
  );
}