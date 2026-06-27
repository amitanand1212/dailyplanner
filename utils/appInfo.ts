import Constants from "expo-constants";

/**
 * Central place for the metadata shown across the legal / info screens.
 * Update these before publishing to the Play Store.
 */
export const APP_NAME = "Daily Planner";

/** Pulled from app.json so the About screen always matches the build. */
export const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

/** Support inbox shown across the app's Help, About, Privacy and Terms screens. */
export const SUPPORT_EMAIL = "hello@lush-app.com";

export const DEVELOPER_NAME = "Daily Planner";
