"use client";
import React from "react";
import { useEffect, useState } from "react";

import Image from "next/image";
import { Lock, Eye, EyeOff, Shield, Zap, ArrowRight } from "lucide-react";

export default function page() {
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusInput, setFocusInput] = useState(false);

  useEffect(() => {
    const check = localStorage?.getItem("admin");
    if (check == "true") {
      window.location.href = "/bhailog/hero";
    }
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Replace with your axios call in actual project
      const response = await fetch("/api/admin-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }).then((res) => res.json());

      if (response.success) {
        alert("Welcome bhailog");
        window.location.href = "/bhailog/hero";
        localStorage?.setItem("admin", "true");
      }
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlechnage = (e) => {
    setpassword(e.target.value);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-blue-900 to-cyan-900">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-violet-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/25 to-blue-600/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-r from-violet-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Login Card */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>

          <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8">
            {/* Header Section */}
            <div className="text-center mb-10">
              {/* Logo */}
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-2xl blur-md animate-pulse"></div>
                <div className="relative rounded-2xl w-full h-full flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
                  <Image src={"/logo.png"} width={100} height={100}></Image>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-violet-100 bg-clip-text text-transparent mb-3">
                BHAILOG
              </h1>
              <h2 className="text-xl font-semibold text-white/90 mb-2">
                Admin Portal
              </h2>
              <p className="text-white/60 text-sm">
                Secure access to dashboard
              </p>

              {/* Animated Line */}
              <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div
                  className={`relative bg-white/5 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                    focusInput
                      ? "border-cyan-400/50 shadow-lg shadow-cyan-400/25"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`h-5 w-5 transition-colors duration-300 ${
                        focusInput ? "text-cyan-400" : "text-white/50"
                      }`}
                    />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handlechnage}
                    onFocus={() => setFocusInput(true)}
                    onBlur={() => setFocusInput(false)}
                    placeholder="Enter master password"
                    className="w-full pl-12 pr-14 py-4 bg-transparent text-white placeholder-white/40 focus:outline-none text-lg"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-cyan-400 transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlesubmit}
                disabled={isLoading || !password}
                className={`relative w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden group ${
                  isLoading || !password
                    ? "bg-gray-600/50 cursor-not-allowed text-gray-300"
                    : "bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                }`}
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-center space-x-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>Access Dashboard</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center space-x-2 text-sm text-white/50">
                <Shield className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-8 -left-8 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-8 -right-8 w-3 h-3 bg-violet-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-1/2 -left-12 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 -right-12 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Scan Line Animation */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
    </div>
  );
}
