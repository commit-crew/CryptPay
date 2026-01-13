import Image from "next/image";
import { User } from "@/lib/types";
import { useDebounce } from "@/lib/hooks";
import { searchUsers } from "@/lib/user";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const Search = ({
  setSearchOpen,
}: {
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const searchbarRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    searchbarRef.current?.focus();
    const performSearch = async () => {
      if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await searchUsers(debouncedSearchTerm);
          setSearchResults(response.data || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Search failed");
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else if (debouncedSearchTerm.length === 0) {
        setSearchResults([]);
        setError(null);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);
  return (
    <div className="relative flex flex-col items-center gap-15 w-full max-w-[330px] md:max-w-[700px] py-3">
      <div className="w-full relative border border-black rounded-full">
        <div
          className="absolute left-5 z-20 top-[26px] transform -translate-y-1/2 cursor-pointer"
          onClick={() => setSearchOpen(false)}
        >
          <Image src={"/images/left-arrow.svg"} alt="" width={25} height={25} />
        </div>
        <input
          type="text"
          ref={searchbarRef}
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search users by name..."
          className="w-full pl-14 pr-4 py-3 rounded-full focus:outline-none focus:ring-0 focus-visible:right-0 focus:border-transparent bg-[#F6F6F6]"
        />
      </div>
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-4 text-gray-500 absolute top-23">
          Searching...
        </div>
      )}
      {/* Error state */}
      {error && (
        <div className="text-center py-4 text-red-500 absolute top-23">
          {error}
        </div>
      )}
      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="space-y-3 absolute top-16 md:top-23 left-0 right-0">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  <p className="text-[10px] md:text-sm text-gray-600">
                    {user.email}
                  </p>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  {user.publicAddress?.slice(0, 3)}...
                  {user.publicAddress?.slice(-6)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* No results */}
      {searchTerm.length >= 2 &&
        !isLoading &&
        searchResults.length === 0 &&
        !error && (
          <div className="text-center py-4 text-gray-500">
            No users found for &quot;{searchTerm}&quot;
          </div>
        )}
    </div>
  );
};

export default Search;
