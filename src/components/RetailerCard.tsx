import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface RetailerProps {
  name: string;
  city: string;
  state: string;
  latitude?: string;
  longitude?: string;
}

const RetailerCard: React.FC<RetailerProps> = ({
  name,
  city,
  state,
  latitude,
  longitude,
}) => {
  const handleMapClick = () => {
    if (latitude && longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
        "_blank"
      );
    } else {
      // If no coordinates, search by name and location
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${name} ${city} ${state}`
        )}`,
        "_blank"
      );
    }
  };

  return (
    <div className="bb-sm-retailer-card">
      <div className="bb-sm-retailer-info">
        <h3 className="bb-sm-retailer-name">{name}</h3>
        <p className="bb-sm-retailer-location">
          {city}, {state}
        </p>
      </div>
      <button
        onClick={handleMapClick}
        className="bb-sm-map-button"
        aria-label="View on map"
      >
        <FaMapMarkerAlt />
      </button>
    </div>
  );
};

export default RetailerCard;
