import React, { useEffect } from "react";
import { Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Define the props interface
interface CustomMapProps {
  position: [number | null | undefined, number | null | undefined]; // Tuple for latitude and longitude
  zoom: number;
}

const MapUpdater: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);

  return null;
};

const CustomMap: React.FC<CustomMapProps> = ({ position, zoom }) => {
  // Default position in case latitude or longitude are null/undefined
  const defaultPosition: [number, number] = [33.5731, -7.5898]; // e.g., Casablanca coordinates

  // Ensure the position is valid by providing default values if necessary
  const validPosition: [number, number] = [
    position[0] ?? defaultPosition[0],
    position[1] ?? defaultPosition[1],
  ];

  return (
    <MapContainer center={validPosition} zoom={zoom} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={validPosition}>
        <Popup>A pretty CSS3 popup. Easily customizable.</Popup>
      </Marker>
      <MapUpdater position={validPosition} />
    </MapContainer>
  );
};

export default CustomMap;