// src/pages/Products.page.jsx

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProductCard from "../components/ProductCard"; // Adjust the path if necessary

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
        setIsError(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearch) ||
          product.company_name.toLowerCase().includes(lowerCaseSearch) ||
          product.class_name.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  return (
    <section className="bg-gray-950 text-gray-200 px-4 py-16 md:px-8 md:py-24 lg:py-32 min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4 tracking-tight">
            Explore All Insurance Products
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-400">
            Browse our entire catalog of insurance products from various
            companies and classes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search products, companies, or classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg px-6 py-3 rounded-full text-gray-100 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : isError ? (
            <div className="col-span-full text-center text-red-400 py-10 text-lg">
              Failed to load products. Please try again later.
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10 text-lg">
              No products found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}