import 'dotenv/config';

export default {
  expo: {
    name: "Sensu",
    slug: "Sensu",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "sensu",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.API_KEY_GMAPS,
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      config: {
        googleMaps: {
          apiKey: process.env.API_KEY_GMAPS,
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      API_KEY_GMAPS: process.env.API_KEY_GMAPS,
      WATCH_LOCATION_API: process.env.WATCH_LOCATION_API,
      WATCH_SERVER_URL: process.env.WATCH_SERVER_URL || 'http://192.168.1.65:8000',
      WATCH_IMEI_CODE: process.env.WATCH_IMEI_CODE || '861265062812547',
    }
  }
};
