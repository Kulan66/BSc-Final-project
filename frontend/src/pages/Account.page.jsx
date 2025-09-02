import React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

const AccountPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  if (!isSignedIn) {
    // If user is not signed in, redirect to the sign-in page.
    return <Navigate to="/sign-in" />;
  }

  return (
    <main className="bg-gray-950 text-gray-200 min-h-screen px-4 py-16 md:px-8 lg:py-24">
      <div className="container mx-auto max-w-4xl">
        {/* Page Title with an advanced style */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-2 tracking-tight">
            My Account
          </h1>
          <p className="text-lg md:text-xl text-gray-400">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Account Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Personal Information Card */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Personal Information</h2>
            <div className="space-y-6 text-gray-300">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">Full Name:</span>
                <p className="text-lg">{user?.fullName}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">Email Address:</span>
                <p className="text-lg">{user?.emailAddresses?.[0]?.emailAddress}</p>
              </div>
            </div>
          </div>

          {/* Profile Picture Card */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-semibold text-white mb-6">Profile Picture</h2>
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt="User Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4"
              />
            )}
            <p className="text-gray-400">Your profile image from Clerk.</p>
          </div>
        </motion.div>

        {/* Account Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => signOut()}
            className="bg-red-600 text-white font-semibold px-8 py-3 rounded-full 
                       shadow-lg hover:bg-red-700 transition-colors duration-300 
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </main>
  );
};

export default AccountPage;
