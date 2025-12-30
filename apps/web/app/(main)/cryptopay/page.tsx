"use client";

import { numanFont } from "@/app/fonts";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchUsers, verifyToken } from "@/lib/user";
import TransactionHist from "@/components/TransactionHist";

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface User {
  id: string;
  name: string;
  email: string;
  publicAddress: string;
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  publicAddress: string;
}

const CryptoPay = () => {
  const router = useRouter();
  const searchbarRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          router.push("/signin");
          return;
        }

        // Verify token with backend
        const response = await verifyToken(token);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Auth verification failed:", error);
        localStorage.removeItem("authToken");
        router.push("/signin");
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // This effect runs when the debounced search term changes
  useEffect(() => {
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
        // Clear search results when input is empty
        setSearchResults([]);
        setError(null);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/signin");
  };

  // Show loading while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6750A4]"></div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!currentUser) {
    return null;
  }

  return (
    <section className="max-w-[1600px] min-h-screen flex flex-col items-center justify-between">
      <div className="flex justify-between items-center p-8 w-full">
        <div
          className={
            numanFont.className + " text-[#6750A4] text-xl xl:text-2xl"
          }
        >
          CryptoPay
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
          <Image
            src={"/images/profile-icon.jpg"}
            alt=""
            width={30}
            height={30}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="relative flex flex-col items-center gap-15 w-full max-w-[330px] md:max-w-[700px]">
        <div className="relative w-full">
          <div className="absolute left-5 z-20 top-1/2 transform -translate-y-1/2">
            <Image
              src={"/images/search-icon.svg"}
              alt=""
              width={25}
              height={25}
            />
          </div>
          <input
            type="text"
            ref={searchbarRef}
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search users by name..."
            className="min-w-full pl-14 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus-visible:right-0 focus:border-transparent drop-shadow-[0_6px_4px_rgba(0,0,0,0.25)] bg-[#F6F6F6]"
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
          <div className="space-y-3 absolute top-23 left-0 right-0">
            <h3
              className={
                numanFont.className + " md:text-md font-semibold text-[#6750A4]"
              }
            >
              Search Results ({searchResults.length})
            </h3>
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {user.publicAddress?.slice(0, 8)}...
                    {user.publicAddress?.slice(-8)}
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

        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-[#CEBBFF] rounded-xl w-fit">
              <Image
                src={"/images/tokens-icon.svg"}
                alt=""
                width={30}
                height={30}
              />
            </div>
            <div className="flex flex-col items-center">
              <div>Pay</div>
              <div> Anyone</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-[#CEBBFF] rounded-xl w-fit">
              <Image
                src={"/images/recieve-icon.svg"}
                alt=""
                width={30}
                height={30}
              />
            </div>
            <div>Recieve</div>
          </div>
        </div>
      </div>
      <TransactionHist userId={currentUser.id} limit={3}/>
    </section>
  );
};

export default CryptoPay;