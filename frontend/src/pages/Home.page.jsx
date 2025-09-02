import { useState } from "react";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProductsList from "@/components/ProductsList";

const HomePage = () => {
  // This state tracks the selected coverage level (null = show all products)
  const [coverageLevel, setCoverageLevel] = useState(null);

  return (
    <main>
      <div className="relative min-h-screen">
        {/* Pass setCoverageLevel to Hero, which passes it to InsuranceForm */}
        <Hero onPredict={setCoverageLevel} />
        <img
          src="/assets/hero/hero.jpg"
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
      </div>
      {/* Show all products by default, or filter by coverageLevel after prediction */}
      <ProductsList coverageLevel={coverageLevel} />
      <Footer />
    </main>
  );
};

export default HomePage;