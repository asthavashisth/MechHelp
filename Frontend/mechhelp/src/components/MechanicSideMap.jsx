import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const isValidLocation = (loc) =>
  loc && Array.isArray(loc) && loc.length === 2 && !isNaN(loc[0]) && !isNaN(loc[1]);

const calculateDistance = (loc1, loc2) => {
  if (!isValidLocation(loc1) || !isValidLocation(loc2)) return null;
  const R = 6371;
  const dLat = ((loc2[0] - loc1[0]) * Math.PI) / 180;
  const dLon = ((loc2[1] - loc1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1[0] * Math.PI) / 180) *
      Math.cos((loc2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

const AutoCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
};

// ✅ Routing Component
const Routing = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [from, to, map]);

  return null;
};

export default function MechanicSideMap({ userLocation, mechanicLocation }) {
  const [liveMechanicLocation, setLiveMechanicLocation] = useState(mechanicLocation);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (isValidLocation(userLocation) && isValidLocation(mechanicLocation)) {
      setDistance(calculateDistance(userLocation, mechanicLocation));
    }
  }, [userLocation, mechanicLocation]);

  useEffect(() => {
    if (!isValidLocation(mechanicLocation)) return;

    const interval = setInterval(() => {
      setLiveMechanicLocation((prev) => {
        if (!prev) return prev;
        const shouldMoveTowardsUser = Math.random() > 0.3;
        if (shouldMoveTowardsUser && isValidLocation(userLocation)) {
          return [
            prev[0] + (userLocation[0] - prev[0]) * 0.15,
            prev[1] + (userLocation[1] - prev[1]) * 0.15,
          ];
        }
        const randomShift = () => (Math.random() - 0.5) * 0.001;
        return [prev[0] + randomShift(), prev[1] + randomShift()];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [mechanicLocation, userLocation]);

  useEffect(() => {
    if (isValidLocation(userLocation) && isValidLocation(liveMechanicLocation)) {
      setDistance(calculateDistance(userLocation, liveMechanicLocation));
    }
  }, [userLocation, liveMechanicLocation]);

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-400 relative">
      <MapContainer
        center={isValidLocation(userLocation) ? userLocation : [0, 0]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {isValidLocation(userLocation) && (
          <Marker position={userLocation}>
            <Popup>User Location</Popup>
          </Marker>
        )}

        {isValidLocation(liveMechanicLocation) && (
          <Marker position={liveMechanicLocation}>
            <Popup>Your Location (Mechanic)</Popup>
          </Marker>
        )}

        <AutoCenter position={liveMechanicLocation} />

        {/* ✅ Real Route Line */}
        {isValidLocation(userLocation) && isValidLocation(liveMechanicLocation) && (
          <Routing from={liveMechanicLocation} to={userLocation} />
        )}
      </MapContainer>

      {distance && (
        <div className="absolute top-2 left-2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold z-[999]">
          Distance to user: {distance} km
        </div>
      )}
    </div>
  );
}
