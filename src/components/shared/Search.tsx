import React, { useState } from "react";
import { Search } from 'lucide-react';
interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeholder = "Search...", className }) => {
    const [query, setQuery] = useState("");

    const handleBlur = () => {
        onSearch(query);
    };

    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="w-full px-4 py-2 pl-10 border rounded bg-muted text-gray-900 dark:bg-muted dark:text-white  focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
            />
        </div>
    );
};

export default SearchInput;
