import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, isFirstLogin } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (isFirstLogin) {
        router.replace('/admin/settings');
      } else {
        router.replace('/admin');
      }
    }
  }, [isAuthenticated, isFirstLogin]);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('提示', '请输入手机号和密码');
      return;
    }
    setLoading(true);
    try {
      await login(phone, password);
    } catch (error: any) {
      Alert.alert('登录失败', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>管理登录</Text>
          <Text style={styles.subtitle}>请输入管理员账号密码</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="手机号"
            placeholder="请输入手机号"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Input
            label="密码"
            placeholder="请输入密码"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="登录" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    flex: 1,
  },
});
