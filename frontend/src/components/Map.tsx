import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import isNil from 'lodash/isNil';
import LocationIndicator from '@/components/LocationIndicator';
import useLocationStore from '@/stores/useLocationStore';
// Fix Leaflet 預設 marker icon 在 Vite 環境破圖的問題
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import leaflet css
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// 預設中心點：台北 101
const DEFAULT_CENTER: [number, number] = [25.0338, 121.5645];
const DEFAULT_ZOOM = 13;

function Map() {
  const currentLocation = useLocationStore((state) => state.currentLocation);

  return (
    <div className="flex-1">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        // className="size-full"
        style={{ width: '100%', height: '100%' }}
      >
        {/* OpenStreetMap 圖磚 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 使用者位置指示器 */}
        {isNil(currentLocation) ? null : (
          <LocationIndicator position={[currentLocation.lat, currentLocation.lng]} />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
