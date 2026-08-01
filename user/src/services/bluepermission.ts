import { PermissionsAndroid, Platform } from "react-native";

const requestBluetoothPermission = async () => {
  if (Platform.OS !== "android") return true;

  const permission = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
  ]);

  console.log("[Bluetooth] Permissions:", permission);

  return Object.values(permission).every(
    (value) => value === PermissionsAndroid.RESULTS.GRANTED,
  );
};



export default requestBluetoothPermission;
