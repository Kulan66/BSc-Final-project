import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function AdvancedFooter() {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gray-50 uppercase tracking-wide">
            InsuraZone
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your trusted partner in protecting what matters most. We offer a
            range of personalized insurance solutions to fit your life and
            budget.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-purple-500 transition-colors"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-md font-bold text-gray-50 uppercase tracking-wide">
            Products
          </h3>
          <ul className="text-sm space-y-2">
            <li>
              <a href="/products/auto" className="text-gray-400 hover:text-blue-400 hover:underline transition-colors">
                Auto Insurance
              </a>
            </li>
            <li>
              <a href="/products/home" className="text-gray-400 hover:text-blue-400 hover:underline transition-colors">
                Home Insurance
              </a>
            </li>
            <li>
              <a href="/products/life" className="text-gray-400 hover:text-blue-400 hover:underline transition-colors">
                Life Insurance
              </a>
            </li>
            <li>
              <a href="/products/health" className="text-gray-400 hover:text-blue-400 hover:underline transition-colors">
                Health Insurance
              </a>
            </li>
            <li>
              <a href="/products/business" className="text-gray-400 hover:text-blue-400 hover:underline transition-colors">
                Business Insurance
              </a>
            </li>
          </ul>
        </div>

        {/* Company Links Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-md font-bold text-gray-50 uppercase tracking-wide">
            Company
          </h3>
          <ul className="text-sm space-y-2">
            <li>
              <a href="/about" className="text-gray-400 hover:text-blue-400 hover:underline transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="/claims" className="text-gray-400 hover:text-blue-400 hover:underline transition-colors">
                File a Claim
              </a>
            </li>
            <li>
              <a href="/faq" className="text-gray-400 hover:text-blue-400 hover:underline transition-colors">
                FAQs
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-400 hover:text-blue-400 hover:underline transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/careers" className="text-gray-400 hover:text-blue-400 hover:underline transition-colors">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-md font-bold text-gray-50 uppercase tracking-wide">
            Contact
          </h3>
          <ul className="text-sm space-y-2 text-gray-400">
            <li>
              <strong className="text-gray-200">Phone:</strong>{" "}
              <a href="tel:+18001234567" className="hover:text-blue-400 transition-colors">
                (800) 123-4567
              </a>
            </li>
            <li>
              <strong className="text-gray-200">Email:</strong>{" "}
              <a href="mailto:info@smartinsurance.com" className="hover:text-blue-400 transition-colors">
                info@InsuraZone.com
              </a>
            </li>
            <li>
              <strong className="text-gray-200">Address:</strong> 123 Insurance Ave, Suite 400, New York, NY 10001
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span>&copy; {new Date().getFullYear()} InsuraZone. All rights reserved.</span>
          <span className="hidden md:inline mx-2 text-gray-600">|</span>
          <span className="flex gap-4">
            <a href="/privacy-policy" className="hover:text-blue-400 hover:underline transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-blue-400 hover:underline transition-colors">
              Terms of Service
            </a>
          </span>
        </div>
        <div className="text-center md:text-right">
          Built with <span className="text-red-500">♥</span> using React & Flask
        </div>
      </div>
    </footer>
  );
}