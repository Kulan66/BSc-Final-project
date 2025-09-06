import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

function SignInPage() {
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
          Welcome Back
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Sign in to your account to continue.
        </p>
      </motion.div>
      
      {/* Clerk SignIn component with default styles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10"
      >
        <SignIn />
      </motion.div>
    </main>
  );
}

export default SignInPage;