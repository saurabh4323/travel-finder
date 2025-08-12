"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Car,
  MapPin,
  Route,
  TrendingUp,
  Eye,
  ArrowRight,
} from "lucide-react";
import Navbarbhai from "../Navbarbhai";

export default function DashboardPage() {
  const [data, setData] = useState({
    drivers: [],
    users: [],
    trips: [],
    travels: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [driversRes, usersRes, tripsRes, travelsRes] = await Promise.all([
        fetch("/api/driver-regiser").then((res) => (res.ok ? res.json() : [])),
        fetch("/api/user-regiser").then((res) => (res.ok ? res.json() : [])),
        fetch("/api/trip").then((res) => (res.ok ? res.json() : [])),
        fetch("/api/user-travel").then((res) => (res.ok ? res.json() : [])),
      ]);

      setData({
        drivers: driversRes || [],
        users: usersRes || [],
        trips: tripsRes || [],
        travels: travelsRes || [],
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard data");
      // Set mock data for demo purposes
      setData({
        drivers: new Array(124).fill({}),
        users: new Array(1456).fill({}),
        trips: new Array(89).fill({}),
        travels: new Array(234).fill({}),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCardClick = (route) => {
    // Implement navigation logic here
    console.log(`Navigating to ${route}`);
    // Example: router.push(route) or window.location.href = route
  };

  const dashboardCards = [
    {
      id: "users",
      title: "Total Users",
      subtitle: "Registered customers",
      count: data.users.length,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      route: "/users",
      description: "Active user accounts in the system",
    },
    {
      id: "drivers",
      title: "Active Drivers",
      subtitle: "Verified drivers",
      count: data.drivers.length,
      icon: Car,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      route: "/drivers",
      description: "Licensed and verified drivers",
    },
    {
      id: "trips",
      title: "Total Trips",
      subtitle: "Completed journeys",
      count: data.trips.length,
      icon: Route,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      route: "/trips",
      description: "Successfully completed trips",
    },
    {
      id: "travels",
      title: "Travel Bookings",
      subtitle: "Scheduled travels",
      count: data.travels.length,
      icon: MapPin,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      route: "/travels",
      description: "Upcoming and active bookings",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-blue-800">
        <Navbarbhai />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-6 animate-pulse"
              >
                <div className="h-12 w-12 bg-white/20 rounded-xl mb-4"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-8 bg-white/20 rounded mb-2"></div>
                <div className="h-3 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-blue-800">
      <Navbarbhai />

      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-cyan-200 text-lg">
            Monitor your platform's key metrics and performance
          </p>

          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
              {error} (Showing demo data)
            </div>
          )}
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 hover:bg-white/20"
                onClick={() => handleCardClick(card.route)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  {/* Icon and Title Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>

                  {/* Count Display */}
                  <div className="mb-3">
                    <h3 className="text-3xl font-bold text-white mb-1">
                      {loading ? "..." : card.count.toLocaleString()}
                    </h3>
                    <p className="text-cyan-100 font-semibold text-lg">
                      {card.title}
                    </p>
                    <p className="text-cyan-200 text-sm">{card.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4">
                    {card.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                    <div
                      className={`bg-gradient-to-r ${card.color} h-2 rounded-full transition-all duration-1000`}
                      style={{
                        width: `${Math.min((card.count / 100) * 10, 100)}%`,
                      }}
                    ></div>
                  </div>

                  {/* View Details Link */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cyan-400 font-medium">
                      View Details
                    </span>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-xs">+12%</span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Eye className="w-6 h-6 mr-2 text-cyan-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: "Add Driver",
                color:
                  "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
              },
              {
                name: "New Trip",
                color:
                  "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700",
              },
              {
                name: "Manage Users",
                color:
                  "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700",
              },
              {
                name: "View Reports",
                color:
                  "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700",
              },
            ].map((action) => (
              <button
                key={action.name}
                className={`${action.color} text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105`}
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
