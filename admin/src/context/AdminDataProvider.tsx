import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { isFirebaseConfigured } from "../firebase/config";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { subscribeToSosAlerts } from "../services/sosService";
import { subscribeToUsers } from "../services/userService";
import { subscribeToAdministrators } from "../services/adminManagementService";
import type { SosAlert } from "../types/sos";
import type { AdminUser } from "../types/user";
import type { SystemAdministrator } from "../types/adminManagement";
import { getUserIncidentSummaries } from "../utils/users";
import { AdminDataContext, type AdminDataContextValue } from "./AdminDataContext";

type AdminDataProviderProps = {
  children: ReactNode;
};

const restrictedMessage =
  "Firebase Auth is available, but the signed-in user does not have a valid admin role claim. Firestore reads are blocked in the web admin until that server-side authorization exists.";

function AdminDataProvider({ children }: AdminDataProviderProps) {
  const { user, isLoading, isAdminAuthorized, role, isSuperAdmin, errorMessage } = useFirebaseAuth();
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [administrators, setAdministrators] = useState<SystemAdministrator[]>([]);
  const [listenerStatus, setListenerStatus] = useState<AdminDataContextValue["status"]>("loading");
  const [listenerMessage, setListenerMessage] = useState("Preparing Firebase listeners.");

  useEffect(() => {
    if (!isFirebaseConfigured() || isLoading || !user || !isAdminAuthorized) {
      return undefined;
    }

    let sosLoaded = false;
    let usersLoaded = false;
    let currentSosAlerts: SosAlert[] = [];

    const refreshReadyState = () => {
      if (!sosLoaded || !usersLoaded) {
        return;
      }

      setListenerStatus(currentSosAlerts.length === 0 ? "empty" : "ready");
      setListenerMessage(
        currentSosAlerts.length === 0
          ? "Firestore is reachable, but there are no SOS records to display."
          : "Firestore real-time data is connected in read-only mode.",
      );
    };

    const unsubscribeSos = subscribeToSosAlerts(
      (nextSosAlerts) => {
        sosLoaded = true;
        currentSosAlerts = nextSosAlerts;
        setSosAlerts(nextSosAlerts);
        refreshReadyState();
      },
      (error) => {
        setListenerStatus(error.message.toLowerCase().includes("permission") ? "restricted" : "error");
        setListenerMessage(error.message);
      },
    );

    const unsubscribeUsers = subscribeToUsers(
      (nextUsers) => {
        usersLoaded = true;
        setUsers(nextUsers);
        refreshReadyState();
      },
      (error) => {
        setListenerStatus(error.message.toLowerCase().includes("permission") ? "restricted" : "error");
        setListenerMessage(error.message);
      },
    );

    let unsubscribeAdmins: (() => void) | undefined;
    if (isSuperAdmin) {
      unsubscribeAdmins = subscribeToAdministrators(
        (nextAdmins) => {
          setAdministrators(nextAdmins);
        },
        (error) => {
          console.error("Failed to subscribe to administrators:", error);
        }
      );
    }

    return () => {
      unsubscribeSos();
      unsubscribeUsers();
      if (unsubscribeAdmins) {
        unsubscribeAdmins();
      }
    };
  }, [isAdminAuthorized, isLoading, user, isSuperAdmin]);

  const value = useMemo<AdminDataContextValue>(() => {
    if (!isFirebaseConfigured()) {
      return {
        sosAlerts: [],
        users: [],
        administrators: [],
        status: "config-missing",
        message: "Admin Firebase environment variables are missing. Use VITE_FIREBASE_* values for the web app.",
        role: null,
        isSuperAdmin: false,
      };
    }

    if (isLoading) {
      return {
        sosAlerts: [],
        users: [],
        administrators: [],
        status: "loading",
        message: "Checking Firebase authentication state.",
        role: null,
        isSuperAdmin: false,
      };
    }

    if (errorMessage) {
      return {
        sosAlerts: [],
        users: [],
        administrators: [],
        status: "error",
        message: errorMessage,
        role: null,
        isSuperAdmin: false,
      };
    }

    if (!user) {
      return {
        sosAlerts: [],
        users: [],
        administrators: [],
        status: "unauthorized",
        message: "Sign in with Firebase Auth before accessing admin data.",
        role: null,
        isSuperAdmin: false,
      };
    }

    if (!isAdminAuthorized) {
      return {
        sosAlerts: [],
        users: [],
        administrators: [],
        status: "restricted",
        message: restrictedMessage,
        role: null,
        isSuperAdmin: false,
      };
    }

    return {
      sosAlerts,
      users: getUserIncidentSummaries(users, sosAlerts),
      administrators,
      status: listenerStatus,
      message: listenerMessage,
      role,
      isSuperAdmin,
    };
  }, [errorMessage, isAdminAuthorized, isLoading, listenerMessage, listenerStatus, sosAlerts, user, users, administrators, role, isSuperAdmin]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export default AdminDataProvider;
