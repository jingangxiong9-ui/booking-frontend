import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="book/index" />
        <Stack.Screen name="book/query/index" />
        <Stack.Screen name="admin/index" />
        <Stack.Screen name="admin/login/index" />
        <Stack.Screen name="admin/settings/index" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
