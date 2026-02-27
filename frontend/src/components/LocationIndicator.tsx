/**
 * LocationIndicator - A component to indicate the user's current location on the map.
 * Style like iOS location indicator, with pulsing animation.
 */
import L from 'leaflet';
import isNil from 'lodash/isNil';
import { Marker } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';
import useDebounceEffect from '@/hooks/useDebounceEffect';

const DEBOUNCE_TIME_MS = 1000;

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
  const map = useMap();

  useDebounceEffect(
    () => {
      if (isNil(position)) return;

      // 將地圖中心移動到使用者位置
      map.setView(position);
    },
    [position],
    DEBOUNCE_TIME_MS,
  );

  return <Marker position={position} icon={locationIcon} interactive={false} zIndexOffset={1000} />;
};

export default LocationIndicator;
