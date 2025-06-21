import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "/marker.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const StationMap = ({ station }) => {
  const coordinates = station?.location?.coordinates;

  console.log(station);

  const lat = coordinates?.[1]; // GeoJSON format: [lng, lat]
  const lng = coordinates?.[0];

  if (!lat || !lng) return <p>Koordinatalar topilmadi</p>;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={10}
      style={{ height: "400px", width: "100%", marginTop: 30 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>
          <strong>Stansiya:</strong> {station.name}
          <br />
          <strong>Shahar:</strong> {station.city}
          <br />
          <strong>Platformalar:</strong> {station.platforms}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default StationMap;
