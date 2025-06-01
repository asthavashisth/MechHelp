import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Fix default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const mechanicIcon = new L.DivIcon({
  html: `<div class="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>`,
  className: 'mechanic-marker-container',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const isValidLocation = (loc) =>
  loc && Array.isArray(loc) && loc.length === 2 && !isNaN(loc[0]) && !isNaN(loc[1]);

const calculateDistance = (loc1, loc2) => {
  if (!isValidLocation(loc1) || !isValidLocation(loc2)) return null;
  const R = 6371;
  const dLat = ((loc2[0] - loc1[0]) * Math.PI) / 180;
  const dLon = ((loc2[1] - loc1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((loc1[0] * Math.PI) / 180) *
    Math.cos((loc2[0] * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

const SmartAutoCenter = ({ positions, isMechanicMoving }) => {
  const map = useMap();
  const mapRef = useRef(map);
  const lastCenterTime = useRef(Date.now());
  const [shouldRecenter, setShouldRecenter] = useState(true);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  useEffect(() => {
    const onMoveStart = () => {
      if (Date.now() - lastCenterTime.current > 300) {
        setShouldRecenter(false);
      }
    };
    mapRef.current.on('movestart', onMoveStart);
    return () => mapRef.current.off('movestart', onMoveStart);
  }, []);

  const handleRecenter = () => {
    setShouldRecenter(true);
    if (positions) {
      const [userLoc, mechLoc] = positions;
      if (isValidLocation(userLoc) && isValidLocation(mechLoc)) {
        const bounds = L.latLngBounds([userLoc, mechLoc]).pad(0.3);
        lastCenterTime.current = Date.now();
        mapRef.current.fitBounds(bounds, { animate: true, duration: 0.5 });
      }
    }
  };

  useEffect(() => {
    if (!shouldRecenter || !positions) return;
    const [userLoc, mechLoc] = positions;
    if (!isValidLocation(userLoc) || !isValidLocation(mechLoc)) return;
    const bounds = L.latLngBounds([userLoc, mechLoc]).pad(0.3);
    lastCenterTime.current = Date.now();
    mapRef.current.fitBounds(bounds, { animate: true, duration: 0.5 });
  }, [positions, shouldRecenter, isMechanicMoving]);

  return (
    !shouldRecenter && (
      <div className="absolute bottom-6 right-6 z-[1100]">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center text-sm"
          onClick={handleRecenter}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" />
          </svg>
          Re-center
        </button>
      </div>
    )
  );
};

const RoutingMachine = ({ from, to }) => {
  const map = useMap();
  const routingRef = useRef();

  useEffect(() => {
    if (!isValidLocation(from) || !isValidLocation(to)) return;
    if (routingRef.current) {
      map.removeControl(routingRef.current);
      routingRef.current = null;
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: () => null,
      lineOptions: {
        styles: [
          { color: "#3b82f6", weight: 6, opacity: 0.9 },
          { color: "#1d4ed8", weight: 4, opacity: 0.7 }
        ]
      }
    }).addTo(map);

    setTimeout(() => {
      const container = control.getContainer();
      if (container) container.style.display = 'none';
    }, 100);

    routingRef.current = control;

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
      }
    };
  }, [from, to]);

  return null;
};

const RealTimeMap = ({ userLocation, mechanicLocation, isMechanicMoving }) => {
  const distance = calculateDistance(userLocation, mechanicLocation);

  return (
    <div className="relative w-full h-[80vh] rounded-lg overflow-hidden">
      <MapContainer
        center={userLocation || [20.5937, 78.9629]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {isValidLocation(userLocation) && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You</Popup>
          </Marker>
        )}
        {isValidLocation(mechanicLocation) && (
          <Marker position={mechanicLocation} icon={mechanicIcon}>
            <Popup>Mechanic</Popup>
          </Marker>
        )}
        {isValidLocation(userLocation) && isValidLocation(mechanicLocation) && (
          <>
            <RoutingMachine from={mechanicLocation} to={userLocation} />
            <SmartAutoCenter positions={[userLocation, mechanicLocation]} isMechanicMoving={isMechanicMoving} />
          </>
        )}
      </MapContainer>
      {distance !== null && (
        <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-lg text-sm z-[1100]">
          <strong>Distance:</strong> {distance} km
        </div>
      )}
    </div>
  );
};

export default RealTimeMap;
