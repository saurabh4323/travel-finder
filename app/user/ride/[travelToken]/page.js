"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Users,
  Clock,
  Car,
  Star,
  Phone,
  User,
  Navigation,
  Loader2,
} from "lucide-react";
import Map from "./Map";
export default function TravelCompanionPage() {
  const { travelToken } = useParams();

  const [travelData, setTravelData] = useState(null);
  const [userDetails, setUserDetails] = useState([]);
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverLoading, setDriverLoading] = useState(false);
  const [searchingDriver, setSearchingDriver] = useState(true);
  const [error, setError] = useState(null);
  const [routeInfo, setRouteInfo] = useState({
    distance: null,
    duration: null,
  });

  // Add missing state variables for location input
  const [sourceQuery, setSourceQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  useEffect(() => {
    if (travelToken) {
      fetchTravelData();
    }
  }, [travelToken]);

  const fetchTravelData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user-travel-start/${travelToken}`);
      const data = await response.json();

      if (data.findtravel) {
        setTravelData(data.findtravel);
        // Set initial values for source and destination
        setSourceQuery(data.findtravel.source || "");
        setDestQuery(data.findtravel.destination || "");

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
        console.log("User API response for token", token, ":", data);
        return data;
      });

      const users = await Promise.all(userPromises);
      const validUsers = users.filter((user) => user && !user.error);
      console.log("Valid users:", validUsers);
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
        console.log("Driver details:", data.data);
      } else {
        console.error("Driver not found or error:", data);
      }
    } catch (err) {
      console.error("Error fetching driver details:", err);
    } finally {
      setDriverLoading(false);
    }
  };

  // Add missing handler functions
  const handleSourceInput = (value) => {
    setSourceQuery(value);
    // Add your location search logic here
    // This would typically call a geocoding API
  };

  const handleDestInput = (value) => {
    setDestQuery(value);
    // Add your location search logic here
    // This would typically call a geocoding API
  };

  const handleSelectSourceSuggestion = (suggestion) => {
    setSourceQuery(suggestion.label);
    setSourceSuggestions([]);
  };

  const handleSelectDestSuggestion = (suggestion) => {
    setDestQuery(suggestion.label);
    setDestSuggestions([]);
  };

  const handleRouteCalculated = (routeData) => {
    setRouteInfo(routeData);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateProgress = () => {
    if (travelData?.completed) return 100;
    if (!travelData?.vehicleNumber) return 0;
    // You can implement more sophisticated progress calculation here
    return 25; // Default progress when journey started
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

            {/* Driver Section */}
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

            {/* Searching Driver Section */}
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
          </div>{" "}
          <div className="lg:col-span-2">
          
              
              <div className="h-full map-container">
                {travelData && (
                  <Map
                    source={travelData.source}
                    destination={travelData.destination}
                    onRouteCalculated={handleRouteCalculated}
                  />
                )}
              
            </div>
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

      {/* Custom Styles */}
      <style jsx>{`
        /* Map container styles */
        .map-container {
          width: 100% !important;
          height: 100%;
        }

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
          .map-container {
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
