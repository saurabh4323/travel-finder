"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Car } from "lucide-react";
import { useEffect } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedin, setloggedin] = useState(false);
  const [userToken, setuserToken] = useState("");

  useEffect(() => {
    const find = localStorage.getItem("rider");
    if (find) {
      setloggedin(true);
      setuserToken(find);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Trips", href: "/trips" },
    { name: "Travel", href: "/travel" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div
            className="flex items-center space-x-3"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Car className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
              Tripy
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#services"
              className="text-gray-700 hover:text-rose-600 transition-colors font-medium"
            >
              Services
            </a>
            <a
              href="/user/ride"
              className="text-gray-700 hover:text-rose-600 transition-colors font-medium"
            >
              Ride
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-rose-600 transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-rose-600 transition-colors font-medium"
            >
              Contact
            </a>
          </nav>
          <div className="flex space-x-3">
            {loggedin ? (
              <button
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-medium"
                onClick={() => {
                  // alert(userToken);
                  window.location.href = `/user/profile/${userToken}`;
                }}
              >
                Profile
              </button>
            ) : (
              <button
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-medium"
                onClick={() => {
                  window.location.href = "/user/login";
                }}
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
