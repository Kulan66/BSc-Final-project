import React from "react";
import { motion } from "framer-motion";

export default function ClassTab({ name, selected, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        text-sm md:text-base font-semibold border-2 rounded-full px-4 py-1.5 cursor-pointer 
        transition-all duration-200 ease-in-out whitespace-nowrap
        ${
          selected
            ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white border-blue-500 shadow-md"
            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
        }
      `}
      onClick={() => onClick(name)}
    >
      {name}
    </motion.div>
  );
}
