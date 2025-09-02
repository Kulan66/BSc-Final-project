import React, { useState } from "react";
import { useGetProductInfoAIMutation } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// Modal for AI info, with larger fixed size and scrollable content
function InfoModal({ open, onClose, info, loading, error }) {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative border border-gray-700"
        style={{ minHeight: "500px", maxHeight: "95vh" }}
      >
        <h2 className="text-3xl font-extrabold text-blue-400 mb-4">AI Latest Info</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-light transition-colors"
        >
          &times;
        </button>
        <div
          className="mt-6 overflow-y-auto pr-2"
          style={{
            maxHeight: "350px",
            minHeight: "350px",
          }}
        >
          {loading && <div className="text-blue-400 text-lg">Loading info...</div>}
          {error && <div className="text-red-400 text-lg">Error: {error}</div>}
          {info && <div className="whitespace-pre-line text-gray-200 text-lg leading-relaxed">{info}</div>}
        </div>
      </motion.div>
    </motion.div>
  );
}

// The component now accepts an `onProductSelect` prop
export default function ProductCard({ product, onProductSelect }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [getInfo, { data, isLoading, error }] = useGetProductInfoAIMutation();

  const handleShowInfo = async (e) => {
    e.stopPropagation();
    setModalOpen(true);
    await getInfo({ companyName: product.company_name, productName: product.name });
  };

  return (
    <motion.div
      className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col h-full cursor-pointer 
                 hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 transform 
                 border border-transparent hover:border-blue-500"
      onClick={() => onProductSelect(product)}
    >
      <div className="flex-grow flex flex-col">
        <h3 className="font-bold text-2xl text-white mb-2">{product.name}</h3>
        <div className="text-base text-gray-400 mb-1">
          <span>Company: {product.company_name}</span>
        </div>
        <div className="text-base text-gray-400 mb-4">
          <span>Class: {product.class_name}</span>
        </div>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
          {product.introduction}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 mb-1">Max Cover Ceasing Age: <span className="text-gray-300 font-medium">{product.max_cover_ceasing_age}</span></div>
        <div className="text-xs text-gray-500">Cover Issuing Age: <span className="text-gray-300 font-medium">{product.cover_issuing_age}</span></div>
      </div>

      {/* New Info Button with improved styling */}
      <button
        className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full 
                   shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        onClick={handleShowInfo}
      >
        Show Latest Info
      </button>

      {/* Info Modal with Framer Motion animations */}
      <AnimatePresence>
        {modalOpen && (
          <InfoModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            info={data?.info}
            loading={isLoading}
            error={error?.data?.error || error?.error}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
