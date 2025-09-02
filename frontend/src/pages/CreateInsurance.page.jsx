import React from "react";
import { useGetCompaniesQuery, useGetClassesQuery, useAddProductMutation } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Initial state for the form, ensuring a clean slate
const initialState = {
  name: "",
  introduction: "",
  purpose: "",
  max_cover_ceasing_age: "",
  cover_issuing_age: "",
  coverage_level: "",
  company_id: "",
  class_id: "",
};

// Advanced reusable input component for a cleaner, dark-themed look
const FormInput = ({ label, name, type = "text", placeholder, value, onChange, required, className, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-400">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`
        w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        text-white placeholder-gray-500 transition-colors duration-200
        ${className || ""}
      `}
      {...props}
    />
  </div>
);

// Advanced reusable textarea component
const FormTextarea = ({ label, name, placeholder, value, onChange, required, className, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-400">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={4}
      className={`
        w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        text-white placeholder-gray-500 transition-colors duration-200 resize-none
        ${className || ""}
      `}
      {...props}
    />
  </div>
);

// Advanced reusable select component
const FormSelect = ({ label, name, value, onChange, required, options, disabled, placeholder, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-400">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`
        w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        text-gray-300 transition-colors duration-200 appearance-none cursor-pointer
        ${disabled ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : ''}
      `}
      {...props}
    >
      <option value="" disabled hidden>{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const CreateInsurancePage = () => {
  const [form, setForm] = React.useState(initialState);
  
  // Fetch companies and classes for dropdowns
  const { data: companiesData, isLoading: isLoadingCompanies } = useGetCompaniesQuery();
  const { data: classesData, isLoading: isLoadingClasses } = useGetClassesQuery();
  
  // Mutation for adding a product
  const [addProduct, { isLoading: isAddingProduct }] = useAddProductMutation();

  const companies = companiesData?.companies || [];
  const classes = classesData?.classes || [];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(form).unwrap();
      toast.success("Product created successfully!");
      setForm(initialState); // Reset form on success
    } catch (err) {
      toast.error(err?.data?.error || "Failed to create product.");
    }
  };

  return (
    <main className="bg-gray-950 text-gray-200 min-h-screen px-4 py-16 md:px-8 lg:py-24">
      <div className="container mx-auto max-w-4xl">
        {/* Page Title with an advanced style */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-2 tracking-tight">
            Create New Product
          </h1>
          <p className="text-lg md:text-xl text-gray-400">
            Fill out the form below to add a new insurance product to the system.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-6 bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-700"
          onSubmit={handleSubmit}
        >
          <FormInput
            label="Product Name"
            name="name"
            placeholder="e.g., LifeSaver Plus"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormTextarea
            label="Introduction"
            name="introduction"
            placeholder="A brief summary of the product..."
            value={form.introduction}
            onChange={handleChange}
            required
          />
          <FormTextarea
            label="Purpose"
            name="purpose"
            placeholder="Describe the main purpose of this product..."
            value={form.purpose}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Max Cover Ceasing Age"
              name="max_cover_ceasing_age"
              type="number"
              placeholder="e.g., 65"
              value={form.max_cover_ceasing_age}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Cover Issuing Age"
              name="cover_issuing_age"
              placeholder="e.g., 18 to 60"
              value={form.cover_issuing_age}
              onChange={handleChange}
              required
            />
          </div>
          
          <FormSelect
            label="Coverage Level"
            name="coverage_level"
            placeholder="Select a coverage level"
            value={form.coverage_level}
            onChange={handleChange}
            required
            options={[
              { value: "Basic", label: "Basic" },
              { value: "Standard", label: "Standard" },
              { value: "Premium", label: "Premium" },
            ]}
          />

          <FormSelect
            label="Company"
            name="company_id"
            placeholder={isLoadingCompanies ? 'Loading...' : 'Select a company'}
            value={form.company_id}
            onChange={handleChange}
            required
            disabled={isLoadingCompanies}
            options={companies.map(company => ({
              value: company.id,
              label: company.name
            }))}
          />

          <FormSelect
            label="Class"
            name="class_id"
            placeholder={isLoadingClasses ? 'Loading...' : 'Select a class'}
            value={form.class_id}
            onChange={handleChange}
            required
            disabled={isLoadingClasses}
            options={classes.map(cls => ({
              value: cls.id,
              label: cls.name
            }))}
          />

          <button
            type="submit"
            disabled={isAddingProduct}
            className="w-full py-3 px-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full 
                       shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform 
                       disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {isAddingProduct ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Product...</span>
              </>
            ) : (
              "Create Product"
            )}
          </button>
        </motion.form>
      </div>
    </main>
  );
};

export default CreateInsurancePage;
