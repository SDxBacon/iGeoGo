import L from 'leaflet';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { GiTeleport } from 'react-icons/gi';
import { FaRoute } from 'react-icons/fa';
import { MovementMethod } from '@/constants/movementMethod';
import useMapStore from '@/stores/useMapStore';
import LeafletButton from '@/components/buttons/LeafletButton';
import LeafletButtonGroup from '@/components/buttons/LeafletButtonGroup';

const METHODS = [MovementMethod.Teleport, MovementMethod.Route] as const;

/**
 * MovementMethodToggle component 用於在地圖右上角切換移動方式。
 * 透過繼承 L.Control 讓 Leaflet 正確管理 stacking context，
 * 再用 portal 將 React 內容掛入 control DOM node。
 */
function MovementMethodToggle() {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, forceUpdate] = useState(0);
  // const movementMethod = useMapStore((state) => state.movementMethod);
  const setMovementMethod = useMapStore((state) => state.setMovementMethod);

  useEffect(() => {
    const control = new L.Control({ position: 'topright' });

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
    <LeafletButtonGroup className="leaflet-bar" orientation="horizontal">
      {METHODS.map((method) => (
        <LeafletButton
          key={method}
          className="h-[34px] w-[34px]"
          onClick={() => setMovementMethod(method)}
        >
          {method === MovementMethod.Teleport ? <GiTeleport /> : <FaRoute />}
        </LeafletButton>
      ))}
    </LeafletButtonGroup>,
    containerRef.current,
  );
}

export default MovementMethodToggle;
