
import { Search } from 'lucide-react';

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="relative max-w-md mx-auto mb-12 animate-fade-in animate-delay-1">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for clubs..."
          className="w-full bg-nightGray border border-nightStroke rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-nightPurple"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-nightMuted" />
      </div>
    </div>
  );
};

export default SearchBar;
