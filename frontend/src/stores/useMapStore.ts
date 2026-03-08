import { create } from 'zustand';
import { MovementMethod } from '@/constants/movementMethod';

interface MapStore {
  movementMethod: MovementMethod;
  setMovementMethod: (method: MovementMethod) => void;
}

const useMapStore = create<MapStore>((set) => ({
  movementMethod: MovementMethod.Teleport,
  setMovementMethod: (method) => set({ movementMethod: method }),
}));

export default useMapStore;
