// {
//   "expo": {
//     "name": "Narrato",
//     "slug": "narrato",
//     "version": "1.0.0",
//     "orientation": "portrait",
//     "icon": "./assets/icon.png",
//     "userInterfaceStyle": "light",
//     "newArchEnabled": true,
//     "splash": {
//       "image": "./assets/narrato_splash.png",
//       "resizeMode": "contain",
//       "backgroundColor": "#ffffff"
//     },
//     "ios": {
//       "supportsTablet": true,
//       "bundleIdentifier": "com.ihirendev.narrato"
//     },
//     "android": {
//       "adaptiveIcon": {
//         "foregroundImage": "./assets/adaptive-icon.png",
//         "backgroundColor": "#ffffff"
//       },
//       "versionCode": 5,
//       "blockedPermissions": [
//         "android.permission.RECORD_AUDIO"
//       ],
//       "permissions": [
//         "VIBRATE",
//         "INTERNET"],
//       "package": "com.ihirendev.narrato"
//     },
//     "web": {
//       "bundler": "metro",
//       "favicon": "./assets/favicon.png"
//     },
//     "extra": {
//       "eas": {
//         "projectId": "12d4e220-19a7-4eb8-a9a3-e4379f8ecadf"
//       }
//     },
//     "owner": "ihirendev",
//     "plugins": [
//       "expo-font"
//     ]
//   }
// }

import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    name: "Narrato",
    slug: "narrato",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/narrato_icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,

    splash: {
      image: "./assets/narrato_splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ihirendev.narrato"
    },

    android: {
      package: "com.ihirendev.narrato",
      versionCode: 3,
      navigationBar:{
        visible: "true",
        backgroundColor: "#ffffffff",
        position:"absolute"
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      // You do NOT need RECORD_AUDIO. Remove it.
      blockedPermissions: ["android.permission.RECORD_AUDIO"],
      permissions: ["INTERNET", "VIBRATE"]
    },

    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png"
    },

    extra: {
      // EXPO_PUBLIC variables work locally with .env
      // EAS secrets replace them in the cloud
      openai_api_key: process.env.EXPO_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
      deepseek_api_key: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY,
      gemini_ai_api_key: process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY,

      aws_access_key_id: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
      aws_secret_access_key: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,

      eas: {
        projectId: "12d4e220-19a7-4eb8-a9a3-e4379f8ecadf"
      }
    },

    owner: "ihirendev",
    plugins: ["expo-font"]
  };
};

