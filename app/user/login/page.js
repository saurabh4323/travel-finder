"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Car, Users, MapPin } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    // console.log("clciked 1");
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // console.log("clciked 2");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Handle successful login
      window.location.href = "/";
      // Redirect or handle success as needed
      // router.push('/dashboard');
    } catch (error) {
      setError(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Custom Designed Visual Section */}
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

          {/* Custom Car Journey Illustration */}
          <div className="relative mb-12">
            <div className="w-80 h-60 relative">
              {/* Road Base */}
              <div className="absolute bottom-0 w-full h-20 bg-gray-800 rounded-lg"></div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-white opacity-30"></div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white opacity-40 rounded"></div>

              {/* Cars */}
              <div className="absolute bottom-16 left-8 transform">
                <div className="w-16 h-8 bg-blue-500 rounded-lg relative shadow-lg">
                  <div className="absolute -top-2 left-2 w-12 h-4 bg-blue-400 rounded-t-lg"></div>
                  <div className="absolute -bottom-2 left-1 w-3 h-3 bg-gray-800 rounded-full"></div>
                  <div className="absolute -bottom-2 right-1 w-3 h-3 bg-gray-800 rounded-full"></div>
                </div>
              </div>

              <div className="absolute bottom-16 right-8 transform">
                <div className="w-16 h-8 bg-green-500 rounded-lg relative shadow-lg">
                  <div className="absolute -top-2 left-2 w-12 h-4 bg-green-400 rounded-t-lg"></div>
                  <div className="absolute -bottom-2 left-1 w-3 h-3 bg-gray-800 rounded-full"></div>
                  <div className="absolute -bottom-2 right-1 w-3 h-3 bg-gray-800 rounded-full"></div>
                </div>
              </div>

              {/* People Icons */}
              <div className="absolute top-4 left-1/4 transform">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm animate-bounce">
                  <Users size={20} className="text-white" />
                </div>
              </div>

              <div className="absolute top-4 right-1/4 transform">
                <div
                  className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  <MapPin size={20} className="text-white" />
                </div>
              </div>

              {/* Connection Lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 320 240"
              >
                <path
                  d="M80,60 Q160,20 240,60"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.4"
                  strokeDasharray="5,5"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-20"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          </div>

          <div className="text-center max-w-sm mb-8">
            <h2 className="text-2xl font-bold mb-3">Welcome Back!</h2>
            <p className="text-gray-300 leading-relaxed">
              Your journey continues here. Connect with fellow travelers and
              explore new destinations together.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-4 rounded-xl text-center border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
              <div className="w-10 h-10 bg-blue-500 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users size={16} className="text-white" />
              </div>
              <p className="text-xs text-gray-300 font-medium">Safe Rides</p>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-4 rounded-xl text-center border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
              <div className="w-10 h-10 bg-green-500 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin size={16} className="text-white" />
              </div>
              <p className="text-xs text-gray-300 font-medium">Easy Routes</p>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-4 rounded-xl text-center border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
              <div className="w-10 h-10 bg-purple-500 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-2">
                <Car size={16} className="text-white" />
              </div>
              <p className="text-xs text-gray-300 font-medium">Smart Match</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="bg-black p-3 rounded-xl">
              <Car size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black">Roam Together</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sign In to Your Account
            </h2>
            <p className="text-gray-600">
              Welcome back! Please enter your details
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* Password Field */}
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-black hover:underline font-medium"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-8">
            Do not have an account?{" "}
            <button
              type="button"
              className="text-black hover:underline font-semibold"
              onClick={() => {
                // Handle navigation to registration page
                // router.push('/register');

                window.location.href = "/user/register";

                console.log("Navigate to register page");
              }}
            >
              Sign up here
            </button>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By signing in, you agree to our{" "}
            <button className="hover:underline">Terms of Service</button> and{" "}
            <button className="hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}
