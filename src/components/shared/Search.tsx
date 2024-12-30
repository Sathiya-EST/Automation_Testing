import React, { useState } from "react";
import { Search, X } from 'lucide-react';
interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
    initialValue?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeholder = "Search...", className, initialValue }) => {
    const [query, setQuery] = useState(initialValue || "");
    const handleBlur = () => {
        onSearch(query);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch(query);
        }
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                className="w-full px-4 py-2 pl-10 text-sm border rounded bg-background text-gray-900 dark:bg-background dark:text-white  focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
            />
            {query && (
                <X
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    size={20}
                />
            )}
        </div>
    );
};

export default SearchInput;
