/**
 * RouteLayer - 當 currentLocation 取得後，自動規劃並繪製前往台北 101 的道路路線。
 * 使用 OSRM Public API 取得真實道路路徑，透過 react-leaflet Polyline 渲染。
 */
import { useEffect, useState } from 'react';
import { Marker, Polyline } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';
import L from 'leaflet';
import useLocationStore from '@/stores/useLocationStore';

// 目的地：台北 101
const TAIPEI_101: [number, number] = [25.0338, 121.5645];
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

const RouteLayer = () => {
  const currentLocation = useLocationStore((state) => state.currentLocation);
  const map = useMap();
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!currentLocation) return;

    const { lat, lng } = currentLocation;
    const [dstLat, dstLng] = TAIPEI_101;
    const url = `${OSRM_BASE_URL}/${lng},${lat};${dstLng},${dstLat}?overview=full&geometries=geojson`;

    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        // OSRM 回傳 [lng, lat]，需轉換為 Leaflet 的 [lat, lng]
        const coords: [number, number][] = (
          data.routes[0].geometry.coordinates as [number, number][]
        ).map(([routeLng, routeLat]) => [routeLat, routeLng]);

        setRouteCoords(coords);

        // 縮放地圖以顯示完整路線
        const bounds = L.latLngBounds([[lat, lng], TAIPEI_101]);
        map.fitBounds(bounds, { padding: [50, 50] });
      })
      .catch(() => {
        // fetch 被取消或失敗時靜默處理
      });

    return () => controller.abort();
  }, [currentLocation, map]);

  if (!currentLocation || routeCoords.length === 0) return null;

  return (
    <>
      {/* 藍色道路路線 */}
      <Polyline positions={routeCoords} color="#3b82f6" weight={4} opacity={0.8} />
      {/* 目的地標記：台北 101 */}
      <Marker position={TAIPEI_101} />
    </>
  );
};

export default RouteLayer;
