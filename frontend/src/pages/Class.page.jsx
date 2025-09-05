// src/pages/Class.page.jsx

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ClassPage() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/classes");
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        setClasses(data.classes);
        setIsError(false);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <section className="bg-gray-950 text-gray-200 px-4 py-16 md:px-8 md:py-24 lg:py-32 min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4 tracking-tight">
            Insurance Classes
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-400">
            Explore the different types of insurance we offer.
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : isError ? (
            <div className="col-span-full text-center text-red-400 py-10 text-lg">
              Failed to load insurance classes.
            </div>
          ) : classes.length > 0 ? (
            classes.map((insuranceClass) => (
              <div
                key={insuranceClass.id}
                className="bg-gray-800 rounded-xl p-8 transform hover:scale-105 transition-transform duration-300 shadow-lg border border-gray-700"
              >
                <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-blue-600 text-white mb-4">
                  <span className="text-2xl font-bold">
                    {insuranceClass.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-white text-center">
                  {insuranceClass.name}
                </h3>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10 text-lg">
              No insurance classes found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}