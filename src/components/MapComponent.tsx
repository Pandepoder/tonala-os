"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet icon fix for Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type Report = {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: string;
};

interface MapComponentProps {
  reports: Report[];
  onMapClick?: (lat: number, lng: number) => void;
}

function ClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MapComponent({ reports, onMapClick }: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: '400px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando Mapa...</div>;

  // Centro de Tonalá, Jalisco aprox
  const center: [number, number] = [20.6248, -103.2422];

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "400px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onMapClick={onMapClick} />
        
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.latitude, report.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div>
                <strong>{report.title}</strong>
                <p style={{ margin: "4px 0", fontSize: "13px" }}>{report.description}</p>
                <div style={{ fontSize: "11px", color: "gray" }}>
                  Estado: {report.status}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
