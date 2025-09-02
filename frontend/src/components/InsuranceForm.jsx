import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePredictCoverageMutation } from "@/lib/api";
import ProductsList from "./ProductsList";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialState = {
  age: "",
  bmi: "",
  children: "",
  gender: "",
  smoker: "",
  region: "",
  medical_history: "",
  family_medical_history: "",
  exercise_frequency: "",
  occupation: "",
  charges: "",
};

export default function AdvancedInsuranceForm() {
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [predictCoverage, { isLoading }] = usePredictCoverageMutation();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    // Basic form validation
    const requiredFields = Object.keys(initialState);
    const isFormValid = requiredFields.every((field) => form[field] !== "");

    if (!isFormValid) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const response = await predictCoverage(form).unwrap();
      setResult(response.coverage_level);
    } catch (err) {
      setError(err?.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {result ? (
        <motion.div
          key="products-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-gray-900 text-white overflow-y-auto flex flex-col"
        >
          <div className="w-full p-6 flex justify-between items-center border-b border-gray-700">
            <div className="text-center flex-1">
              <h2 className="text-4xl font-bold text-blue-400">
                Our Handpicked Plans
              </h2>
              <p className="mt-2 text-gray-300">
                Based on your details, here are the best coverage options for you.
              </p>
            </div>
            <Button
              variant="outline"
              className="ml-4 bg-gray-800 text-white hover:bg-gray-700"
              onClick={() => setResult(null)}
            >
              Back
            </Button>
          </div>
          <div className="flex-1 p-6">
            <ProductsList coverageLevel={result} />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="insurance-form"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto z-10"
        >
          <form
            className="w-full mx-auto flex flex-col gap-6 p-8 rounded-xl shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200"
            onSubmit={handleSubmit}
          >
            <h2 className="text-3xl font-bold text-center text-blue-400">
              Get Your Personalized Quote
            </h2>

            {/* --- Personal Information Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <h3 className="text-lg font-semibold col-span-full text-gray-100 mb-2">Personal Information</h3>
              <input
                name="age"
                type="number"
                placeholder="Age"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.age}
                onChange={handleChange}
                min="1"
                required
              />
              <input
                name="bmi"
                type="number"
                step="0.1"
                placeholder="BMI (e.g., 25.5)"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.bmi}
                onChange={handleChange}
                min="10"
                required
              />
              <input
                name="children"
                type="number"
                placeholder="Number of Children"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.children}
                onChange={handleChange}
                min="0"
                required
              />
              <select
                name="gender"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="" className="bg-gray-700 text-gray-400">Select Gender</option>
                <option value="male" className="bg-gray-700 text-white">Male</option>
                <option value="female" className="bg-gray-700 text-white">Female</option>
              </select>
              <select
                name="smoker"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.smoker}
                onChange={handleChange}
                required
              >
                <option value="" className="bg-gray-700 text-gray-400">Smoker?</option>
                <option value="yes" className="bg-gray-700 text-white">Yes</option>
                <option value="no" className="bg-gray-700 text-white">No</option>
              </select>
              <input
                name="region"
                placeholder="Region (e.g., southwest)"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.region}
                onChange={handleChange}
                required
              />
            </div>

            {/* --- Health and Lifestyle Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <h3 className="text-lg font-semibold col-span-full text-gray-100 mb-2">
                Health and Lifestyle
              </h3>
              <input
                name="medical_history"
                placeholder="Medical History"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.medical_history}
                onChange={handleChange}
                required
              />
              <input
                name="family_medical_history"
                placeholder="Family Medical History"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.family_medical_history}
                onChange={handleChange}
                required
              />
              <select
                name="exercise_frequency"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.exercise_frequency}
                onChange={handleChange}
                required
              >
                <option value="" className="bg-gray-700 text-gray-400">Exercise Frequency</option>
                <option value="sedentary" className="bg-gray-700 text-white">Sedentary</option>
                <option value="light" className="bg-gray-700 text-white">Light</option>
                <option value="moderate" className="bg-gray-700 text-white">Moderate</option>
                <option value="active" className="bg-gray-700 text-white">Active</option>
              </select>
              <input
                name="occupation"
                placeholder="Occupation"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.occupation}
                onChange={handleChange}
                required
              />
              <input
                name="charges"
                type="number"
                step="0.01"
                placeholder="Current Insurance Charges ($)"
                className="w-full p-3 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.charges}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors mt-6 p-3 rounded-md flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict Coverage Level"
              )}
            </Button>
            {error && <div className="text-red-400 mt-4 text-center">{error}</div>}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
