import { create } from "zustand";

interface NearbyState {
  devices: any[];
  addDevice: (device: any) => void;
  removeDevice: (peerId: string) => void;
}

export const useNearbyStore = create<NearbyState>((set) => ({
  devices: [],
  addDevice: (device) =>
    set((state) => {
      const exist = state.devices.find((d) => d.peerId === device.peerId);
      if (exist) return state;
      return { devices: [...state.devices, device] };
    }),
  removeDevice: (peerId) =>
    set((state) => ({
      devices: state.devices.filter((d) => d.peerId !== peerId),
    })),
}));
