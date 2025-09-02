import { Sparkles } from "lucide-react";
import InsuranceForm from "./InsuranceForm";

export default function Hero() {
  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 md:p-12">
      {/* Background with subtle gradient and stripes */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gray-900"></div>
        <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side: Marketing and Text */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="text-sm px-3 py-1 mb-4 rounded-full border border-blue-600 bg-blue-900 text-blue-300 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Smart Coverage, Simple Process
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Protect What Matters Most, Effortlessly.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
            Our platform helps you find the best insurance plans tailored to your needs in seconds. Get personalized quotes and secure your future with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#quote-form">
              <button className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 text-lg font-semibold rounded-md text-white">
                Get a Free Quote
              </button>
            </a>
            <a href="/products">
              <button className="text-white border border-white hover:bg-gray-800 transition-colors px-6 py-3 text-lg font-semibold rounded-md">
                Explore Our Plans
              </button>
            </a>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div id="quote-form" className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
          <InsuranceForm />
        </div>
      </div>
    </div>
  );
}
