import { Alert } from "react-native";
import AndroidOpenSettings from "react-native-android-open-settings";
import { BleManager, Device } from "react-native-ble-plx";

// console.log("AndroidOpenSettings", AndroidOpenSettings);

const bleManager = new BleManager();

export default bleManager;

export const scanBluetoothDevices = async (
  onDeviceFound: (device: Device) => void,
  onError?: (error: Error) => void,
  onScanComplete?: () => void,
) => {
  const state = await bleManager.state();
  console.log("BLE State:", state);
  if (state !== "PoweredOn") {
    Alert.alert(
      "BLE is not powered on",
      "Please enable Bluetooth and try again",
      [
        {
          text: "Open Settings",
          onPress: () => {
            AndroidOpenSettings.bluetoothSettings();
          },
        },
      ],
    );
    console.log("BLE is not powered on");
    return;
  }
  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      onError?.(error);
      return;
    }

    if (device) {
      onDeviceFound(device);
    }
  });

  setTimeout(() => {
    bleManager.stopDeviceScan();
    onScanComplete?.();
    console.log("Scan stopped");
  }, 10000);
};

export const connectToDevice = async (device: Device) => {
  try {
    console.log("Connecting to device name:", device.name);

    const connected = await device.connect();
    const isConnected = await connected.isConnected();
    console.log("isConnected to device:", isConnected);

    await connected.discoverAllServicesAndCharacteristics();

    console.log("Connected to device:", connected.name);
    return connected;
  } catch (err) {
    console.error("Error connecting to device:", err);
    return null;
  }
};
