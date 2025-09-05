// src/pages/Companies.page.jsx

import React, { useState, useEffect } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const url = new URL("http://127.0.0.1:5000/companies");
        if (debouncedSearchQuery) {
          url.searchParams.append("search", debouncedSearchQuery);
        }
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch companies");
        const data = await response.json();
        setCompanies(data.companies);
        setIsError(false);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [debouncedSearchQuery]);

  // Client-side filtering
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-gray-950 text-gray-200 px-4 py-16 md:px-8 md:py-24 lg:py-32 min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4 tracking-tight">
            Insurance Companies
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-400">
            Find the right insurance provider for you.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search for companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-base rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : isError ? (
            <div className="col-span-full text-center text-red-400 py-10 text-lg">
              Failed to load companies.
            </div>
          ) : filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-transform duration-300 shadow-lg border border-gray-700 flex flex-col items-center text-center"
              >
                <div className="h-16 w-16 mb-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {company.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  {company.name}
                </h3>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10 text-lg">
              No companies found for your search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
