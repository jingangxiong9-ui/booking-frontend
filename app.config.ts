import type { ExpoConfig } from 'expo';

const config: ExpoConfig = {
  name: '预约挂号系统',
  slug: 'booking-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'bookingapp',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.booking.app',
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
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-web-browser',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: '允许预约管理App访问您的相册，以便您上传或保存图片。',
        cameraPermission: '允许预约管理App使用您的相机，以便您直接拍摄照片上传。',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission: '预约管理App需要访问您的位置以提供周边服务及导航功能。',
      },
    ],
  ],
};

export default config;
