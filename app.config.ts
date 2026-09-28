import { ConfigContext, ExpoConfig } from 'expo/config';

// Branding and identifiers come from the environment so the same source builds the
// upstream Chatwoot app or a white-labelled fork (see .env.example).
const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || 'Chatwoot';
const APP_ID = process.env.EXPO_PUBLIC_APP_ID || 'com.chatwoot.app';
const APP_SCHEME = process.env.EXPO_PUBLIC_APP_SCHEME || 'chatwootapp';
// Hosts whose conversation links open the app (comma-separated).
const DEEP_LINK_HOSTS = (process.env.EXPO_PUBLIC_DEEP_LINK_HOSTS || 'app.chatwoot.com')
  .split(',')
  .map((host: string) => host.trim())
  .filter(Boolean);

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    name: APP_NAME,
    slug: process.env.EXPO_PUBLIC_APP_SLUG || 'chatwoot-mobile',
    version: '4.9.6',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    scheme: APP_SCHEME,
    ios: {
      supportsTablet: true,
      bundleIdentifier: APP_ID,
      infoPlist: {
        NSCameraUsageDescription:
          'This app requires access to the camera to upload images and videos.',
        NSPhotoLibraryUsageDescription:
          'This app requires access to the photo library to upload images.',
        NSMicrophoneUsageDescription: 'This app requires access to the microphone to record audio.',
        NSAppleMusicUsageDescription:
          'This app does not use Apple Music, but a system API may require this permission.',
        UIBackgroundModes: ['fetch', 'remote-notification'],
        ITSAppUsesNonExemptEncryption: false,
      },
      // Please use the relative path to the google-services.json file
      googleServicesFile: process.env.EXPO_PUBLIC_IOS_GOOGLE_SERVICES_FILE,
      entitlements: { 'aps-environment': 'production' },
      associatedDomains: DEEP_LINK_HOSTS.map((host: string) => `applinks:${host}`),
    },
    android: {
      adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' },
      package: APP_ID,
      permissions: [
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO',
        'android.permission.POST_NOTIFICATIONS',
      ],
      // Please use the relative path to the google-services.json file
      googleServicesFile: process.env.EXPO_PUBLIC_ANDROID_GOOGLE_SERVICES_FILE,
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: DEEP_LINK_HOSTS.map((host: string) => ({
            scheme: 'https',
            host,
            pathPrefix: '/app/accounts/',
            pathPattern: '/*/conversations/*',
          })),
          category: ['BROWSABLE', 'DEFAULT'],
        },
        {
          action: 'VIEW',
          data: [
            {
              scheme: APP_SCHEME,
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    extra: {
      eas: {
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
        storybookEnabled: process.env.EXPO_STORYBOOK_ENABLED,
      },
    },
    owner: process.env.EXPO_PUBLIC_EXPO_OWNER || 'chatwoot',
    plugins: [
      'expo-font',
      'expo-image',
      'expo-status-bar',
      [
        'expo-splash-screen',
        {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          enableFullScreenImage_legacy: true,
        },
      ],
      [
        'react-native-permissions',
        { iosPermissions: ['Camera', 'PhotoLibrary', 'MediaLibrary', 'Notifications'] },
      ],
      [
        '@sentry/react-native',
        {
          url: 'https://sentry.io/',
          project: process.env.EXPO_PUBLIC_SENTRY_PROJECT_NAME,
          organization: process.env.EXPO_PUBLIC_SENTRY_ORG_NAME,
        },
      ],
      'expo-web-browser',
      '@react-native-community/datetimepicker',
      '@react-native-firebase/app',
      '@react-native-firebase/messaging',
      [
        'expo-build-properties',
        {
          // compileSdk/targetSdk 36 = Expo SDK 54 / RN 0.81 default (Android 16).
          // notifee (issue #808) needs compileSdk >= 35, satisfied by 36.
          android: {
            minSdkVersion: 24,
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            enableProguardInReleaseBuilds: true,
          },
          // Xcode 27 / iOS 27 refuse to launch apps without the UIKit scene lifecycle
          // (expo/expo#46664). SDK 57 needs this opt-in; SDK 58+ enables it by default.
          ios: {
            enableSceneSupport: true,
          },
        },
      ],
      './with-ffmpeg-pod.js',
      './with-android-notification-channel.js',
      './with-notifee-maven-repo.js',
      './with-ios-modular-headers.js',
    ],
    androidNavigationBar: { backgroundColor: '#ffffff' },
  };
};
