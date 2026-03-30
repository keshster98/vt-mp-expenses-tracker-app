export default {
  expo: {
    name: "mini_project_expenses_tracker",
    slug: "mini_project_expenses_tracker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },

    web: {
      favicon: "./assets/favicon.png",
    },

    plugins: [
      "expo-secure-store",
      [
        "expo-camera",
        {
          recordAudioAndroid: true,
          barcodeScannerEnabled: true,
        },
      ],
    ],
  },
};
