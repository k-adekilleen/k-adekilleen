import { Link } from "wouter";
import { Cannabis } from "lucide-react";
import SearchBar from "./search-bar";
import { Button } from "@/components/ui/button";
import UploadDialog from "./upload-dialog";

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Cannabis className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">CannaScan</span>
        </Link>
        
        <div className="flex-1 px-4">
          <SearchBar />
        </div>
        
        <UploadDialog />
      </div>
    </nav>
  );
}
