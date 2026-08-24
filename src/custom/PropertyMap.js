"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const propertyIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function PropertyMap({
  latitude = 20.2961,
  longitude = 85.8245,
  landId = "TRYN-OD-001024",
}) {
  const position = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={propertyIcon}>
        <Popup>
          <strong>{landId}</strong>
          <br />
          Lat: {latitude}
          <br />
          Lng: {longitude}
        </Popup>
      </Marker>
    </MapContainer>
  );
}