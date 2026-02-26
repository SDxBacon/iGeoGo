// stores/useLocationStore.ts
import { create } from 'zustand';
import { GetLocationByIP } from '@/../bindings/iGeoGo/backend/services/locationservice';

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

    try {
      const location = await GetLocationByIP();
      if (location) {
        set({
          currentLocation: { lat: location.latitude, lng: location.longitude },
          isLoading: false,
        });
      }
    } catch (err) {
      set({ currentLocation: TAIPEI_101, isLoading: false, error: '無法取得位置，已使用預設位置' });
    }
  },
}));

export default useLocationStore;
