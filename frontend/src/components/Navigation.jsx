import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Globe, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function AdvancedNavigation() {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="z-50 bg-gray-900 flex items-center justify-between px-6 py-4 relative">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold text-white">
          InsuraZone
        </Link>
        <div className="hidden md:flex space-x-6 text-gray-200">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/products" className="hover:text-white transition-colors">
            Products
          </Link>
          <Link to="/claims" className="hover:text-white transition-colors">
            Claims
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          {user?.publicMetadata?.role === "admin" && (
            <Link to="/insurance/create" className="hover:text-white transition-colors">
              Create Insurance
            </Link>
          )}
        </div>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" className="text-white hover:bg-gray-800">
          <Globe className="h-4 w-4 mr-2" />
          EN
        </Button>
        <SignedOut>
          <Button variant="ghost" className="text-blue-300 hover:bg-gray-800 hover:text-white" asChild>
            <Link to="/sign-in">Sign In</Link>
          </Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700" asChild>
            <Link to="/sign-up">Sign UP</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button className="bg-blue-600 text-white hover:bg-blue-700" asChild>
            <Link to="/account">My Account</Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <Button variant="ghost" className="text-white hover:bg-gray-800 p-2" onClick={toggleMenu} aria-label="Toggle navigation menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 text-white p-6 md:hidden transition-all duration-300 ease-in-out">
          <div className="flex flex-col space-y-4">
            <Link to="/" onClick={toggleMenu} className="block hover:text-gray-300">
              Home
            </Link>
            <Link to="/products" onClick={toggleMenu} className="block hover:text-gray-300">
              Products
            </Link>
            <Link to="/claims" onClick={toggleMenu} className="block hover:text-gray-300">
              Claims
            </Link>
            <Link to="/contact" onClick={toggleMenu} className="block hover:text-gray-300">
              Contact
            </Link>
            {user?.publicMetadata?.role === "admin" && (
              <Link to="/insurance/create" onClick={toggleMenu} className="block hover:text-gray-300">
                Create Insurance
              </Link>
            )}
            <hr className="border-gray-700" />
            <SignedOut>
              <Link to="/sign-in" onClick={toggleMenu} className="block hover:text-gray-300">
                Log In
              </Link>
              <Button asChild onClick={toggleMenu} className="w-full">
                <Link to="/sign-up">Sign UP</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button asChild onClick={toggleMenu} className="w-full">
                <Link to="/account">My Account</Link>
              </Button>
              <div className="flex items-center space-x-2">
                <UserButton afterSignOutUrl="/" />
                <span>My Profile</span>
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}

export default AdvancedNavigation;