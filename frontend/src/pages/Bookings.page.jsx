// src/pages/Bookings.page.jsx

import React, { useState, useEffect } from "react";
import { Loader2, Calendar } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/bookings");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data.bookings);
        setIsError(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen px-4 py-16 md:px-8 lg:py-32">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4 tracking-tight">
            Bookings
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-400">
            View all user bookings.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center text-red-400 py-10 text-lg">
            Failed to load bookings.
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl border border-gray-700">
            <table className="w-full text-left table-auto">
              <thead className="text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Booking ID</th>
                  <th scope="col" className="px-6 py-3">User Email</th>
                  <th scope="col" className="px-6 py-3">Product Name</th>
                  <th scope="col" className="px-6 py-3">Company Name</th>
                  <th scope="col" className="px-6 py-3">Booking Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{booking.id}</td>
                    <td className="px-6 py-4">{booking.user_email}</td>
                    <td className="px-6 py-4">{booking.product_name}</td>
                    <td className="px-6 py-4">{booking.company_name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(booking.booking_date).toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 text-lg">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}