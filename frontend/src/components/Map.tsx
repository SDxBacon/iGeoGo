import { MapContainer, TileLayer } from 'react-leaflet';
import { useImmer } from 'use-immer';
import L from 'leaflet';
import isNil from 'lodash/isNil';
// import local components
import LocationIndicator from '@/components/LocationIndicator';
import RouteLayer from '@/components/RouteLayer';
import MapContextMenu, {
  MapContextMenuHandler,
  type ContextMenuState,
} from '@/components/MapContextMenu';
import useLocationStore from '@/stores/useLocationStore';
import MovementMethodToggle from '@/components/MovementMethodToggle';
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

const INITIAL_MENU_STATE: ContextMenuState = { visible: false, x: 0, y: 0, latlng: null };

/**
 * Map component 包含 Leaflet 地圖和相關功能
 */
function Map() {
  const currentLocation = useLocationStore((state) => state.currentLocation);
  const [menuState, updateMenuState] = useImmer<ContextMenuState>(INITIAL_MENU_STATE);

  const handleMenuOpen = (state: Omit<ContextMenuState, 'visible'>) =>
    updateMenuState({ visible: true, ...state });

  const handleMenuClose = () =>
    updateMenuState((draft) => {
      draft.visible = false;
    });

  return (
    <div className="relative flex-1">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
      >
        {/* OpenStreetMap 圖磚 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 路線：currentLocation → 台北 101 */}
        <RouteLayer />

        {/* 使用者位置指示器 */}
        {isNil(currentLocation) ? null : (
          <LocationIndicator position={[currentLocation.lat, currentLocation.lng]} />
        )}

        {/* 右鍵選單事件處理 */}
        <MapContextMenuHandler onOpen={handleMenuOpen} onClose={handleMenuClose} />
      </MapContainer>

      {/* 右鍵浮動選單（在 MapContainer 外以避免 z-index 問題）*/}
      <MapContextMenu {...menuState} onClose={handleMenuClose} />

      {/* 移動方式切換（右上角）*/}
      <MovementMethodToggle />
    </div>
  );
}

export default Map;
