"use client";
import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Loader2,
  Clock,
  Route,
  Navigation,
  Car,
  ArrowRight,
  ZoomIn,
  MilestoneIcon,
} from "lucide-react";

// Isolated Google Maps component that manages its own DOM
const GoogleMapsWrapper = ({
  apiKey,
  sourceQuery,
  destQuery,
  selectedSourceLatLng,
  selectedDestLatLng,
  onStatusChange,
  onRouteCalculated,
  mapLoaded,
  setMapLoaded,
}) => {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const markersRef = useRef([]);
  const placesServiceRef = useRef(null);
  const isInitializingRef = useRef(false);

  const cleanup = () => {
    markersRef.current.forEach((marker) => {
      try {
        if (marker && typeof marker.setMap === "function") {
          marker.setMap(null);
        }
      } catch (e) {
        console.warn("Error clearing marker:", e);
      }
    });
    markersRef.current = [];

    if (directionsRendererRef.current) {
      try {
        if (typeof directionsRendererRef.current.setMap === "function") {
          directionsRendererRef.current.setMap(null);
        }
      } catch (e) {
        console.warn("Error clearing directions renderer:", e);
      }
      directionsRendererRef.current = null;
    }
  };

  const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
      if (window.google?.maps?.Map) {
        resolve();
        return;
      }

      if (document.querySelector("script[data-google-maps]")) {
        const checkInterval = setInterval(() => {
          if (window.google?.maps?.Map) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("Script loading timeout"));
        }, 10000);
        return;
      }

      const script = document.createElement("script");
      script.setAttribute("data-google-maps", "true");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;

      window.initGoogleMaps = () => {
        delete window.initGoogleMaps;
        resolve();
      };

      script.onerror = () => {
        delete window.initGoogleMaps;
        reject(new Error("Failed to load Google Maps"));
      };

      document.body.appendChild(script);
    });
  };

  const initializeMap = async () => {
    if (isInitializingRef.current || !containerRef.current) return;
    if (!sourceQuery || !destQuery) return;

    try {
      isInitializingRef.current = true;
      onStatusChange?.("Loading Google Maps...");

      await loadGoogleMapsScript();
      onStatusChange?.("Geocoding addresses...");

      cleanup();

      const map = new window.google.maps.Map(containerRef.current, {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 6,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ weight: "2.00" }],
          },
          {
            featureType: "all",
            elementType: "geometry.stroke",
            stylers: [{ color: "#9c9c9c" }],
          },
        ],
      });
      mapInstanceRef.current = map;

      const geocoder = new window.google.maps.Geocoder();

      if (!placesServiceRef.current) {
        const div = document.createElement("div");
        div.style.display = "none";
        div.setAttribute("data-places-service", Date.now());
        document.body.appendChild(div);
        placesServiceRef.current = div;
      }

      const geocodePromise = (address) =>
        new Promise((resolve) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              const location = results[0].geometry.location;
              resolve({
                lat: location.lat(),
                lng: location.lng(),
                address: results[0].formatted_address,
              });
            } else {
              resolve(null);
            }
          });
        });

      const sourcePoint = selectedSourceLatLng
        ? {
            lat: selectedSourceLatLng[0],
            lng: selectedSourceLatLng[1],
            address: sourceQuery,
          }
        : await geocodePromise(sourceQuery);

      const destPoint = selectedDestLatLng
        ? {
            lat: selectedDestLatLng[0],
            lng: selectedDestLatLng[1],
            address: destQuery,
          }
        : await geocodePromise(destQuery);

      if (!sourcePoint || !destPoint) {
        onStatusChange?.("Could not find addresses");
        return;
      }

      onStatusChange?.("Calculating route...");

      const distanceMatrix = new window.google.maps.DistanceMatrixService();
      const distancePromise = new Promise((resolve) => {
        distanceMatrix.getDistanceMatrix(
          {
            origins: [{ lat: sourcePoint.lat, lng: sourcePoint.lng }],
            destinations: [{ lat: destPoint.lat, lng: destPoint.lng }],
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC,
          },
          (response, status) => {
            if (status === "OK" && response.rows?.[0]?.elements?.[0]) {
              const element = response.rows[0].elements[0];
              resolve({
                distance: element.distance
                  ? element.distance.value / 1000
                  : null,
                duration: element.duration ? element.duration.value / 60 : null,
              });
            } else {
              resolve({ distance: null, duration: null });
            }
          }
        );
      });

      const routeInfo = await distancePromise;
      onRouteCalculated?.(routeInfo);

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#2563eb",
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });

      directionsRenderer.setMap(map);
      directionsRendererRef.current = directionsRenderer;

      const directionsPromise = new Promise((resolve) => {
        directionsService.route(
          {
            origin: { lat: sourcePoint.lat, lng: sourcePoint.lng },
            destination: { lat: destPoint.lat, lng: destPoint.lng },
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK") {
              resolve(result);
            } else {
              resolve(null);
            }
          }
        );
      });

      const directions = await directionsPromise;
      if (!directions) {
        onStatusChange?.("Could not calculate route");
        return;
      }

      directionsRenderer.setDirections(directions);

      const leg = directions.routes[0].legs[0];

      const startMarker = new window.google.maps.Marker({
        position: leg.start_location,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff",
        },
      });

      const endMarker = new window.google.maps.Marker({
        position: leg.end_location,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff",
        },
      });

      markersRef.current = [startMarker, endMarker];

      const bounds = new window.google.maps.LatLngBounds();
      directions.routes[0].overview_path.forEach((point) =>
        bounds.extend(point)
      );
      map.fitBounds(bounds, { padding: 60 });

      onStatusChange?.("Route ready");
      setMapLoaded?.(true);
    } catch (error) {
      console.error("Map initialization error:", error);
      onStatusChange?.("Failed to load map: " + error.message);
    } finally {
      isInitializingRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
      if (
        placesServiceRef.current &&
        document.body.contains(placesServiceRef.current)
      ) {
        try {
          document.body.removeChild(placesServiceRef.current);
        } catch (e) {
          console.warn("Error removing places service div:", e);
        }
        placesServiceRef.current = null;
      }
    };
    
  }, []);

  useEffect(() => {
    if (sourceQuery && destQuery) {
      initializeMap();
    }
   
  }, [sourceQuery, destQuery, selectedSourceLatLng, selectedDestLatLng]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[450px]"
      style={{
        background: "#f8fafc",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    />
  );
};

export default function Map({
  source,
  destination,
  travelData,
  onRouteCalculated,
  progress = 0,
}) {
  const GOOGLE_API_KEY = "AIzaSyD4d2kRY8MAHEUYfi1qNAz8n4j4LHfK8-A";

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapResolving, setMapResolving] = useState(false);
  const [mapStatus, setMapStatus] = useState("Click 'Create Route' to start");
  const [sourceQuery, setSourceQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [selectedSourceLatLng, setSelectedSourceLatLng] = useState(null);
  const [selectedDestLatLng, setSelectedDestLatLng] = useState(null);
  const [routeDistanceKm, setRouteDistanceKm] = useState(null);
  const [routeDurationMin, setRouteDurationMin] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const debounceTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (source) setSourceQuery(source);
    if (destination) setDestQuery(destination);
  }, [source, destination]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleStatusChange = (status) => {
    setMapStatus(status);
    setMapResolving(
      status !== "Route ready" && status !== "Click 'Create Route' to start"
    );
  };

  const handleRouteCalculated = (routeInfo) => {
    if (routeInfo.distance) setRouteDistanceKm(routeInfo.distance);
    if (routeInfo.duration) setRouteDurationMin(routeInfo.duration);
    if (onRouteCalculated) onRouteCalculated(routeInfo);
  };

  const fetchPlacePredictions = async (query) => {
    try {
      if (!query) return [];

      if (!window.google?.maps?.places) {
        return [];
      }

      const service = new window.google.maps.places.AutocompleteService();
      return new Promise((resolve) => {
        service.getPlacePredictions(
          {
            input: query,
            componentRestrictions: { country: "in" },
            types: ["geocode"],
          },
          (predictions) => {
            if (!predictions || predictions.length === 0) return resolve([]);
            resolve(
              predictions.map((p) => ({
                label: p.description,
                placeId: p.place_id,
              }))
            );
          }
        );
      });
    } catch (e) {
      console.error("Google place predictions error", e);
      return [];
    }
  };

  const fetchPlaceDetails = async (placeId) => {
    try {
      if (!placeId || !window.google?.maps?.places) return null;

      const div = document.createElement("div");
      div.style.display = "none";
      document.body.appendChild(div);

      const service = new window.google.maps.places.PlacesService(div);

      return new Promise((resolve) => {
        service.getDetails(
          { placeId, fields: ["geometry", "formatted_address", "name"] },
          (place, status) => {
            document.body.removeChild(div);

            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              place?.geometry?.location
            ) {
              const loc = place.geometry.location;
              resolve([
                loc.lat(),
                loc.lng(),
                place.formatted_address || place.name,
              ]);
              
            } else {
              resolve(null);
            }
          }
        );
      });
    } catch (e) {
      console.error("Google place details error", e);
      return null;
    }
    // createRoute();
  };

  const handleSourceInput = (v) => {
    setSourceQuery(v);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      if (isMountedRef.current && v.length > 2) {
        const items = await fetchPlacePredictions(v);
        if (isMountedRef.current) {
          setSourceSuggestions(items);
        }
      } else {
        setSourceSuggestions([]);
      }
    }, 300);
  };

  const handleDestInput = (v) => {
    setDestQuery(v);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      if (isMountedRef.current && v.length > 2) {
        const items = await fetchPlacePredictions(v);
        if (isMountedRef.current) {
          setDestSuggestions(items);
        }
      } else {
        setDestSuggestions([]);
      }
    }, 300);
  };

  const handleSelectSourceSuggestion = async (item) => {
    setSourceQuery(item.label);
    setSourceSuggestions([]);
    const pos = await fetchPlaceDetails(item.placeId);
    if (pos && isMountedRef.current) {
      setSelectedSourceLatLng([pos[0], pos[1]]);
    }
  };

  const handleSelectDestSuggestion = async (item) => {
    setDestQuery(item.label);
    setDestSuggestions([]);
    const pos = await fetchPlaceDetails(item.placeId);
    if (pos && isMountedRef.current) {
      setSelectedDestLatLng([pos[0], pos[1]]);
    }
  };
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by this browser");
      return;
    }
  
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        updateLiveMarker(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error("GPS error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  
    return () => {
      // Stop watching when component unmounts
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  const liveMarkerRef = useRef(null);

  const updateLiveMarker = (lat, lng) => {
    if (!mapInstanceRef.current || !window.google) return;
  
    const pos = new window.google.maps.LatLng(lat, lng);
  
    if (!liveMarkerRef.current) {
      // First time → create marker
      liveMarkerRef.current = new window.google.maps.Marker({
        position: pos,
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4", // Google blue
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#fff",
        },
      });
    } else {
      // Move marker
      liveMarkerRef.current.setPosition(pos);
    }
  };
  
    
  useEffect(() => {
    if (!sourceQuery.trim() || !destQuery.trim()) return; // don’t run until both filled
  
    const timer = setTimeout(() => {
      createRoute();
    }, 1000);
  
    return () => clearTimeout(timer);
  }, [sourceQuery, destQuery]); // depend on inputs
  
  const createRoute = async () => {
    if (!sourceQuery.trim() || !destQuery.trim()) {
      setMapStatus("Please enter both source and destination");
      return;
    }

    setShowMap(true);
    setMapLoaded(false);
    setMapResolving(true);
    setMapStatus("Initializing map...");
    
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div
        className="border border-gray-300 rounded-xl shadow-lg p-8 mb-8 bg-gradient-to-br from-white to-gray-50"
        style={{ backgroundColor: "#ffffff" }}
      >
      
        <div className="space-y-6">
          {/* Enhanced Location Input Section */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
              
                
                <input
                  value={sourceQuery}
                  onChange={(e) => handleSourceInput(e.target.value)}
                  placeholder="Enter your starting location"
                  className=" w-full border-2 border-green-300 rounded-lg p-4 text-l font-medium text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                {sourceSuggestions && sourceSuggestions.length > 0 && (
                  <ul className="absolute z-50 bg-white border-2 border-gray-200 w-full mt-2 max-h-48 overflow-auto rounded-lg shadow-lg">
                    {sourceSuggestions.map((s, i) => (
                      <li
                        key={i}
                        className="p-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        onClick={() => handleSelectSourceSuggestion(s)}
                      >
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          {s.label}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
              </div>

           

              <div className="relative lg:col-start-2">
                
                <input
                  value={destQuery}
                  onChange={(e) => handleDestInput(e.target.value)}
                  placeholder="Enter your destination"
                  className="w-full border-2 border-red-300 rounded-lg p-4 text-l font-medium text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                {destSuggestions && destSuggestions.length > 0 && (
                  <ul className="absolute z-50 bg-white border-2 border-gray-200 w-full mt-2 max-h-48 overflow-auto rounded-lg shadow-lg">
                    {destSuggestions.map((s, i) => (
                      <li
                        key={i}
                        className="p-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        onClick={() => handleSelectDestSuggestion(s)}
                      >
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          {s.label}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Create Route Button */}
         

          {/* Enhanced Map Container with Zoom */}
          <div className="relative bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-white rounded-lg shadow-md p-2 flex items-center space-x-2">
                <ZoomIn className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Interactive Map
                </span>
              </div>
            </div>

            <div className="w-full h-[500px] relative overflow-hidden">
              {showMap ? (
                <GoogleMapsWrapper
                  apiKey={GOOGLE_API_KEY}
                  sourceQuery={sourceQuery}
                  destQuery={destQuery}
                  selectedSourceLatLng={selectedSourceLatLng}
                  selectedDestLatLng={selectedDestLatLng}
                  onStatusChange={handleStatusChange}
                  onRouteCalculated={handleRouteCalculated}
                  mapLoaded={mapLoaded}
                  setMapLoaded={setMapLoaded}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-center">
                    <div className="bg-blue-100 p-6 rounded-full mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                      <MapPin className="h-10 w-10 text-blue-600" />
                    </div>
                    <p className="text-gray-700 text-lg font-semibold">
                      {mapStatus}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Enter locations above and click Create Route to get
                      started
                    </p>
                  </div>
                </div>
              )}

              {showMap && (mapResolving || !mapLoaded) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 z-30">
                  <div className="text-center">
                    <div className="bg-blue-100 p-6 rounded-full mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    </div>
                    <p className="text-gray-700 text-lg font-semibold">
                      {mapStatus}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Car className="h-6 w-6 text-blue-600 mr-3" />
                <span className="text-lg font-semibold text-gray-800">
                  Journey Progress
                </span>
              </div>
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                <span className="text-2xl font-bold text-gray-800">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div
                className={`h-4 rounded-full transition-all duration-1000 relative overflow-hidden ${
                  travelData?.completed
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
            {progress > 0 && (
              <div className="mt-3 text-center">
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {travelData?.completed
                    ? "Journey Complete! 🎉"
                    : "On the way..."}
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Route Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="bg-blue-600 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  Estimated Time Remaining
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {travelData?.completed
                  ? "Completed"
                  : !travelData?.vehicleNumber
                  ? "Waiting to start"
                  : routeDurationMin != null
                  ? `${Math.max(
                      0,
                      Math.round(routeDurationMin * (1 - progress / 100))
                    )} mins`
                  : "Calculating..."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="bg-green-600 p-3 rounded-full mr-4">
                  <Route className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  Distance Covered
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {!travelData?.vehicleNumber
                  ? "0 km"
                  : routeDistanceKm != null
                  ? `${Math.max(
                      0,
                      Math.round((routeDistanceKm * progress) / 100)
                    )} km`
                  : "--"}
              </p>
              {routeDistanceKm && (
                <p className="text-sm text-gray-600 mt-2">
                  Total: {Math.round(routeDistanceKm)} km
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
