import { useEffect, useRef, useState } from 'react';
import { useMapEvents } from 'react-leaflet/hooks';
import type { LatLng } from 'leaflet';

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  latlng: LatLng | null;
}

interface MapContextMenuHandlerProps {
  onOpen: (state: Omit<ContextMenuState, 'visible'>) => void;
  onClose: () => void;
}

// 必須放在 MapContainer 內部
export function MapContextMenuHandler({ onOpen, onClose }: MapContextMenuHandlerProps) {
  useMapEvents({
    contextmenu(e) {
      e.originalEvent.preventDefault();
      onOpen({
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY,
        latlng: e.latlng,
      });
    },
    click() {
      onClose();
    },
    /**
     * not sure if we need to close the menu on these events, but just in case the user starts dragging or zooming after right-clicking
     * stay observant
     */
    // dragstart() {
    //   onClose();
    // },
    // zoomstart() {
    //   onClose();
    // },
  });
  return null;
}

interface MapContextMenuProps extends ContextMenuState {
  onClose: () => void;
}

function MapContextMenu({ visible, x, y, latlng, onClose }: MapContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  // 計算後的位置，null 表示尚未計算（用 visibility: hidden 避免閃爍）
  const [clampedPos, setClampedPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!visible) {
      setClampedPos(null);
      return;
    }
    // 等 DOM 渲染後再量測選單尺寸，計算視窗邊界內的位置
    const frame = requestAnimationFrame(() => {
      if (!menuRef.current) return;
      const { offsetWidth, offsetHeight } = menuRef.current;
      const MARGIN = 4;
      const left = Math.max(0, Math.min(x, window.innerWidth - offsetWidth - MARGIN));
      const top = Math.max(0, Math.min(y, window.innerHeight - offsetHeight - MARGIN));
      setClampedPos({ left, top });
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, x, y]);

  if (!visible || !latlng) return null;

  const menuItems = [
    { label: '選項 A', onClick: () => onClose() },
    { label: '選項 B', onClick: () => onClose() },
  ];

  return (
    <>
      {/* 透明背景層，左鍵或右鍵都關閉選單，並阻止事件傳到 Leaflet */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      {/* 浮動選單：位置已夾在視窗內，計算前隱藏以避免閃爍 */}
      <div
        ref={menuRef}
        className="fixed z-[9999] min-w-36 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10"
        style={{
          left: clampedPos?.left ?? x,
          top: clampedPos?.top ?? y,
          visibility: clampedPos ? 'visible' : 'hidden',
        }}
        onContextMenu={(e) => e.preventDefault()} // to prevent default context menu on the menu itself
      >
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
            onClick={item.onClick}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}

export default MapContextMenu;
