/**
 * LocationIndicator - A component to indicate the user's current location on the map.
 * Style like iOS location indicator, with pulsing animation.
 */
import { Marker } from 'react-leaflet';
import L from 'leaflet';

interface LocationIndicatorProps {
  position: [number, number];
}

const locationIcon = L.divIcon({
  className: '',
  html: `
    <div class="location-indicator">
      <div class="location-indicator-pulse"></div>
      <div class="location-indicator-dot"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const LocationIndicator = ({ position }: LocationIndicatorProps) => {
  return <Marker position={position} icon={locationIcon} interactive={false} zIndexOffset={1000} />;
};

export default LocationIndicator;
