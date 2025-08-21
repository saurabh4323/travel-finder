"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  Users,
  Search,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Calendar,
  X,
  Loader2,
  Navigation,
} from "lucide-react";

// Location Input Component with Dynamic Location Detection
function LocationInput({
  label,
  value,
  onChange,
  placeholder,
  inputId,
  showCurrentLocation = false,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [recentLocations, setRecentLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const lastQueryRef = useRef("");

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setUserLocation(location);
          setLocationError(null);
          resolve(location);
        },
        (error) => {
          let errorMessage = "Location access denied";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          setLocationError(errorMessage);
          reject(new Error(errorMessage));
        },
        {
          timeout: 15000,
          enableHighAccuracy: true,
          maximumAge: 300000, // 5 minutes cache
        }
      );
    });
  }, []);

  // Initialize user location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        await getCurrentLocation();
      } catch (error) {
        console.log("Could not get initial location:", error.message);
      }
    };

    initializeLocation();
  }, [getCurrentLocation]);

  // Enhanced Nominatim search with location bias
  const searchLocationsNominatim = useCallback(
    async (query, userLoc = null) => {
      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        let url =
          `https://nominatim.openstreetmap.org/search?` +
          `format=json&addressdetails=1&limit=10&` +
          `q=${encodeURIComponent(query)}&` +
          `accept-language=en`;

        // Add location bias if available
        if (userLoc) {
          url += `&lat=${userLoc.lat}&lon=${userLoc.lon}`;
          const latDelta = 0.45;
          const lonDelta = 0.45;
          url += `&viewbox=${userLoc.lon - lonDelta},${
            userLoc.lat + latDelta
          },${userLoc.lon + lonDelta},${userLoc.lat - latDelta}`;
          url += `&bounded=0`; // Don't strictly bound, just prefer
        }

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent": "RoamTogether/1.0 (https://roamtogether.com)",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        return data
          .filter((item) => {
            // Basic quality filters
            if (!item.lat || !item.lon || !item.display_name) return false;

            // Filter by importance score
            if (item.importance && item.importance < 0.1) return false;

            return true;
          })
          .map((item, index) => {
            const address = item.address || {};
            const displayParts = item.display_name
              .split(",")
              .map((part) => part.trim());

            // Calculate distance if user location available
            let distance = null;
            if (userLoc) {
              const lat1 = userLoc.lat;
              const lon1 = userLoc.lon;
              const lat2 = parseFloat(item.lat);
              const lon2 = parseFloat(item.lon);

              const R = 6371; // Earth's radius in km
              const dLat = ((lat2 - lat1) * Math.PI) / 180;
              const dLon = ((lon2 - lon1) * Math.PI) / 180;
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1 * Math.PI) / 180) *
                  Math.cos((lat2 * Math.PI) / 180) *
                  Math.sin(dLon / 2) *
                  Math.sin(dLon / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              distance = R * c;
            }

            return {
              id: `nominatim-${item.place_id}`,
              display_name: item.display_name,
              name: displayParts[0] || item.name,
              type: item.type || item.class || "location",
              address: item.display_name,
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon),
              country: address.country,
              state: address.state,
              city: address.city || address.town || address.village,
              importance: item.importance || 0,
              distance: distance,
              source: "nominatim",
            };
          })
          .sort((a, b) => {
            // Sort by relevance: importance first, then distance if available
            if (userLoc && a.distance !== null && b.distance !== null) {
              // If importance is similar, prefer closer locations
              const importanceDiff = Math.abs(a.importance - b.importance);
              if (importanceDiff < 0.1) {
                return a.distance - b.distance;
              }
            }
            return b.importance - a.importance;
          })
          .slice(0, 8);
      } catch (error) {
        if (error.name === "AbortError") return [];
        console.error("Nominatim search error:", error);
        return [];
      }
    },
    []
  );

  // MapBox search as fallback
  const searchLocationsMapbox = useCallback(async (query, userLoc = null) => {
    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      let url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?` +
        `access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw&` +
        `limit=8&types=place,locality,neighborhood,address,poi`;

      if (userLoc) {
        url += `&proximity=${userLoc.lon},${userLoc.lat}`;
      }

      const response = await fetch(url, {
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`MapBox API error: ${response.status}`);

      const data = await response.json();

      return (
        data.features?.map((item) => ({
          id: `mapbox-${item.id}`,
          display_name: item.place_name,
          name: item.text,
          type: item.place_type?.[0] || "location",
          address: item.place_name,
          lat: item.center[1],
          lon: item.center[0],
          country: item.context?.find((c) => c.id.startsWith("country"))?.text,
          state: item.context?.find((c) => c.id.startsWith("region"))?.text,
          city: item.context?.find((c) => c.id.startsWith("place"))?.text,
          relevance: item.relevance || 0,
          source: "mapbox",
        })) || []
      );
    } catch (error) {
      if (error.name === "AbortError") return [];
      console.error("MapBox search error:", error);
      return [];
    }
  }, []);

  // Main search function with improved logic
  const searchLocations = useCallback(
    async (query) => {
      if (!query || query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Prevent duplicate searches
      if (lastQueryRef.current === query.trim()) {
        return;
      }
      lastQueryRef.current = query.trim();

      setIsLoading(true);

      try {
        let allResults = [];

        // Try Nominatim first (better for detailed addresses)
        const nominatimResults = await searchLocationsNominatim(
          query,
          userLocation
        );
        allResults = [...nominatimResults];

        // If we don't have enough results, try MapBox
        if (allResults.length < 3) {
          const mapboxResults = await searchLocationsMapbox(
            query,
            userLocation
          );

          // Merge results, avoiding duplicates
          const existingNames = new Set(
            allResults.map((r) => r.display_name.toLowerCase())
          );
          const newResults = mapboxResults.filter(
            (r) => !existingNames.has(r.display_name.toLowerCase())
          );

          allResults = [...allResults, ...newResults];
        }

        // Add recent locations if query is short and we have few results
        if (query.trim().length <= 3 && allResults.length < 5) {
          const matchingRecent = recentLocations
            .filter(
              (loc) =>
                loc.name.toLowerCase().includes(query.toLowerCase()) ||
                loc.display_name.toLowerCase().includes(query.toLowerCase())
            )
            .map((loc) => ({ ...loc, isRecent: true }));

          allResults = [...matchingRecent, ...allResults];
        }

        // Remove duplicates and limit
        const uniqueResults = allResults
          .filter(
            (result, index, self) =>
              index ===
              self.findIndex(
                (r) =>
                  Math.abs(r.lat - result.lat) < 0.001 &&
                  Math.abs(r.lon - result.lon) < 0.001
              )
          )
          .slice(0, 8);

        setSuggestions(uniqueResults);
        setShowSuggestions(uniqueResults.length > 0);
      } catch (error) {
        console.error("Location search error:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    },
    [
      userLocation,
      recentLocations,
      searchLocationsNominatim,
      searchLocationsMapbox,
    ]
  );

  // Debounced search effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [value, searchLocations]);

  // Save location to recent (in memory)
  const saveRecentLocation = useCallback((location) => {
    setRecentLocations((prev) => {
      const newRecent = [
        { ...location, isRecent: true },
        ...prev.filter((loc) => loc.id !== location.id),
      ].slice(0, 5);
      return newRecent;
    });
  }, []);

  // Use current location handler
  const handleUseCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const location = await getCurrentLocation();

      // Reverse geocode
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
          `format=json&lat=${location.lat}&lon=${location.lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "RoamTogether/1.0 (https://roamtogether.com)",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          const locationText = data.name || data.display_name.split(",")[0];
          onChange(locationText);

          saveRecentLocation({
            id: `current-${Date.now()}`,
            display_name: data.display_name,
            name: locationText,
            type: "current_location",
            lat: location.lat,
            lon: location.lon,
          });
        }
      }
    } catch (error) {
      console.error("Current location error:", error);
      alert(`Could not get your current location: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Suggestion selection
  const handleSuggestionClick = useCallback(
    (suggestion) => {
      const locationText =
        suggestion.name || suggestion.display_name.split(",")[0];
      onChange(locationText);
      saveRecentLocation(suggestion);
      setShowSuggestions(false);
      setActiveSuggestion(-1);
      lastQueryRef.current = locationText; // Prevent re-search
    },
    [onChange, saveRecentLocation]
  );

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
          handleSuggestionClick(suggestions[activeSuggestion]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        break;
    }
  };

  // Clear input
  const clearInput = () => {
    onChange("");
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    lastQueryRef.current = "";
    inputRef.current?.focus();
  };

  // Get location type icon
  const getLocationIcon = (type, isRecent) => {
    if (isRecent) return "🕒";

    const iconMap = {
      current_location: "📍",
      university: "🎓",
      school: "🏫",
      airport: "✈️",
      hospital: "🏥",
      hotel: "🏨",
      restaurant: "🍽️",
      railway_station: "🚉",
      bus_stop: "🚌",
      commercial: "🏢",
      residential: "🏠",
      park: "🌳",
      mall: "🏬",
    };

    return iconMap[type] || "📍";
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.trim() && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={placeholder}
          className="w-full text-black px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
        />

        {/* Right side icons */}
        <div className="absolute right-3 top-3.5 flex items-center space-x-1">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : value ? (
            <button
              onClick={clearInput}
              className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <MapPin className="w-4 h-4 text-gray-400" />
          )}
        </div>

        {/* Current location button */}
        {showCurrentLocation && !value && (
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
            className="absolute left-3 top-3 text-xs text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
            type="button"
          >
            <Navigation className="w-3 h-3" />
            <span>Use current location</span>
          </button>
        )}

        {/* Error message */}
        {locationError && showCurrentLocation && (
          <div className="absolute left-3 bottom-full mb-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            {locationError}
          </div>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.length === 0 && !isLoading ? (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No locations found
              </div>
            ) : (
              <>
                {/* Recent locations header */}
                {suggestions.some((s) => s.isRecent) && (
                  <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                    Recent locations
                  </div>
                )}

                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                      index === activeSuggestion
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">
                        {getLocationIcon(suggestion.type, suggestion.isRecent)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {suggestion.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {suggestion.display_name}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {suggestion.isRecent && (
                            <span className="text-xs text-blue-600">
                              Recent
                            </span>
                          )}
                          {suggestion.distance && (
                            <span className="text-xs text-gray-400">
                              {suggestion.distance < 1
                                ? `${Math.round(
                                    suggestion.distance * 1000
                                  )}m away`
                                : `${suggestion.distance.toFixed(1)}km away`}
                            </span>
                          )}
                          {suggestion.source && (
                            <span className="text-xs text-gray-400">
                              {suggestion.source}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Attribution */}
            <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50 text-center border-t">
              Powered by OpenStreetMap & MapBox
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main RoamTogether Component
export default function RoamTogether() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  return (
    <div className="min-h-screen bg-[#fffef9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Form */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Plan your journey
                </h2>
              </div>

              <div className="space-y-4">
                <LocationInput
                  label="From"
                  value={fromLocation}
                  onChange={setFromLocation}
                  placeholder="Enter your starting location"
                  inputId="from-location"
                  showCurrentLocation={true}
                />

                <LocationInput
                  label="To"
                  value={toLocation}
                  onChange={setToLocation}
                  placeholder="Where are you going?"
                  inputId="to-location"
                  showCurrentLocation={false}
                />

                {/* Travel Time Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    When
                  </label>

                  <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <input
                        type="time"
                        value={travelTime}
                        onChange={(e) => setTravelTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
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
                className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                disabled={!fromLocation || !toLocation}
              >
                <Users className="w-5 h-5" />
                <span>Find Travel Companions</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Verified Users
                  </div>
                  <div className="text-sm text-gray-600">100% ID verified</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">4.8 Rating</div>
                  <div className="text-sm text-gray-600">50k+ reviews</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">24/7 Support</div>
                  <div className="text-sm text-gray-600">Always here</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="lg:pl-8">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div className="aspect-[4/5] relative">
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
                    <div className="absolute inset-0">
                      {/* Sky gradient */}
                      <div className="h-1/2 bg-gradient-to-b from-blue-300 to-blue-400"></div>
                      {/* Ground */}
                      <div className="h-1/2 bg-gradient-to-t from-green-400 via-green-300 to-blue-400"></div>

                      {/* Mountains */}
                      <div className="absolute bottom-1/2 left-0 right-0 h-32">
                        <svg viewBox="0 0 400 100" className="w-full h-full">
                          <path
                            d="M0,100 L0,60 L50,20 L100,40 L150,15 L200,35 L250,10 L300,30 L350,25 L400,45 L400,100 Z"
                            fill="rgba(34, 197, 94, 0.8)"
                          />
                          <path
                            d="M0,100 L0,70 L60,30 L120,50 L180,25 L240,45 L300,20 L360,40 L400,35 L400,100 Z"
                            fill="rgba(22, 163, 74, 0.6)"
                          />
                        </svg>
                      </div>

                      {/* Sun */}
                      <div className="absolute top-8 right-16 w-16 h-16 bg-yellow-300 rounded-full shadow-lg"></div>

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

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">2,847</div>
                    <div className="text-sm text-gray-600">
                      Active travelers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Trusted by travelers worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Forbes</div>
            <div className="text-2xl font-bold text-gray-400">TechCrunch</div>
            <div className="text-2xl font-bold text-gray-400">
              Travel + Leisure
            </div>
            <div className="text-2xl font-bold text-gray-400">CNN Travel</div>
          </div>
        </div>
      </div>
    </div>
  );
}
