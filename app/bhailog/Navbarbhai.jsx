"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";

export default function Navbarbhai() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const logout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/bhailog/password";
  };
  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const navItems = [
    { name: "Drivers", href: "#drivers" },
    { name: "Travels", href: "#travels" },
    { name: "Trips", href: "#trips" },
    { name: "Users", href: "#users" },
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-blue-800 shadow-2xl relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center group">
              <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  className="h-12 w-12 rounded-xl shadow-lg"
                  src="/logo.png"
                  alt="BHAILOG Logo"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="h-12 w-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl hidden items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ display: "none" }}
                >
                  BL
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-white text-xl font-black tracking-wide">
                  BHAILOG
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {navItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="relative text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 group"
                  >
                    {item.name}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                  </a>
                ))}
                <button
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ml-4"
                  onClick={logout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white hover:bg-white/10 p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                aria-expanded={isMenuOpen}
              >
                <div className="relative w-6 h-6">
                  <Menu
                    size={24}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isMenuOpen
                        ? "opacity-0 rotate-180"
                        : "opacity-100 rotate-0"
                    }`}
                  />
                  <X
                    size={24}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isMenuOpen
                        ? "opacity-100 rotate-0"
                        : "opacity-0 -rotate-180"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Slide-in Menu */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-purple-900 via-blue-900 to-blue-800 shadow-2xl transform transition-transform duration-300 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BL</span>
              </div>
              <div className="ml-3">
                <h2 className="text-white text-lg font-bold">BHAILOG</h2>
                <p className="text-cyan-200 text-xs">Admin Portal</p>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="p-6 space-y-2">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="group block text-gray-300 hover:text-white px-4 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:pl-6 border-l-4 border-transparent hover:border-cyan-400"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="flex items-center justify-between">
                  {item.name}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-cyan-400">
                    →
                  </span>
                </span>
              </a>
            ))}

            <div className="pt-4 mt-6 border-t border-white/20">
              <button
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:scale-105"
                onClick={() => {
                  localStorage.removeItem("admin");
                  setIsMenuOpen(false);
                  window.location.href = "/bhailog/password";
                }}
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
