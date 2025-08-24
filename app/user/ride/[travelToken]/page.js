"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Users,
  Clock,
  Car,
  Star,
  Phone,
  User,
  Navigation,
  Loader2,
  Route,
} from "lucide-react";

export default function TravelCompanionPage() {
  const [travelData, setTravelData] = useState(null);
  const [userDetails, setUserDetails] = useState([]);
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverLoading, setDriverLoading] = useState(false);
  const [searchingDriver, setSearchingDriver] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

  // Get travelToken from URL params
  const params = useParams();
  const travelToken = params?.travelToken;

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (!mapLoaded) {
      // Load Leaflet CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      // Load Leaflet JS
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(link);
        document.head.removeChild(script);
      };
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (travelToken) {
      fetchTravelData();
    }
  }, [travelToken]);

  // Initialize map when data is loaded and Leaflet is available
  useEffect(() => {
    if (
      mapLoaded &&
      travelData &&
      window.L &&
      mapRef.current &&
      !leafletMapRef.current
    ) {
      initializeMap();
    }
  }, [mapLoaded, travelData]);

  const initializeMap = async () => {
    try {
      // Initialize the map centered on India
      const map = window.L.map(mapRef.current).setView([20.5937, 78.9629], 5);

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      leafletMapRef.current = map;

      // Geocode source and destination
      const sourceCoords = await geocodeLocation(travelData.source);
      const destCoords = await geocodeLocation(travelData.destination);

      if (sourceCoords && destCoords) {
        // Add markers
        const sourceMarker = window.L.marker(sourceCoords, {
          icon: createCustomIcon("green", "🏁"),
        }).addTo(map);

        const destMarker = window.L.marker(destCoords, {
          icon: createCustomIcon("red", "🎯"),
        }).addTo(map);

        // Add popups
        sourceMarker.bindPopup(`<strong>Start:</strong> ${travelData.source}`);
        destMarker.bindPopup(
          `<strong>Destination:</strong> ${travelData.destination}`
        );

        // Draw route line
        const routeLine = window.L.polyline([sourceCoords, destCoords], {
          color: travelData.completed ? "green" : "blue",
          weight: 4,
          opacity: 0.8,
          dashArray: travelData.completed ? null : "10, 10",
        }).addTo(map);

        // Add current position marker if journey is in progress
        if (!travelData.completed) {
          const midPoint = [
            (sourceCoords[0] + destCoords[0]) / 2,
            (sourceCoords[1] + destCoords[1]) / 2,
          ];

          const currentMarker = window.L.marker(midPoint, {
            icon: createCustomIcon("blue", "🚗"),
          }).addTo(map);

          currentMarker.bindPopup(
            "<strong>Current Location</strong><br/>Vehicle en route"
          );

          // Animate the marker
          setInterval(() => {
            const lat = midPoint[0] + (Math.random() - 0.5) * 0.01;
            const lng = midPoint[1] + (Math.random() - 0.5) * 0.01;
            currentMarker.setLatLng([lat, lng]);
          }, 3000);
        }

        // Fit map to show both points
        const group = new window.L.featureGroup([sourceMarker, destMarker]);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const createCustomIcon = (color, emoji) => {
    return window.L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-size: 16px;
        ">
          ${emoji}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  const geocodeLocation = async (locationName) => {
    try {
      // Use Nominatim API (free OpenStreetMap geocoding)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationName + ", India"
        )}&format=json&limit=1&countrycodes=IN`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const fetchTravelData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user-travel-start/${travelToken}`);
      const data = await response.json();

      if (data.findtravel) {
        setTravelData(data.findtravel);
        // Fetch user details for each userToken
        if (data.findtravel.userToken) {
          fetchUserDetails(data.findtravel.userToken);
        }
        // Set searching driver status based on completion
        setSearchingDriver(
          !data.findtravel.completed && !data.findtravel.vehicleNumber
        );

        // Fetch driver details if vehicle number exists
        if (data.findtravel.vehicleNumber) {
          fetchDriverDetails(data.findtravel.vehicleNumber);
        }
      } else {
        setError("Travel information not found");
      }
    } catch (err) {
      setError("Failed to fetch travel information");
      console.error("Error fetching travel data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userTokens) => {
    try {
      const userPromises = userTokens.map(async (token) => {
        const response = await fetch(`/api/user-profile/${token}`);
        const data = await response.json();
        console.log("User API response for token", token, ":", data); // Debug log
        return data;
      });

      const users = await Promise.all(userPromises);
      const validUsers = users.filter((user) => user && !user.error);
      console.log("Valid users:", validUsers); // Debug log
      setUserDetails(validUsers);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const fetchDriverDetails = async (vehicleNumber) => {
    try {
      setDriverLoading(true);
      const response = await fetch(`/api/driver-register/${vehicleNumber}`);
      const data = await response.json();

      if (data && !data.error) {
        setDriverDetails(data);
        console.log("Driver details:", data.data); // Debug log
      } else {
        console.error("Driver not found or error:", data);
      }
    } catch (err) {
      console.error("Error fetching driver details:", err);
    } finally {
      setDriverLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateProgress = () => {
    if (!travelData) return 0;
    if (travelData.completed) return 100;
    if (!travelData.vehicleNumber) return 0;
    return Math.random() * 40 + 30; // Simulate progress between 30-70%
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-600">Loading travel information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Travel Companions Section */}
          <div className="lg:col-span-1">
            <div
              className="border border-gray-200 rounded-lg shadow-sm p-6 mb-6"
              style={{ backgroundColor: "#fffef9" }}
            >
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-black mr-2" />
                <h2 className="text-xl font-semibold text-black">
                  Travel Companions
                </h2>
              </div>

              {userDetails.length > 0 ? (
                <div className="space-y-4">
                  {userDetails.map((user, index) => (
                    <div
                      key={index}
                      className="relative border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-30 transform translate-x-6 -translate-y-6"></div>

                      {/* Header with avatar and name */}
                      <div className="relative flex items-center mb-4">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full h-14 w-14 flex items-center justify-center mr-4 shadow-lg">
                          <span className="text-lg font-bold">
                            {user.data?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "T"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {user.data?.name || `Traveler ${index + 1}`}
                          </h3>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                              Travel Companion
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact information */}
                      <div className="space-y-3">
                        {user.data?.phoneNumber && (
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <Phone className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                Phone
                              </p>
                              <p className="text-sm font-bold text-blue-600">
                                {user.data.phoneNumber}
                              </p>
                            </div>
                          </div>
                        )}

                        {user.data?.age && (
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100">
                            <div className="bg-gray-100 p-2 rounded-lg mr-3">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                Age
                              </p>
                              <p className="text-sm font-bold text-gray-700">
                                {user.data.age} years old
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-b-xl"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No companion details available
                  </p>
                </div>
              )}
            </div>

            {/* Driver Information Section */}
            {travelData?.vehicleNumber && (
              <div
                className="border border-gray-200 rounded-lg shadow-sm p-6"
                style={{ backgroundColor: "#fffef9" }}
              >
                <div className="flex items-center mb-4">
                  <Car className="h-6 w-6 text-black mr-2" />
                  <h2 className="text-xl font-semibold text-black">
                    Your Driver
                  </h2>
                </div>

                {driverLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-black mx-auto mb-3" />
                    <p className="text-gray-500">Loading driver details...</p>
                  </div>
                ) : driverDetails ? (
                  <div className="relative border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-30 transform translate-x-6 -translate-y-6"></div>

                    {/* Header with photo and name */}
                    <div className="relative flex items-center mb-4">
                      {driverDetails.data?.driverPhoto ? (
                        <img
                          src={driverDetails.data.driverPhoto}
                          alt={driverDetails.data?.name || "Driver"}
                          className="h-14 w-14 rounded-full object-cover mr-4 shadow-lg border-2 border-green-200"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full h-14 w-14 flex items-center justify-center mr-4 shadow-lg">
                          <span className="text-lg font-bold">
                            {driverDetails.data?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "D"}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {driverDetails.data?.name || "Driver"}
                        </h3>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                            Your Driver
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Driver details */}
                    <div className="space-y-3">
                      {driverDetails.data?.phoneNumber && (
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                          <div className="bg-green-100 p-2 rounded-lg mr-3">
                            <Phone className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                              Phone
                            </p>
                            <p className="text-sm font-bold text-green-600">
                              {driverDetails.data.phoneNumber}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100">
                        <div className="bg-gray-100 p-2 rounded-lg mr-3">
                          <Car className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                            Vehicle Number
                          </p>
                          <p className="text-sm font-bold text-gray-700 font-mono">
                            {driverDetails.data?.vehicleNumber ||
                              travelData.vehicleNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-b-xl"></div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Driver details not available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Route Progress and Journey Details Section */}
          <div className="lg:col-span-2">
            {/* Route Progress Map */}

            {/* Journey Details */}
            <div
              className="border border-gray-200 rounded-lg shadow-sm p-6 mb-6"
              style={{ backgroundColor: "#fffef9" }}
            >
              <div className="flex items-center mb-4">
                <Navigation className="h-6 w-6 text-black mr-2" />
                <h2 className="text-xl font-semibold text-black">
                  Journey Details
                </h2>
              </div>

              {travelData && (
                <div className="space-y-6">
                  {/* Route Information */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                      <div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-semibold text-black text-lg">
                            {travelData.source}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">To</p>
                          <p className="font-semibold text-black text-lg">
                            {travelData.destination}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center text-gray-600 mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {formatDate(travelData.time)}
                        </span>
                      </div>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          travelData.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {travelData.completed ? "Completed" : "In Progress"}
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  {travelData.vehicleNumber && (
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Car className="h-5 w-5 text-black mr-2" />
                        <h3 className="font-semibold text-black">
                          Vehicle Details
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        Vehicle Number:{" "}
                        <span className="font-mono font-semibold text-black">
                          {travelData.vehicleNumber}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Driver Review */}
                  {travelData.driverReview && (
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Star className="h-5 w-5 text-yellow-500 mr-2" />
                        <h3 className="font-semibold text-black">
                          Driver Review
                        </h3>
                      </div>
                      <p className="text-gray-700">{travelData.driverReview}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {searchingDriver && (
              <div
                className="border border-gray-200 rounded-lg shadow-sm p-6"
                style={{ backgroundColor: "#fffef9" }}
              >
                <div className="text-center py-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Finding your driver...
                  </h3>
                  <p className="text-gray-600">
                    We are searching for the best driver in your area. This
                    usually takes 2-5 minutes.
                  </p>
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              className="border border-gray-200 rounded-lg shadow-sm p-6 mb-6"
              style={{ backgroundColor: "#fffef9" }}
            >
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-black mr-2" />
                <h2 className="text-xl font-semibold text-black">
                  Route Progress
                </h2>
              </div>

              {travelData && (
                <div className="space-y-4">
                  {/* Map Container */}
                  <div className="relative">
                    <div
                      ref={mapRef}
                      className="w-full h-96 rounded-lg border border-gray-200 bg-gray-100 relative overflow-hidden"
                    >
                      {!mapLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">
                              Loading map...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Journey Progress
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          travelData.completed
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : "bg-gradient-to-r from-blue-500 to-blue-600"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Route Info Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-gray-600">
                          Starting Point
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {travelData.source}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            travelData.completed
                              ? "bg-green-500"
                              : "bg-blue-500 animate-pulse"
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-600">
                          Current Status
                        </span>
                      </div>
                      <p
                        className={`font-semibold ${
                          travelData.completed
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {travelData.completed ? "Journey Complete" : "En Route"}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-gray-600">
                          Destination
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {travelData.destination}
                      </p>
                    </div>
                  </div>

                  {/* ETA and Distance Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-600">
                          Estimated Time
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {travelData.completed
                          ? "Completed"
                          : `${Math.round((100 - progress) * 2)} mins`}
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Route className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-600">
                          Distance Covered
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {Math.round(progress * 0.8)} km
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact Button */}
        <div className="fixed bottom-6 right-6">
          <button
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => {
              // Emergency contact functionality
              if (travelData?.emergencyContact) {
                window.open(`tel:${travelData.emergencyContact}`);
              } else {
                window.open(`tel:911`);
              }
            }}
          >
            <Phone className="h-6 w-6" />
          </button>
        </div>

        {/* Share Travel Details Button */}
        <div className="fixed bottom-6 left-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => {
              if (navigator.share && travelData) {
                navigator.share({
                  title: "Travel Details",
                  text: `Journey from ${travelData.source} to ${travelData.destination}`,
                  url: window.location.href,
                });
              } else if (travelData) {
                // Fallback - copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                alert("Travel link copied to clipboard!");
              }
            }}
          >
            <Users className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        .animate-bounce {
          animation: bounce 1.4s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        /* Map container responsiveness */
        @media (max-width: 768px) {
          .leaflet-container {
            height: 250px !important;
          }
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}
