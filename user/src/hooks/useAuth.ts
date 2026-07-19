import { auth } from "@/firebase/firebase";
import { getProfile } from "@/firebase/profile";
import useAuthStore from "@/store/authStore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect } from "react";

const useAuth = () => {
  const { setUser, setProfile, user, setLoading, profile } = useAuthStore();

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser: User | null) => {
        if (currentUser) {
          setUser(currentUser);

          try {
            const existingProfile = useAuthStore.getState().profile;
            if (
              !existingProfile ||
              !existingProfile.profileComplete ||
              !existingProfile.emergencyContact?.length
            ) {
              const profileData = await getProfile();
              setProfile(profileData);
            }
          } catch (err) {
            console.error("Failed to fetch profile:", err);
          } finally {
            setLoading(false);
          }
          // console.log("User logged in:", currentUser);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
          console.log("User logged out");
        }
      },
    );

    return () => unsubscribe();
  }, []);
  return { user, profile };
};

export default useAuth;
