import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const DELIVERY_API_URL = import.meta.env.VITE_DELIVER_API_URL;
const ORDER_API_URL = import.meta.env.VITE_ORDER_API_URL;

function RiderMarker({ rider, onAssign }) {
  const icon = L.icon({
    iconUrl: rider.profilePictureUrl || "/default-avatar.png",
    iconSize: [40, 40],
    className: "rounded-full border-2 border-blue-500 shadow"
  });
  // Use actual rider location if available, otherwise fallback to Sri Lanka center
  const position =
    rider.location && rider.location.lat && rider.location.lng
      ? [rider.location.lat, rider.location.lng]
      : [7.2, 81.0];
  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div className="flex flex-col items-center">
          <img
            src={rider.profilePictureUrl || "/default-avatar.png"}
            className="w-16 h-16 rounded-full"
            alt={rider.personalInfo?.name}
          />
          <div className="font-bold">{rider.personalInfo?.name}</div>
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
            onClick={() => onAssign(rider)}
          >
            Assign to this Rider
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export function AssignRiderModal({ open, onClose, order, onAssigned }) {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && order && order.address) {
      setLoading(true);
      axios
        .get(`${DELIVERY_API_URL}/rider/nearby-riders`, {
          params: { address: order.address }
        })
        .then(res => setRiders(res.data.riders || []))
        .finally(() => setLoading(false));
    }
  }, [open, order]);

  if (!open || !order) return null;

  // Dynamically center the map based on all valid rider locations
  const validLocations = riders.filter(
    r => r.location && r.location.lat && r.location.lng
  );
  const center =
    validLocations.length > 0
      ? [
          validLocations.reduce((sum, r) => sum + r.location.lat, 0) /
            validLocations.length,
          validLocations.reduce((sum, r) => sum + r.location.lng, 0) /
            validLocations.length
        ]
      : [7.2, 81.0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-lg relative">
        <button
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Assign Delivery Rider</h2>
        <div className="mb-2 text-gray-600">
          Click a rider's marker to assign this order.
        </div>
        {loading ? (
          <div className="py-10 text-center text-orange-500">
            Loading nearby riders...
          </div>
        ) : (
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: 400, width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* Rider markers */}
            {riders.map(rider => (
              <RiderMarker
                key={rider._id}
                rider={rider}
                onAssign={async r => {
                  await axios.post(
                    `${ORDER_API_URL}/order/assign-rider`,
                    {
                      orderId: order._id,
                      riderId: r._id
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "restaurantToken"
                        )}`
                      }
                    }
                  );
                  onAssigned(r);
                  onClose();
                }}
              />
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
