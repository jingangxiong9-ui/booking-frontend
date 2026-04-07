import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'web' ? 55 : 50 + insets.bottom,
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="home" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: '预约',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="calendar-plus" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="query"
        options={{
          title: '查询',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="search" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
