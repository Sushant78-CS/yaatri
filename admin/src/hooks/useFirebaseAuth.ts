import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getIdTokenResult } from "firebase/auth";
import { subscribeToAuthUser } from "../services/authService";

export type FirebaseAuthState = {
  user: User | null;
  isLoading: boolean;
  isAdminAuthorized: boolean;
  role: "admin" | "superadmin" | null;
  isSuperAdmin: boolean;
  errorMessage: string | null;
};

export const useFirebaseAuth = (): FirebaseAuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [role, setRole] = useState<"admin" | "superadmin" | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToAuthUser((nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setIsAdminAuthorized(false);
        setRole(null);
        setIsSuperAdmin(false);
        setIsLoading(false);
        return;
      }

      void getIdTokenResult(nextUser)
        .then((tokenResult) => {
          if (!isMounted) {
            return;
          }

          const userRole = tokenResult.claims.role;
          const isValidRole = userRole === "admin" || userRole === "superadmin";

          setIsAdminAuthorized(isValidRole);
          setRole(isValidRole ? (userRole as "admin" | "superadmin") : null);
          setIsSuperAdmin(userRole === "superadmin");
          setErrorMessage(null);
        })
        .catch((error) => {
          if (!isMounted) {
            return;
          }

          setIsAdminAuthorized(false);
          setRole(null);
          setIsSuperAdmin(false);
          setErrorMessage(error instanceof Error ? error.message : "Unable to inspect Firebase Auth claims.");
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { user, isLoading, isAdminAuthorized, role, isSuperAdmin, errorMessage };
};
