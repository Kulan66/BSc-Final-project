import React, { useState } from "react";
import { useCreateBookingMutation } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

// Custom message box component to replace `alert()`
const MessageBox = ({ message, type, onClose }) => {
  const bgColor = type === "error" ? "bg-red-500" : "bg-blue-500";
  const textColor = "text-white";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50`}
    >
      <div className={`${bgColor} ${textColor} p-6 rounded-xl shadow-2xl max-w-sm text-center transform scale-100 transition-transform`}>
        <p className="font-semibold text-lg mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          OK
        </button>
      </div>
    </motion.div>
  );
};

export default function BookingModal({ product, onClose }) {
  const [createBooking, { isLoading, isSuccess, isError, error }] = useCreateBookingMutation();
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleBookProduct = () => {
    if (!userEmail) {
      setMessage({
        text: "Please enter your email address.",
        type: "error",
      });
      return;
    }
    createBooking({
      userEmail: userEmail,
      productId: product.id,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-950 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg text-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold text-blue-400">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-3xl font-light"
            >
              &times;
            </button>
          </div>
          <div className="border-b border-gray-700 pb-6 mb-6">
            <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
            <p className="text-base text-gray-400 mt-2">
              <span className="font-medium">Company:</span> {product.company_name} <br />
              <span className="font-medium">Class:</span> {product.class_name}
            </p>
            <p className="text-gray-300 mt-4 leading-relaxed">{product.introduction}</p>
          </div>

          <div className="mt-4">
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-400">
              Contact Email Address:
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 sm:text-sm transition-colors"
              placeholder="e.g., you@example.com"
              disabled={isLoading || isSuccess}
            />
          </div>

          <div className="mt-6">
            {isLoading && (
              <div className="flex items-center justify-center text-blue-400">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Processing your request...</span>
              </div>
            )}
            {isSuccess && (
              <p className="text-green-400 text-center font-semibold text-lg">
                Booking successful! We will contact you shortly.
              </p>
            )}
            {isError && (
              <p className="text-red-400 text-center font-semibold text-lg">
                Error: {error?.data?.error || "Failed to book product."}
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleBookProduct}
              disabled={isLoading || isSuccess}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-full 
                         shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 
                         disabled:from-gray-500 disabled:to-gray-600"
            >
              Like to buy this product
            </button>
            <button
              onClick={onClose}
              className="bg-gray-700 text-gray-300 font-semibold px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
        <AnimatePresence>
          {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
