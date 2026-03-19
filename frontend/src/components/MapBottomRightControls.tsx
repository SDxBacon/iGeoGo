import L from 'leaflet';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { PiDevices } from 'react-icons/pi';
import { BiCurrentLocation } from 'react-icons/bi';
import LeafletButton from '@/components/buttons/LeafletButton';
import LeafletButtonGroup from '@/components/buttons/LeafletButtonGroup';
import { useLocationStore } from '@/stores/useLocationStore';

/**
 * MapBottomRightControls component 用於在地圖右下角添加自定義控制按鈕。
 * 透過繼承 L.Control 讓 Leaflet 正確管理 stacking context，
 * 再用 portal 將 React 內容掛入 control DOM node。
 */
function MapBottomRightControls() {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, forceUpdate] = useState(0);

  const currentLocation = useLocationStore((s) => s.currentLocation);

  const handleRecenter = () => {
    if (map && currentLocation) {
      // 以目前位置為中心，並確保縮放級別至少為 15，以便更清楚地看到位置。
      // TODO: 未來縮小級別要依照 movement method 調整
      map.setView([currentLocation.lat, currentLocation.lng], Math.max(map.getZoom(), 15));
    }
  };

  useEffect(() => {
    const control = new L.Control({ position: 'bottomright' });

    control.onAdd = () => {
      const div = L.DomUtil.create('div');
      L.DomEvent.disableClickPropagation(div);
      containerRef.current = div;
      forceUpdate((n) => n + 1);
      return div;
    };

    control.onRemove = () => {
      containerRef.current = null;
    };

    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map]);

  if (!containerRef.current) return null;

  return createPortal(
    <div className="flex flex-col">
      {/**
       * Device List 按鈕
       */}
      <LeafletButtonGroup className="mb-2">
        <LeafletButton title="Device List" onClick={() => {}}>
          <PiDevices />
        </LeafletButton>
      </LeafletButtonGroup>

      {/**
       * Recenter 按鈕
       */}
      <LeafletButtonGroup className="mb-2">
        <LeafletButton title="Recenter" onClick={handleRecenter}>
          <BiCurrentLocation />
        </LeafletButton>
      </LeafletButtonGroup>

      {/**
       * Zoom In/Out 按鈕，外觀與 Leaflet 原生控制按鈕一致。
       */}
      <LeafletButtonGroup orientation="vertical">
        {/* Zoom In */}
        <LeafletButton title="Zoom in" onClick={() => map.zoomIn()}>
          +
        </LeafletButton>
        {/* Zoom Out */}
        <LeafletButton title="Zoom out" onClick={() => map.zoomOut()}>
          −
        </LeafletButton>
      </LeafletButtonGroup>
    </div>,
    containerRef.current,
  );
}

export default MapBottomRightControls;
