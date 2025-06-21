import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function FitBounds({ stations }) {
  const map = useMap();

  useEffect(() => {
    if (stations.length > 0) {
      const bounds = L.latLngBounds(
        stations.map((s) => [
          s.location.coordinates[1],
          s.location.coordinates[0],
        ])
      );
      map.fitBounds(bounds);
    }
  }, [stations]);

  return null;
}

export default function MapComponent() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/station`)
      .then((res) => setStations(res.data));
  }, []);

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[41.3111, 69.2797]}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds stations={stations} />

        {stations.map((station) => (
          <Marker
            key={station._id}
            position={[
              station.location.coordinates[1],
              station.location.coordinates[0],
            ]}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              {station.city}, {station.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
