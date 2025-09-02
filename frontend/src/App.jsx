import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Navigation name="KULAN INSURANCE" />
      <div className="relative min-h-screen">
        <Hero />
        <img
          src="/assets/hero/"
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
      </div>
      <Footer />
    </>
  );
};

export default App;