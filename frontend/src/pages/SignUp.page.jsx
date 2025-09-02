import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";

function SignUpPage() {
  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "url(/assets/hero/hero.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay with a gradient to ensure text and form are readable */}
      <div className="absolute inset-0 bg-black opacity-80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>

      {/* Title section with a z-index to be on top of the overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 tracking-tight">
          Join the Club
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Create an account to get started.
        </p>
      </motion.div>
      
      {/* Clerk SignUp component with custom styles and a subtle fade-in animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10"
      >
        <SignUp appearance={{
          elements: {
            // Main card and background
            card: "bg-gray-900 text-gray-200 border-2 border-gray-800 shadow-2xl",
            // Header
            headerTitle: "text-gray-200",
            headerSubtitle: "text-gray-500",
            // Form fields
            formFieldLabel: "text-gray-400",
            formFieldInput: "bg-gray-800 text-gray-200 border-gray-700 focus:ring-blue-500 focus:border-blue-500",
            // Primary button
            formButtonPrimary: "bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white",
            // Social buttons
            socialButtonsBlockButton: "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-700",
            // Footer text and links
            footerActionText: "text-gray-500",
            footerActionLink: "text-blue-600 hover:text-blue-500",
          }
        }} />
      </motion.div>
    </main>
  );
}

export default SignUpPage;
