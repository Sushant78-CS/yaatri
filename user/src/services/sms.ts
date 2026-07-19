import * as SMS from "expo-sms";

export const sendEmergencySMS = async (
  phoneNumbers: string[],
  message: string,
) => {
  const isAvailable = await SMS.isAvailableAsync();
  if (!isAvailable) {
    console.log("SMS is not available");
    return;
  }
  await SMS.sendSMSAsync(phoneNumbers, message);
};
