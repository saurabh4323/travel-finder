"use client";
import React, { useState, useEffect } from "react";
import {
  Car,
  Users,
  Mountain,
  ArrowRight,
  Star,
  Shield,
  Clock,
  MapPin,
  Heart,
  Compass,
  ChevronLeft,
  ChevronRight,
  Camera,
  Award,
  Globe,
  Plane,
  TreePine,
  Coffee,
} from "lucide-react";

const HomePage = () => {
  const [currentTrip, setCurrentTrip] = useState(0);

  const trips = [
    {
      id: 1,
      title: "Mountain Adventure",
      location: "Swiss Alps",
      image: "/image2.png",
      rating: 4.9,
      duration: "5 days",
      price: "$299",
      type: "Adventure",
    },
    {
      id: 2,
      title: "Beach Paradise",
      location: "Maldives",
      image: "/image2.png",
      rating: 4.8,
      duration: "7 days",
      price: "$599",
      type: "Relaxation",
    },
  ];

  const nextTrip = () => {
    setCurrentTrip((prev) => (prev + 1) % trips.length);
  };

  const prevTrip = () => {
    setCurrentTrip((prev) => (prev - 1 + trips.length) % trips.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTrip, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      {/* Decorative patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-rose-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}

      {/* Hero Section - Split 60/40 */}
      <section
        className="relative overflow-hidden py-20 lg:py-32"
        style={{ backgroundColor: "#fffef9" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left Content - 60% */}
            <div className="lg:col-span-3">
              <div className="relative">
                <h1 className="text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
                  Go anywhere with
                  <span className="text-6xl font-extrabold bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent animate-gradient-move">
                    Tripy
                  </span>
                </h1>

                <div className="w-24 h-1 bg-gradient-to-r from-gray-800 to-black rounded-full mb-6"></div>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Connect with verified travelers, share memorable journeys, and
                  explore the world together while saving money and making new
                  friends.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-4 bg-black text-white rounded-xl text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-gray-900">
                    Start Your Journey
                  </button>
                  <button className="px-8 py-4 border-2 border-gray-400 text-gray-800 rounded-xl text-lg font-semibold hover:border-black hover:text-black hover:bg-gray-50 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Right Image - 40% */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-600/20 rounded-3xl blur-xl"></div>
                <img
                  src="/image1.png"
                  alt="Travel Adventure"
                  className="relative w-full h-96 object-cover rounded-3xl shadow-2xl"
                />
                <div
                  className="absolute -bottom-6 -left-6 p-4 rounded-2xl shadow-xl border border-gray-200"
                  style={{ backgroundColor: "#fffef9" }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-black rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">5,000+</p>
                      <p className="text-sm text-gray-600">Happy Travelers</p>
                    </div>
                  </div>
                </div>
                <div
                  className="absolute -top-6 -right-6 p-3 rounded-xl shadow-lg border border-gray-200"
                  style={{ backgroundColor: "#fffef9" }}
                >
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-gray-800 fill-current" />
                    <span className="font-semibold text-black">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </section>
      {/* Services Section */}
      <section id="services" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our range of travel sharing solutions designed for
              modern travelers
            </p>
          </div>

          {/* Service 1 - Shared Rides */}
          <div className="mb-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-xl"></div>
                  <div className="relative w-full h-80 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Car className="w-24 h-24 text-white" />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                        <div className="flex items-center space-x-2 text-white">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Bhopal → Delhi
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-white mt-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">2 hours saved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                    <Car className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">
                    Shared Rides
                  </h3>
                </div>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Save up to 60% on rides by sharing with verified travelers
                  going your way. Experience comfort, safety, and great
                  conversations.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Instant matching with compatible travelers
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Real-time tracking and updates
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Secure in-app payments
                    </span>
                  </div>
                </div>
                <button className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all font-semibold">
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Service 2 - Travel Partners */}
          <div className="mb-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-200 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">
                    Travel Partners
                  </h3>
                </div>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Connect with like-minded people for memorable journeys and
                  experiences. Build lasting friendships through shared
                  adventures.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Smart profile matching algorithm
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Interest-based pairing system
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Safe and verified connections
                    </span>
                  </div>
                </div>
                <button className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all font-semibold">
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl blur-xl"></div>
                  <div className="relative w-full h-80 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Users className="w-24 h-24 text-white" />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                        <div className="flex items-center space-x-2 text-white">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            3 new matches
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-white mt-1">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">4.9 avg rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trips Finder Section with Swiper */}
      <section
        id="trips"
        className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                  <Compass className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-white">Trip Finder</h3>
              </div>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Discover amazing destinations and find travel companions for
                your next adventure. From mountain peaks to city lights, find
                your perfect journey.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                  <span className="text-slate-300 font-medium">
                    Curated destination recommendations
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                  <span className="text-slate-300 font-medium">
                    Flexible travel dates matching
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                  <span className="text-slate-300 font-medium">
                    Budget-friendly group options
                  </span>
                </div>
              </div>
              <button className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all font-semibold">
                <span>Explore Trips</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right Swiper */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <div className="relative h-96">
                  <div
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentTrip * 100}%)` }}
                  >
                    {trips.map((trip, index) => (
                      <div key={trip.id} className="min-w-full h-full relative">
                        <img
                          src={trip.image}
                          alt={trip.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xl font-bold text-gray-900">
                                {trip.title}
                              </h4>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-gray-700">
                                  {trip.rating}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600 mb-3">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{trip.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                  {trip.type}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {trip.duration}
                                </span>
                              </div>
                              <span className="text-lg font-bold text-emerald-600">
                                {trip.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <button
                onClick={prevTrip}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextTrip}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Dots indicator */}
              <div className="flex justify-center space-x-2 mt-6">
                {trips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTrip(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTrip
                        ? "bg-emerald-500 w-8"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Gallery */}
      <section className="py-20 bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose TravelShare?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Experience the future of travel sharing with our premium features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                100% Verified
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All travelers are thoroughly verified through our advanced
                screening process for your safety and peace of mind.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-200 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Instant Booking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Find and book your perfect travel companion in seconds with our
                smart matching algorithm.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-teal-200 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Star className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Top Rated
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Join thousands of satisfied travelers who have rated us 4.9/5
                for safety, reliability, and experience.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-200 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Global Network
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access our worldwide community of travelers in over 50 countries
                and 200+ cities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Image Gallery */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Travel Experiences
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-slate-300">
              Discover the world through the eyes of fellow travelers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop"
                alt="Mountain landscape"
                className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all">
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 text-white">
                    <Mountain className="w-4 h-4" />
                    <span className="text-sm font-medium">Mountains</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop"
                alt="City skyline"
                className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all">
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 text-white">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Cities</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=300&fit=crop"
                alt="Beach sunset"
                className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all">
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 text-white">
                    <Plane className="w-4 h-4" />
                    <span className="text-sm font-medium">Beaches</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop"
                alt="Forest adventure"
                className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all">
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 text-white">
                    <TreePine className="w-4 h-4" />
                    <span className="text-sm font-medium">Nature</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all font-semibold">
              <Camera className="w-5 h-5" />
              <span>Share Your Journey</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-rose-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-rose-500/5"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Ready to Start Your
            <span className="block bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
              Adventure?
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Join thousands of travelers who have discovered the joy of shared
            journeys. Your next adventure is just one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-xl text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all">
              Get Started Today
            </button>
            <button className="px-10 py-5 border-2 border-gray-300 text-gray-700 rounded-xl text-lg font-semibold hover:border-rose-600 hover:text-rose-600 transition-colors">
              Download App
            </button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-amber-400/30 to-rose-400/30 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                  TravelShare
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                Connecting travelers worldwide for memorable journeys and
                lasting friendships.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <Heart className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  Shared Rides
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Travel Partners
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Trip Planning
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Group Tours
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  Help Center
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Safety
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Trust & Safety
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Contact Us
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Careers
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Press
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Blog
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 TravelShare. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
