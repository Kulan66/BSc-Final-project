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
          className="fixed inset-0 z-50 bg-gray-950 text-white overflow-y-auto flex flex-col font-sans"
        >
          <div className="w-full p-8 flex justify-between items-center border-b border-gray-800 bg-gray-900 shadow-lg">
            <div className="text-center flex-1">
              <h2 className="text-4xl font-extrabold tracking-tight text-blue-400">
                Your Personalized Plans
              </h2>
              <p className="mt-2 text-gray-400 text-lg">
                Handpicked coverage options based on your profile.
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-gray-700 hover:text-white transition-all duration-300"
              onClick={() => setResult(null)}
            >
              ← Back to Form
            </Button>
          </div>
          <div className="flex-1 p-8">
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
          className="w-full max-w-3xl mx-auto z-10 px-4 sm:px-6 lg:px-8 font-sans"
        >
          <form
            className="w-full mx-auto flex flex-col gap-8 p-10 rounded-3xl shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 border border-slate-700"
            onSubmit={handleSubmit}
          >
            <h2 className="text-4xl font-extrabold text-center text-blue-400 mb-2">
              Insurance Coverage Predictor
            </h2>
            <p className="text-center text-slate-400 -mt-4">
              Enter your details to find your ideal coverage level.
            </p>

            {/* --- Personal Information Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full mb-2">
                <h3 className="text-xl font-semibold text-slate-100 border-l-4 border-blue-500 pl-3">
                  Personal Information
                </h3>
              </div>
              <input
                name="age"
                type="number"
                placeholder="Age"
                className="no-spinner w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                className="no-spinner w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={form.bmi}
                onChange={handleChange}
                min="10"
                required
              />
              <input
                name="children"
                type="number"
                placeholder="Number of Children"
                className="w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={form.children}
                onChange={handleChange}
                min="0"
                required
              />
              <select
                name="gender"
                className="w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled className="bg-slate-800 text-slate-400">Select Gender</option>
                <option value="male" className="bg-slate-800 text-white">Male</option>
                <option value="female" className="bg-slate-800 text-white">Female</option>
              </select>
              <select
                name="smoker"
                className="w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={form.smoker}
                onChange={handleChange}
                required
              >
                <option value="" disabled className="bg-slate-800 text-slate-400">Smoker?</option>
                <option value="yes" className="bg-slate-800 text-white">Yes</option>
                <option value="no" className="bg-slate-800 text-white">No</option>
              </select>
              <input
                name="region"
                placeholder="Region (e.g., southwest)"
                className="w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={form.region}
                onChange={handleChange}
                required
              />
            </div>

            {/* --- Health and Lifestyle Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="col-span-full mb-2">
                <h3 className="text-xl font-semibold text-slate-100 border-l-4 border-blue-500 pl-3">
                  Health and Lifestyle
                </h3>
              </div>
              <select
                name="medical_history"
                className="w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={form.medical_history}
                onChange={handleChange}
                required
              >
                <option value="" disabled className="bg-slate-800 text-slate-400">Medical History</option>
                <option value="None" className="bg-slate-800 text-white">None</option>
                <option value="Diabetes" className="bg-slate-800 text-white">Diabetes</option>
                <option value="Heart disease" className="bg-slate-800 text-white">Heart disease</option>
                <option value="High blood pressure" className="bg-slate-800 text-white">High blood pressure</option>
              </select>
              <select
                name="family_medical_history"
                className="w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={form.family_medical_history}
                onChange={handleChange}
                required
              >
                <option value="" disabled className="bg-slate-800 text-slate-400">Family Medical History</option>
                <option value="None" className="bg-slate-800 text-white">None</option>
                <option value="Diabetes" className="bg-slate-800 text-white">Diabetes</option>
                <option value="Heart disease" className="bg-slate-800 text-white">Heart disease</option>
                <option value="High blood pressure" className="bg-slate-800 text-white">High blood pressure</option>
              </select>
              <select
                name="exercise_frequency"
                className="w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={form.exercise_frequency}
                onChange={handleChange}
                required
              >
                <option value="" disabled className="bg-slate-800 text-slate-400">Exercise Frequency</option>
                <option value="Frequently" className="bg-slate-800 text-white">Frequently</option>
                <option value="Never" className="bg-slate-800 text-white">Never</option>
                <option value="Occasionally" className="bg-slate-800 text-white">Occasionally</option>
                <option value="Rarely" className="bg-slate-800 text-white">Rarely</option>
              </select>
              <input
                name="occupation"
                placeholder="Occupation"
                className="w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={form.occupation}
                onChange={handleChange}
                required
              />
              <input
                name="charges"
                type="number"
                step="0.01"
                placeholder="Current Insurance Charges ($)"
                className="w-full p-4 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={form.charges}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-8 py-4 px-6 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Find best insurance products for me"
              )}
            </Button>
            {error && <div className="text-red-400 mt-4 text-center font-medium">{error}</div>}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}