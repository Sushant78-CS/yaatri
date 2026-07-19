import { PermissionsAndroid, Platform } from "react-native";

const requestBluetoothPermission = async () => {
  if (Platform.OS !== "android") return true;

  const permission = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);

  return Object.values(permission).every(
    (value) => value === PermissionsAndroid.RESULTS.GRANTED,
  );
};

export default requestBluetoothPermission;
