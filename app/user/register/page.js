"use client";
import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  X,
} from "lucide-react";

export default function RegistrationPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    age: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  // OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!form.age) newErrors.age = "Age is required";
    else if (form.age < 18) newErrors.age = "Must be 18 or older";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/user-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      const data = await response.json();
      console.log("Server response:", data);

      // Store user email for OTP verification
      setUserEmail(form.email);

      // Show OTP modal instead of success alert
      setShowOtpModal(true);
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      const response = await fetch("/api/user-register/otpverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          OTP: otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Account verified successfully! 🎉");
        setShowOtpModal(false);

        // Reset form
        setForm({
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          age: "",
        });
        setOtp("");

        // Redirect to home page
        window.location.href = "/";
      } else {
        alert("isse");
        setOtpError("Invalid OTP. Please try again.");
        throw new Error(data.message || "Failed to verify OTP");
      }
    } catch (err) {
      console.error(err);
      setOtpError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;

    if (value) {
      setOtp(value);
      if (otpError) setOtpError("");
    }
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp("");
    setOtpError("");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(ellipse at top, #f5f5f5 0%, #ffffff 50%, #fafafa 100%)",
      }}
    >
      {/* Animated Background Elements - Light tones */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient orbs - light */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-15"
          style={{
            background:
              "linear-gradient(135deg, #d1d5db 0%, #e5e7eb 50%, #f3f4f6 100%)",
            animationDuration: "6s",
          }}
        ></div>
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse opacity-12"
          style={{
            background:
              "linear-gradient(135deg, #c1c7cd 0%, #e5e7eb 50%, #f3f4f6 100%)",
            animationDelay: "2s",
            animationDuration: "8s",
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse opacity-8"
          style={{
            background:
              "linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 25%, #f9fafb 50%, #ffffff 100%)",
            animationDelay: "1s",
            animationDuration: "10s",
          }}
        ></div>

        {/* Floating elements - light */}
        <div
          className="absolute top-20 right-20 w-32 h-32 rounded-full blur-2xl animate-bounce opacity-20"
          style={{
            background: "linear-gradient(45deg, #d1d5db 0%, #e5e7eb 100%)",
            animationDelay: "3s",
            animationDuration: "4s",
          }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-40 h-40 rounded-full blur-2xl animate-bounce opacity-15"
          style={{
            background: "linear-gradient(225deg, #e5e7eb 0%, #f3f4f6 100%)",
            animationDelay: "5s",
            animationDuration: "5s",
          }}
        ></div>

        {/* Geometric shapes - light */}
        <div
          className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full blur-xl animate-pulse opacity-18"
          style={{
            background: "linear-gradient(90deg, #d1d5db 0%, #e5e7eb 100%)",
            animationDelay: "2.5s",
            animationDuration: "7s",
          }}
        ></div>
      </div>

      {/* Animated Particles - light */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-300 rounded-full animate-ping opacity-30"
          style={{
            animationDelay: "1s",
            animationDuration: "4s",
          }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-gray-400 rounded-full animate-ping opacity-25"
          style={{ animationDelay: "3s", animationDuration: "5s" }}
        ></div>
        <div
          className="absolute top-1/2 right-3/4 w-1.5 h-1.5 bg-gray-300 rounded-full animate-ping opacity-20"
          style={{
            animationDelay: "2s",
            animationDuration: "6s",
          }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-gray-400 rounded-full animate-ping opacity-22"
          style={{
            animationDelay: "4s",
            animationDuration: "7s",
          }}
        ></div>
      </div>

      {/* Floating geometric lines - light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-20 w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-15 animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        ></div>
        <div
          className="absolute bottom-40 right-40 w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-12 animate-pulse"
          style={{ animationDelay: "3s", animationDuration: "6s" }}
        ></div>
      </div>

      <div
        className={`relative w-full max-w-2xl transform transition-all duration-1000 z-10 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-6xl font-bold mb-6 drop-shadow-2xl tracking-tight animate-pulse"
            style={{
              background:
                "linear-gradient(135deg, #000000 0%, #1f2937 25%, #374151 50%, #4b5563 75%, #6b7280 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 30px rgba(0, 0, 0, 0.2)",
              animationDuration: "3s",
            }}
          >
            Join Our Platform
          </h1>
          <p
            className="text-gray-600 text-xl drop-shadow-lg font-light tracking-wide animate-fade-in"
            style={{
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
              animationDelay: "0.5s",
            }}
          >
            Create your account to get started
          </p>
        </div>

        {/* Form Container */}
        <div
          className="backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border transform hover:scale-[1.02] transition-all duration-700 group relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.85) 50%, rgba(255, 255, 255, 0.9) 100%)",
            borderColor: "rgba(6, 6, 6, 0.63)",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(209, 213, 219, 0.2)",
          }}
        >
          {/* Animated border effect - light */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            style={{
              background:
                "linear-gradient(45deg, transparent, rgba(209, 213, 219, 0.2), transparent)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
              padding: "2px",
            }}
          ></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Name Field */}
            <div className="space-y-3 group">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-3 group-hover:text-black transition-all duration-300 tracking-wide">
                <User
                  className="w-5 h-5 group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  style={{ color: "#374151" }}
                />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-5 py-4 rounded-2xl backdrop-blur-sm border-2 text-black placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-500 transform hover:scale-[1.02] focus:scale-[1.02] hover:shadow-2xl ${
                  errors.name
                    ? "border-red-400/60 focus:ring-red-400/20 animate-pulse"
                    : "border-gray-300/40 focus:border-gray-400/60 focus:ring-gray-400/20"
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 249, 250, 0.8) 100%)",
                  border: "1px solid #000",
                }}
              />
              {errors.name && (
                <p className="text-red-500 text-sm animate-pulse">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-3 group">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-3 group-hover:text-black transition-all duration-300 tracking-wide">
                <Mail
                  className="w-5 h-5 group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  style={{ color: "#374151" }}
                />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-5 py-4 rounded-2xl backdrop-blur-sm border-2 text-black placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-500 transform hover:scale-[1.02] focus:scale-[1.02] hover:shadow-2xl ${
                  errors.email
                    ? "border-red-400/60 focus:ring-red-400/20 animate-pulse"
                    : "border-gray-300/40 focus:border-gray-400/60 focus:ring-gray-400/20"
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 249, 250, 0.8) 100%)",
                  border: "1px solid #000",
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm animate-pulse">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-3 group">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-3 group-hover:text-black transition-all duration-300 tracking-wide">
                <Phone
                  className="w-5 h-5 group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  style={{ color: "#374151" }}
                />
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`w-full px-5 py-4 rounded-2xl backdrop-blur-sm border-2 text-black placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-500 transform hover:scale-[1.02] focus:scale-[1.02] hover:shadow-2xl ${
                  errors.phoneNumber
                    ? "border-red-400/60 focus:ring-red-400/20 animate-pulse"
                    : "border-gray-300/40 focus:border-gray-400/60 focus:ring-gray-400/20"
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 249, 250, 0.8) 100%)",
                  border: "1px solid #000",
                }}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm animate-pulse">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Age Field */}
            <div className="space-y-3 group">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-3 group-hover:text-black transition-all duration-300 tracking-wide">
                <Calendar
                  className="w-5 h-5 group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  style={{ color: "#374151" }}
                />
                Age
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter your age"
                min="18"
                max="100"
                className={`w-full px-5 py-4 rounded-2xl backdrop-blur-sm border-2 text-black placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-500 transform hover:scale-[1.02] focus:scale-[1.02] hover:shadow-2xl ${
                  errors.age
                    ? "border-red-400/60 focus:ring-red-400/20 animate-pulse"
                    : "border-gray-300/40 focus:border-gray-400/60 focus:ring-gray-400/20"
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 249, 250, 0.8) 100%)",
                  border: "1px solid #000",
                }}
              />
              {errors.age && (
                <p className="text-red-500 text-sm animate-pulse">
                  {errors.age}
                </p>
              )}
            </div>

            {/* Password Field - Full Width */}
            <div className="md:col-span-2 space-y-3 group">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-3 group-hover:text-black transition-all duration-300 tracking-wide">
                <Lock
                  className="w-5 h-5 group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  style={{ color: "#374151" }}
                />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`w-full px-5 py-4 pr-14 rounded-2xl backdrop-blur-sm border-2 text-black placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-500 transform hover:scale-[1.02] focus:scale-[1.02] hover:shadow-2xl ${
                    errors.password
                      ? "border-red-400/60 focus:ring-red-400/20 animate-pulse"
                      : "border-gray-300/40 focus:border-gray-400/60 focus:ring-gray-400/20"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 249, 250, 0.8) 100%)",
                    border: "1px solid #000",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 hover:scale-125 text-gray-600 opacity-70 hover:opacity-100"
                >
                  {showPassword ? (
                    <EyeOff className="w-6 h-6" />
                  ) : (
                    <Eye className="w-6 h-6" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm animate-pulse">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button - Full Width */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-5 px-8 text-white font-bold text-lg rounded-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0 shadow-2xl relative overflow-hidden group"
                style={{
                  background:
                    "linear-gradient(135deg, #1f2937 0%, #374151 25%, #4b5563 50%, #6b7280 75%, #9ca3af 100%)",
                  border: "1px solid #000",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <span className="relative z-10 drop-shadow-lg">
                    Create Account
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm font-light">
              Already have an account?{" "}
              <button className="font-medium text-gray-800 transition-all duration-300 hover:scale-110 inline-block transform hover:text-black underline decoration-gray-400/30 hover:decoration-gray-600/60">
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs font-light">
            By creating an account, you agree to our{" "}
            <button className="text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-105 inline-block transform underline decoration-gray-400 hover:decoration-gray-600">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-105 inline-block transform underline decoration-gray-400 hover:decoration-gray-600">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div
            className="rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform scale-100 animate-in border relative overflow-hidden group"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.95) 50%, rgba(255, 255, 255, 0.9) 100%)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(209, 213, 219, 0.2)",
              borderColor: "rgba(209, 213, 219, 0.3)",
            }}
          >
            {/* Animated glow effect - light */}
            <div
              className="absolute inset-0 rounded-3xl opacity-20 animate-pulse"
              style={{
                background:
                  "linear-gradient(45deg, transparent, rgba(209, 213, 219, 0.1), transparent)",
                animationDuration: "4s",
              }}
            ></div>

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-black drop-shadow-lg">
                Verify Your Email
              </h3>
              <button
                onClick={closeOtpModal}
                className="text-gray-600 hover:text-black transition-all duration-300 p-1 hover:scale-110 hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 relative z-10">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse border-2"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(209, 213, 219, 0.2) 0%, rgba(209, 213, 219, 0.1) 100%)",
                    borderColor: "rgba(209, 213, 219, 0.3)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Mail className="w-8 h-8 text-gray-700 drop-shadow-lg" />
                </div>
                <p className="text-gray-700">
                  We've sent a verification code to
                </p>
                <p className="font-semibold text-black mt-1 drop-shadow-lg">
                  {userEmail}
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 block">
                  Enter 6-digit code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  maxLength="8"
                  className={`w-full px-4 py-3 text-center text-2xl font-mono rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 text-white placeholder-gray-500 hover:scale-[1.02] focus:scale-[1.02] ${
                    otpError
                      ? "border-red-400/60 focus:ring-red-400/20"
                      : "border-white/20 focus:border-white/40 focus:ring-white/20"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(31, 31, 31, 0.9) 100%)",
                    letterSpacing: "0.3em",
                    boxShadow:
                      "inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(255, 255, 255, 0.05)",
                  }}
                />
                {otpError && (
                  <p className="text-red-400 text-sm animate-pulse">
                    {otpError}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleOtpVerification}
                  disabled={isVerifying || otp.length !== 6}
                  className="w-full py-3 px-6 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #877ef2 0%, #6366f1 50%, #4f46e5 100%)",
                  }}
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify Code"
                  )}
                </button>

                <button
                  onClick={() => {
                    // Here you could add resend OTP functionality
                    alert("Resend functionality would be implemented here");
                  }}
                  className="w-full py-2 px-4 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Didn't receive code? Resend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
