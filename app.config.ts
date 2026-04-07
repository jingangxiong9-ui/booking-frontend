import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'https://booking-backend-caeu.onrender.com';

export default {
  name: '在线预约',
  slug: 'booking-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'bookingapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.booking.app',
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-splash-screen',
    [
      'expo-image-picker',
      {
        photosPermission: '需要访问相册以选择头像',
        cameraPermission: '需要访问相机以拍摄头像',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'booking-app',
    },
  },
} satisfies ExpoConfig;
