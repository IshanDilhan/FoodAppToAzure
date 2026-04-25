// components/OrderTrackingMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import RoutingMachine from "@changey/react-leaflet-routing-machine";

const OrderTrackingMap = ({
  riderLocation,
  destination,
  riderName = "Rider",
  destinationName = "Destination",
}) => {
  const center = riderLocation || destination;

  return (
    <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {riderLocation && (
        <Marker position={riderLocation}>
          <Popup>{riderName}</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination}>
          <Popup>{destinationName}</Popup>
        </Marker>
      )}
      {riderLocation && destination && (
        <RoutingMachine
          waypoints={[riderLocation, destination]}
          lineOptions={{ styles: [{ color: "#6c63ff", weight: 5 }] }}
          show={true}
        />
      )}
    </MapContainer>
  );
};

export default OrderTrackingMap;
