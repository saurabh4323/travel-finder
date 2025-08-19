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
  Car,
  Users,
  MapPin,
  Shield,
  Clock,
  Star,
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
    e?.preventDefault && e.preventDefault();

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="bg-black p-3 rounded-xl">
              <Car size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black">Roam Together</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join Our Platform
            </h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          <div className="space-y-6">
            {/* First Row: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <User size={16} className="mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 ${
                    errors.name ? "border-red-400 focus:ring-red-400" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Mail size={16} className="mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 ${
                    errors.email ? "border-red-400 focus:ring-red-400" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Second Row: Phone and Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Phone size={16} className="mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 ${
                    errors.phoneNumber
                      ? "border-red-400 focus:ring-red-400"
                      : ""
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Age Field */}
              <div>
                <label
                  htmlFor="age"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar size={16} className="mr-2" />
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 ${
                    errors.age ? "border-red-400 focus:ring-red-400" : ""
                  }`}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                )}
              </div>
            </div>

            {/* Third Row: Password (Full Width) */}
            <div>
              <label
                htmlFor="password"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Lock size={16} className="mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 ${
                    errors.password ? "border-red-400 focus:ring-red-400" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 mt-8">
            Already have an account?{" "}
            <button
              type="button"
              className="text-black hover:underline font-semibold"
              onClick={() => {
                window.location.href = "/user/login";

                console.log("Navigate to login page");
              }}
            >
              Sign in here
            </button>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our{" "}
            <button className="hover:underline">Terms of Service</button> and{" "}
            <button className="hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>

      {/* Right Side - Custom Designed Visual Section */}
      <div className="hidden lg:flex lg:flex-1 bg-black relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>

          {/* Custom SVG Road Pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 400 600"
          >
            <defs>
              <pattern
                id="roadPattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M50,0 L50,100"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="10,10"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="400" height="600" fill="url(#roadPattern)" />

            {/* Curved Roads */}
            <path
              d="M0,100 Q200,150 400,200"
              stroke="white"
              strokeWidth="3"
              fill="none"
              opacity="0.2"
              strokeDasharray="15,15"
            />
            <path
              d="M0,300 Q150,250 300,300 Q350,320 400,350"
              stroke="white"
              strokeWidth="2"
              fill="none"
              opacity="0.15"
              strokeDasharray="10,10"
            />
            <path
              d="M0,500 Q100,450 200,500 Q300,550 400,520"
              stroke="white"
              strokeWidth="2"
              fill="none"
              opacity="0.1"
              strokeDasharray="8,8"
            />
          </svg>

          {/* Floating Elements */}
          <div className="absolute top-20 left-16 w-4 h-4 bg-white rounded-full opacity-20 animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-6 h-6 bg-white rounded-full opacity-15 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/3 w-3 h-3 bg-white rounded-full opacity-25 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-5 h-5 bg-white rounded-full opacity-10 animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4 mb-12">
            <div className="relative">
              <div className="bg-white p-4 rounded-2xl">
                <Car size={32} className="text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Roam Together</h1>
              <p className="text-gray-400 text-sm">Ride • Share • Connect</p>
            </div>
          </div>

          {/* Custom Journey Creation Illustration */}
          <div className="relative mb-12">
            <div className="w-80 h-72 relative">
              {/* Registration Process Visual */}
              <div className="absolute top-0 w-full">
                {/* Step indicators */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <User size={20} className="text-white" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Sign Up</p>
                  </div>
                  <div className="flex-1 h-1 bg-gray-700 mx-4 relative">
                    <div
                      className="absolute inset-0 bg-blue-500 rounded animate-pulse"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
                      <Shield size={20} className="text-white" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Verify</p>
                  </div>
                  <div className="flex-1 h-1 bg-gray-700 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
                      <Car size={20} className="text-white" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Start</p>
                  </div>
                </div>
              </div>

              {/* Community illustration */}
              <div className="absolute bottom-0 w-full h-40">
                {/* Road Base */}
                <div className="absolute bottom-0 w-full h-20 bg-gray-800 rounded-lg"></div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-white opacity-30"></div>

                {/* Multiple cars representing community */}
                <div className="absolute bottom-16 left-4 transform">
                  <div className="w-12 h-6 bg-blue-500 rounded-lg relative shadow-lg animate-bounce">
                    <div className="absolute -top-1 left-1 w-10 h-3 bg-blue-400 rounded-t-lg"></div>
                    <div className="absolute -bottom-1 left-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div className="absolute -bottom-1 right-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute bottom-16 left-1/4 transform">
                  <div
                    className="w-12 h-6 bg-green-500 rounded-lg relative shadow-lg animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <div className="absolute -top-1 left-1 w-10 h-3 bg-green-400 rounded-t-lg"></div>
                    <div className="absolute -bottom-1 left-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div className="absolute -bottom-1 right-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute bottom-16 right-1/4 transform">
                  <div
                    className="w-12 h-6 bg-purple-500 rounded-lg relative shadow-lg animate-bounce"
                    style={{ animationDelay: "0.6s" }}
                  >
                    <div className="absolute -top-1 left-1 w-10 h-3 bg-purple-400 rounded-t-lg"></div>
                    <div className="absolute -bottom-1 left-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div className="absolute -bottom-1 right-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute bottom-16 right-4 transform">
                  <div
                    className="w-12 h-6 bg-orange-500 rounded-lg relative shadow-lg animate-bounce"
                    style={{ animationDelay: "0.9s" }}
                  >
                    <div className="absolute -top-1 left-1 w-10 h-3 bg-orange-400 rounded-t-lg"></div>
                    <div className="absolute -bottom-1 left-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div className="absolute -bottom-1 right-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Connection lines between cars */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 320 280"
              >
                <path
                  d="M60,200 Q120,180 180,200"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                  strokeDasharray="3,3"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-12"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
                <path
                  d="M120,200 Q180,180 240,200"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                  strokeDasharray="3,3"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-12"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </path>
                <path
                  d="M180,200 Q240,180 300,200"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                  strokeDasharray="3,3"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-12"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md">
            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-3 rounded-xl text-center border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
              <div className="w-8 h-8 bg-blue-500 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield size={14} className="text-white" />
              </div>
              <p className="text-xs text-gray-300 font-medium">Secure</p>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-3 rounded-xl text-center border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
              <div className="w-8 h-8 bg-green-500 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock size={14} className="text-white" />
              </div>
              <p className="text-xs text-gray-300 font-medium">24/7</p>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-3 rounded-xl text-center border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
              <div className="w-8 h-8 bg-yellow-500 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star size={14} className="text-white" />
              </div>
              <p className="text-xs text-gray-300 font-medium">Rated</p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black">
                Verify Your Email
              </h3>
              <button
                onClick={closeOtpModal}
                className="text-gray-600 hover:text-black transition-all duration-300 p-1 hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-700">
                  We have sent a verification code to
                </p>
                <p className="font-semibold text-black mt-1">{userEmail}</p>
              </div>

              {/* OTP Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">
                  Enter 6-digit code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  maxLength="6"
                  className={`w-full px-4 py-3 text-center text-2xl font-mono rounded-lg border-2 focus:outline-none focus:ring-4 transition-all duration-300 ${
                    otpError
                      ? "border-red-400 focus:ring-red-400/20"
                      : "border-gray-300 focus:border-black focus:ring-black/20"
                  }`}
                />
                {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleOtpVerification}
                  disabled={isVerifying || otp.length !== 6}
                  className="w-full py-3 px-6 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-full py-2 px-4 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Did not receive code? Resend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
