export default {
  expo: {
    name: "mini_project_expenses_tracker",
    slug: "mini_project_expenses_tracker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    extra: {
      eas: {
        projectId: "70ddc82c-9ecc-4ab0-b2fd-0bc76fdb501a",
      },
    },

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
    },

    android: {
      package: "com.keshter98.mini_project_expenses_tracker",
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
      ["@react-native-community/datetimepicker"],
      ["expo-font"],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_AUTH_IOS_URL_SCHEME,
        },
      ],
    ],
  },
};
