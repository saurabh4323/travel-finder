"use client";
import { useEffect, useRef, useCallback } from "react";

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
  const scriptLoadedRef = useRef(false);
  const placesServiceRef = useRef(null);
  const isInitializingRef = useRef(false);

  // Clean up function
  const cleanup = useCallback(() => {
    // Clear markers
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

    // Clear directions renderer
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

    // Don't clear the map instance - let it persist
  }, []);

  // Load Google Maps script
  const loadGoogleMapsScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google?.maps?.Map) {
        resolve();
        return;
      }

      // Check if script exists
      if (document.querySelector("script[data-google-maps]")) {
        // Wait for existing script
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

      // Create script
      const script = document.createElement("script");
      script.setAttribute("data-google-maps", "true");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;

      // Use callback method to avoid timing issues
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
  }, [apiKey]);

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (isInitializingRef.current || !containerRef.current) return;
    if (!sourceQuery || !destQuery) return;

    try {
      isInitializingRef.current = true;
      onStatusChange?.("Loading Google Maps...");

      await loadGoogleMapsScript();
      onStatusChange?.("Geocoding addresses...");

      cleanup(); // Clean previous instances

      // Create map
      const map = new window.google.maps.Map(containerRef.current, {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 6,
      });
      mapInstanceRef.current = map;

      // Create services
      const geocoder = new window.google.maps.Geocoder();

      // Create persistent div for places service outside React's scope
      if (!placesServiceRef.current) {
        const div = document.createElement("div");
        div.style.display = "none";
        div.setAttribute("data-places-service", Date.now());
        // Append to body, not to React-managed DOM
        document.body.appendChild(div);
        placesServiceRef.current = div;
      }

      // Geocode addresses
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

      // Calculate distance
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

      // Get directions
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
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

      // Add markers
      const leg = directions.routes[0].legs[0];

      // Start marker
      const startMarker = new window.google.maps.Marker({
        position: leg.start_location,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        },
      });

      // End marker
      const endMarker = new window.google.maps.Marker({
        position: leg.end_location,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        },
      });

      markersRef.current = [startMarker, endMarker];

      // Fit bounds
      const bounds = new window.google.maps.LatLngBounds();
      directions.routes[0].overview_path.forEach((point) =>
        bounds.extend(point)
      );
      map.fitBounds(bounds, { padding: 40 });

      onStatusChange?.("Route ready");
      setMapLoaded?.(true);
    } catch (error) {
      console.error("Map initialization error:", error);
      onStatusChange?.("Failed to load map: " + error.message);
    } finally {
      isInitializingRef.current = false;
    }
  }, [
    sourceQuery,
    destQuery,
    selectedSourceLatLng,
    selectedDestLatLng,
    onStatusChange,
    onRouteCalculated,
    setMapLoaded,
    loadGoogleMapsScript,
    cleanup,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      // Clean up places service div
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
  }, [cleanup]);

  // Initialize map when ready
  useEffect(() => {
    if (sourceQuery && destQuery) {
      initializeMap();
    }
  }, [initializeMap, sourceQuery, destQuery]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[384px]"
      style={{
        background: "#f3f4f6",
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    />
  );
};

export default GoogleMapsWrapper;
