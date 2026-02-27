// stores/useLocationStore.ts
import { create } from 'zustand';
import {
  GetLocationByIP,
  GetNativeLocation,
} from '@/../bindings/iGeoGo/backend/services/locationservice';

export interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationStore {
  currentLocation: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  init: () => void;
}

// 台北 101 作為 fallback
const TAIPEI_101: Coordinates = { lat: 25.0339, lng: 121.5645 };

export const useLocationStore = create<LocationStore>((set) => ({
  currentLocation: null,
  isLoading: false,
  error: null,

  init: async () => {
    set({ isLoading: true, error: null });

    // 優先使用原生 CoreLocation（macOS，精確，會觸發系統授權對話框）
    try {
      const native = await GetNativeLocation();
      if (native) {
        set({
          currentLocation: { lat: native.latitude, lng: native.longitude },
          isLoading: false,
        });
        return;
      }
    } catch {
      // 授權被拒絕、不支援或超時，降級至 IP 定位
    }

    // Fallback：IP 定位（精確度較低，但不需授權）
    try {
      const location = await GetLocationByIP();
      if (location) {
        set({
          currentLocation: { lat: location.latitude, lng: location.longitude },
          isLoading: false,
        });
      }
    } catch {
      set({ currentLocation: TAIPEI_101, isLoading: false, error: '無法取得位置，已使用預設位置' });
    }
  },
}));

export default useLocationStore;
