import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import BookingModal from "./BookingModal";
import ChatInterface from "./ChatInterface";
import { useGetProductsQuery, useGetCompaniesQuery, useGetClassesQuery } from "@/lib/api";
import ProductCard from "./ProductCard";
import CompanyTab from "./CompanyTab";
import ClassTab from "./ClassTab";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsList({ coverageLevel }) {
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: companiesData } = useGetCompaniesQuery();
  const { data: classesData } = useGetClassesQuery();

  const companies = companiesData?.companies || [];
  const classes = classesData?.classes || [];

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery({ 
    coverage_level: coverageLevel, 
    company: selectedCompany, 
    className: selectedClass 
  });

  const products = data?.products || [];

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <section className="bg-gray-950 text-gray-200 px-4 py-16 md:px-8 md:py-24 lg:py-32 min-h-screen">
        <div className="container mx-auto">
          {/* Section Heading with an advanced style */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4 tracking-tight">
              Our Handpicked Plans
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-400">
              Based on your profile, we've found the best insurance products to match your needs. Explore the options below.
            </p>
          </div>

          {/* Filters with improved spacing and layout */}
          <div className="flex flex-col lg:flex-row lg:justify-center items-center gap-8 mb-16">
            {/* Company Filter Group */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-xl text-gray-300">Company:</span>
              <div className="flex flex-wrap gap-2">
                <CompanyTab
                  name="ALL"
                  selected={selectedCompany === "ALL"}
                  onClick={() => setSelectedCompany("ALL")}
                />
                {companies.map((c) => (
                  <CompanyTab
                    key={c.id}
                    name={c.name}
                    selected={selectedCompany === c.name}
                    onClick={() => setSelectedCompany(c.name)}
                  />
                ))}
              </div>
            </div>
            {/* Class Filter Group */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-xl text-gray-300">Class:</span>
              <div className="flex flex-wrap gap-2">
                <ClassTab
                  name="ALL"
                  selected={selectedClass === "ALL"}
                  onClick={() => setSelectedClass("ALL")}
                />
                {classes.map((c) => (
                  <ClassTab
                    key={c.id}
                    name={c.name}
                    selected={selectedClass === c.name}
                    onClick={() => setSelectedClass(c.name)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid with Animations */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {isLoading && (
              <div className="col-span-full flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
              </div>
            )}
            {isError && (
              <div className="col-span-full text-center text-red-400 py-10 text-lg">
                {error?.message || "Failed to load products. Please try again."}
              </div>
            )}
            {!isLoading && !isError && products.length > 0 && (
              <AnimatePresence>
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard 
                      product={product} 
                      onProductSelect={handleProductSelect}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {!isLoading && !isError && products.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10 text-lg">
                No products found for the selected criteria.
              </div>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedProduct && <BookingModal product={selectedProduct} onClose={handleCloseModal} />}
        </AnimatePresence>
      </section>

      {/* Add Chat Interface below Products List */}
      <ChatInterface />
    </>
  );
}