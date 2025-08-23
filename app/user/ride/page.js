"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  ArrowRight,
  Star,
  Clock,
  Calendar,
  Loader2,
  Phone,
  User,
  Mail,
} from "lucide-react";

const UserCard = ({ user, onAccept, onReject }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      if (onAccept) await onAccept(user);
    } catch (error) {
      console.error("Error accepting user:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      if (onReject) await onReject(user);
    } catch (error) {
      console.error("Error rejecting user:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {user.name || "Anonymous User"}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Verified</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{user.phoneNumber || "Not provided"}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{user.email || "Not provided"}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Age: {user.age || "Not specified"}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Reject"
          )}
        </button>
        <button
          onClick={handleAccept}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Accept"
          )}
        </button>
      </div>
    </div>
  );
};

const MatchedPopup = ({ isOpen, onClose, data, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Travel Companion Matched!
          </h3>
          <p className="text-gray-600">
            You've successfully matched with a travel companion.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">From:</span>
              <span className="font-medium">{data?.source}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">To:</span>
              <span className="font-medium">{data?.destination}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Travel Token:</span>
              <span className="font-medium text-xs">{data?.travelToken}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default function RoamTogether() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foundUsers, setFoundUsers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [showMatchedPopup, setShowMatchedPopup] = useState(false);
  const [matchedData, setMatchedData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [dataaccept, setdataccept] = useState({
    source: "",
    destination: "",
    travelToken: "",
    userToken: [],
    completed: "",
    time: "",
    vehicleNumber: "",
    driverReview: "",
  });

  // Update dataaccept when locations change
  useEffect(() => {
    setdataccept(prev => ({
      ...prev,
      source: fromLocation,
      destination: toLocation
    }));
  }, [fromLocation, toLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromLocation || !toLocation) {
      setSubmitError("Please fill in both departure and destination locations");
      return;
    }

    if (isScheduled && (!travelDate || !travelTime)) {
      setSubmitError("Please fill in travel date and time for scheduled trips");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setFoundUsers([]);

    try {
      // Get user token
      let userToken;
      try {
        const storedToken =
          typeof window !== "undefined" && window.localStorage
            ? window.localStorage.getItem("rider")
            : null;
        userToken = storedToken || "default-user-token";
      } catch (error) {
        userToken = "default-user-token";
      }

      const requestData = {
        userToken,
        fromLocation,
        toLocation,
        isScheduled,
        ...(isScheduled && { travelDate, travelTime }),
      };

      console.log("Sending travel request:", requestData);

      const response = await fetch("/api/user-travel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Initial response:", data);

      if (data.message === "congo") {
        setIsLoadingProfiles(true);
        setShowResults(true);
        
        // Update dataaccept with the response data
        setdataccept(prev => ({
          ...prev,
          source: data.src,
          destination: data.des,
          travelToken: data.traveltoken,
          userToken: [data.data]
        }));

        try {
          console.log("Fetching profile for user token:", data.data);

          const profileResponse = await fetch(
            `/api/user-profile/${data.data}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log("Profile data received:", profileData);

            // Handle both single user and array of users
            if (profileData.data) {
              const users = Array.isArray(profileData.data)
                ? profileData.data
                : [profileData.data];
              setFoundUsers(users);
              console.log("Setting found users:", users);
            } else {
              setFoundUsers([]);
            }
          } else {
            console.error("Profile fetch failed:", profileResponse.status);
            setFoundUsers([]);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setFoundUsers([]);
        } finally {
          setIsLoadingProfiles(false);
        }
      } else {
        setFoundUsers([]);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError("Failed to find travel companions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSearch = () => {
    setShowResults(false);
    setFoundUsers([]);
    setSubmitError("");
    setIsLoadingProfiles(false);
    setSuccessMessage("");
    setShowMatchedPopup(false);
    setMatchedData(null);
  };

  const handleViewDetails = () => {
    setShowMatchedPopup(false);
    // You can add navigation logic here or show more detailed information
    console.log("Viewing details for matched travel:", matchedData);
  };

  const handleAcceptUser = async (user) => {
    console.log("Accepting user:", user);
    
    try {
      // Add the accepted user token to the userToken array
      const updatedUserTokens = [...dataaccept.userToken, user.userToken || user._id];
      
      // Update the dataaccept state
      const updatedDataAccept = {
        ...dataaccept,
        userToken: updatedUserTokens,
        completed: false,
        time: isScheduled ? `${travelDate}T${travelTime}:00.000Z` : new Date().toISOString(),
        vehicleNumber: "",
        driverReview: "",
      };
      
      setdataccept(updatedDataAccept);
      
      // Call the user-matched API
      const response = await fetch("/api/user-travel/user-matched", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDataAccept),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("User matched successfully:", data);
        setMatchedData(data);
        setShowMatchedPopup(true);
        setSuccessMessage("Travel companion accepted successfully!");
      } else {
        console.error("Failed to match user:", response.status);
        // You can add error handling here
      }
    } catch (error) {
      console.error("Error accepting user:", error);
      // You can add error handling here
    }
  };

  const handleRejectUser = async (user) => {
    console.log("Rejecting user:", user);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={resetSearch}
              className="flex items-center text-gray-600 hover:text-black mb-4 transition-colors"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to search
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-black">
                  {isLoadingProfiles
                    ? "Finding travel companions..."
                    : foundUsers.length > 0
                    ? `Found ${foundUsers.length} travel companion${
                        foundUsers.length > 1 ? "s" : ""
                      }`
                    : "No travel companions found"}
                </h1>
                <p className="text-gray-600 mt-2">
                  {foundUsers.length > 0
                    ? `Traveling from ${fromLocation} to ${toLocation}`
                    : isLoadingProfiles
                    ? "Please wait while we search for companions"
                    : "Try adjusting your search criteria or check back later"}
                </p>
              </div>

              {foundUsers.length > 0 && !isLoadingProfiles && (
                <div className="text-right">
                  <div className="text-sm text-gray-500">Sort by</div>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>Closest match</option>
                    <option>Highest rated</option>
                    <option>Nearest location</option>
                    <option>Departure time</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoadingProfiles && (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
                <p className="text-gray-600">Loading companion profiles...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {!isLoadingProfiles && (
            <>
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">{successMessage}</span>
                  </div>
                </div>
              )}

              {foundUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foundUsers.map((user, index) => (
                    <UserCard
                      key={user._id || user.userToken || index}
                      user={user}
                      onAccept={handleAcceptUser}
                      onReject={handleRejectUser}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    No companions found right now
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Do not worry! New travelers join every day. Try creating an
                    alert or checking back later.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      Create Travel Alert
                    </button>
                    <button
                      onClick={resetSearch}
                      className="px-6 py-3 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Try Different Route
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Matched Popup */}
          <MatchedPopup
            isOpen={showMatchedPopup}
            onClose={() => setShowMatchedPopup(false)}
            data={matchedData}
            onConfirm={handleViewDetails}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Form */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                Find your perfect
                <span className="text-gray-600"> travel companion</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with like-minded travelers, share costs, and create
                unforgettable memories together. Safe, verified, and always an
                adventure.
              </p>
            </div>

            {/* Booking Form */}
            <div className="bg-gray-50 rounded-2xl shadow-xl border border-gray-200 p-8 space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-black">
                  Plan your journey
                </h2>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-red-800 text-sm">{submitError}</div>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    id="from-location"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Enter your starting location"
                    className="w-full pl-10 text-black pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm bg-white"
                  />
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-black" />
                  <input
                    id="to-location"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Where are you going?"
                    className="w-full pl-10 text-black pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm bg-white"
                  />
                </div>

                {/* Travel Time Options */}
                <div>
                  <label className="block text-sm font-medium text-black mb-3">
                    When
                  </label>

                  <div className="flex bg-gray-200 rounded-lg p-1 mb-4">
                    <button
                      type="button"
                      onClick={() => setIsScheduled(false)}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        !isScheduled
                          ? "bg-white text-black shadow-sm"
                          : "text-black hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Right now</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsScheduled(true)}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        isScheduled
                          ? "bg-white text-black shadow-sm"
                          : "text-black hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Schedule</span>
                      </div>
                    </button>
                  </div>

                  {isScheduled && (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm bg-white"
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <input
                        type="time"
                        value={travelTime}
                        onChange={(e) => setTravelTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm bg-white"
                      />
                    </div>
                  )}

                  {!isScheduled && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-green-800">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Finding companions available now
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!fromLocation || !toLocation || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Find Travel Companions</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="lg:pl-8">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div className="aspect-[4/5] relative">
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0">
                      {/* Sky gradient */}
                      <div className="h-1/2 bg-gradient-to-b from-gray-300 to-gray-400"></div>
                      {/* Ground */}
                      <div className="h-1/2 bg-gradient-to-t from-gray-400 via-gray-300 to-gray-400"></div>

                      {/* Mountains */}
                      <div className="absolute bottom-1/2 left-0 right-0 h-32">
                        <svg viewBox="0 0 400 100" className="w-full h-full">
                          <path
                            d="M0,100 L0,60 L50,20 L100,40 L150,15 L200,35 L250,10 L300,30 L350,25 L400,45 L400,100 Z"
                            fill="rgba(0, 0, 0, 0.8)"
                          />
                          <path
                            d="M0,100 L0,70 L60,30 L120,50 L180,25 L240,45 L300,20 L360,40 L400,35 L400,100 Z"
                            fill="rgba(0, 0, 0, 0.6)"
                          />
                        </svg>
                      </div>

                      {/* Sun */}
                      <div className="absolute top-8 right-16 w-16 h-16 bg-gray-300 rounded-full shadow-lg"></div>

                      {/* Clouds */}
                      <div className="absolute top-12 left-8 w-20 h-8 bg-white rounded-full opacity-80"></div>
                      <div className="absolute top-20 left-32 w-16 h-6 bg-white rounded-full opacity-60"></div>
                      <div className="absolute top-16 right-32 w-12 h-5 bg-white rounded-full opacity-70"></div>
                    </div>

                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-8">
                      <div className="text-white space-y-2">
                        <h3 className="text-2xl font-bold">Explore Together</h3>
                        <p className="text-white/90">
                          Join thousands of travelers making new connections
                        </p>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-8 left-8 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>

                    {/* Travel Icons */}
                    <div className="absolute top-1/3 right-8 w-12 h-12 bg-white/30 rounded-full backdrop-blur-sm flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>

                    <div className="absolute bottom-1/3 left-16 w-10 h-10 bg-white/25 rounded-full backdrop-blur-sm flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MatchedPopup
        isOpen={showMatchedPopup}
        onClose={() => setShowMatchedPopup(false)}
        data={matchedData}
        onConfirm={handleViewDetails}
      />
    </div>
  );
}
