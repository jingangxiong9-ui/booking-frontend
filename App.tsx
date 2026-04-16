import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

// Screens
import HomeScreen from '@/screens/home';
import BookScreen from '@/screens/book';
import QueryScreen from '@/screens/query';
import AdminLoginScreen from '@/screens/admin/login';
import AdminIndexScreen from '@/screens/admin';
import AdminSettingsScreen from '@/screens/admin/settings';

const Stack = createStackNavigator();

// 保持 SplashScreen 可见直到准备就绪
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // 预加载字体、进行其他异步准备
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '预约挂号系统', headerShown: false }}
        />
        <Stack.Screen
          name="Book"
          component={BookScreen}
          options={{ title: '预约挂号' }}
        />
        <Stack.Screen
          name="Query"
          component={QueryScreen}
          options={{ title: '预约查询' }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ title: '医生登录' }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminIndexScreen}
          options={{ title: '管理后台' }}
        />
        <Stack.Screen
          name="AdminSettings"
          component={AdminSettingsScreen}
          options={{ title: '设置' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
