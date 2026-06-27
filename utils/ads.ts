import { Platform } from "react-native";
import Constants from "expo-constants";

/** Native ads SDK isn't available in Expo Go — guard usage (same as notifications). */
export const isExpoGo = Constants.appOwnership === "expo";

/** Reserved layout height (dp) for the anchored banner, used to offset other UI. */
export const BANNER_HEIGHT = 60;

/**
 * Real AdMob banner unit ID for Android. The iOS slot stays on Google's test
 * unit since there's no iOS AdMob app yet (the app targets Android/Play Store).
 */
export const BANNER_AD_UNIT_ID =
  Platform.select({
    android: "ca-app-pub-7760368408975742/1746747389",
    ios: "ca-app-pub-3940256099942544/2934735716",
  }) ?? "ca-app-pub-7760368408975742/1746747389";

/**
 * Add a physical device's test-device ID here to see TEST ads on it (so you
 * never tap your own live ads — that risks an AdMob suspension). The ID is
 * printed in the device log on the first ad load; emulators are covered by
 * the "EMULATOR" entry automatically.
 */
const TEST_DEVICE_IDS: string[] = ["EMULATOR"];

/** Initialize the Mobile Ads SDK once at app start. No-op in Expo Go. */
export async function initializeAds() {
  if (isExpoGo) return;
  try {
    // Lazy require so Expo Go never evaluates the native ads module.
    const mobileAds = require("react-native-google-mobile-ads").default;
    await mobileAds().setRequestConfiguration({
      testDeviceIdentifiers: TEST_DEVICE_IDS,
    });
    await mobileAds().initialize();
  } catch {
    // SDK unavailable — ignore.
  }
}
