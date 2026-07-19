import { Profile } from "@/firebase/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  user: User | null;
  profile: Profile | null;
  isProfileCompleted: boolean | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setProfile: (profile: Profile | null) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isProfileCompleted: null,
      loading: true,
      setUser: (user: User | null) => set({ user }),
      setLoading: (loading: boolean) => set({ loading }),
      setProfile: (profile: Profile | null) =>
        set({ profile, isProfileCompleted: profile?.profileComplete ?? false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isProfileCompleted: state.isProfileCompleted,
      }),
    },
  ),
);

export default useAuthStore;
