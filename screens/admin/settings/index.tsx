import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminSettings, updateAdminSettings, changePassword } from '@/utils/api';

const DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default function AdminSettingsScreen() {
  const router = useRouter();
  const { sessionId, logout, isFirstLogin } = useAuth();
  const [settings, setSettings] = useState<any>({
    home_title: '在线预约',
    home_subtitle: '便捷预约，贴心服务',
    doctor_name: '',
    doctor_intro: '',
    locations: [],
    unavailable_dates: [],
    admin_phone: '',
    admin_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      getAdminSettings(sessionId).then(setSettings).catch(() => {});
    }
  }, [sessionId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAdminSettings(sessionId!, {
        home_title: settings.home_title,
        home_subtitle: settings.home_subtitle,
        doctor_name: settings.doctor_name,
        doctor_intro: settings.doctor_intro,
        locations: settings.locations,
        unavailable_dates: settings.unavailable_dates,
        admin_phone: settings.admin_phone,
        admin_password: settings.admin_password,
      });
      Alert.alert('保存成功');
      if (isFirstLogin) {
        router.replace('Admin');
      }
    } catch (error) {
      Alert.alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const addLocation = () => {
    const newLocation = {
      id: Date.now().toString(),
      name: '',
      address: '',
      work_days: [1, 2, 3, 4, 5],
      schedule: {
        1: { enabled: true, time_slots: [{ time: '09:00', capacity: 10 }] },
        2: { enabled: true, time_slots: [{ time: '09:00', capacity: 10 }] },
        3: { enabled: true, time_slots: [{ time: '09:00', capacity: 10 }] },
        4: { enabled: true, time_slots: [{ time: '09:00', capacity: 10 }] },
        5: { enabled: true, time_slots: [{ time: '09:00', capacity: 10 }] },
      },
    };
    setSettings({ ...settings, locations: [...settings.locations, newLocation] });
    setEditingLocation(newLocation);
  };

  const removeLocation = (id: string) => {
    setSettings({
      ...settings,
      locations: settings.locations.filter((l: any) => l.id !== id),
    });
  };

  const updateLocation = (id: string, field: string, value: any) => {
    setSettings({
      ...settings,
      locations: settings.locations.map((l: any) =>
        l.id === id ? { ...l, [field]: value } : l
      ),
    });
  };

  const handleChangePassword = async () => {
    Alert.prompt(
      '修改密码',
      '请输入新密码（至少6位）',
      async (newPassword) => {
        if (!newPassword || newPassword.length < 6) {
          Alert.alert('密码长度至少6位');
          return;
        }
        try {
          await changePassword(sessionId!, '', newPassword);
          Alert.alert('密码修改成功');
        } catch (error: any) {
          Alert.alert('修改失败', error.message);
        }
      },
      'secure-text'
    );
  };

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>基本信息</Text>
        <View style={styles.card}>
          <Input
            label="首页标题"
            value={settings.home_title}
            onChangeText={(v) => setSettings({ ...settings, home_title: v })}
          />
          <Input
            label="首页副标题"
            value={settings.home_subtitle}
            onChangeText={(v) => setSettings({ ...settings, home_subtitle: v })}
          />
          <Input
            label="医生姓名"
            value={settings.doctor_name}
            onChangeText={(v) => setSettings({ ...settings, doctor_name: v })}
          />
          <Input
            label="医生简介"
            value={settings.doctor_intro}
            onChangeText={(v) => setSettings({ ...settings, doctor_intro: v })}
            multiline
            style={{ height: 60, textAlignVertical: 'top' }}
          />
        </View>

        <Text style={styles.sectionTitle}>坐诊地点管理</Text>
        {settings.locations?.map((location: any) => (
          <View key={location.id} style={styles.card}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationName}>{location.name || '新地点'}</Text>
              <TouchableOpacity onPress={() => removeLocation(location.id)}>
                <Text style={styles.removeBtn}>删除</Text>
              </TouchableOpacity>
            </View>
            <Input
              label="地点名称"
              placeholder="如：第一门诊部"
              value={location.name}
              onChangeText={(v) => updateLocation(location.id, 'name', v)}
            />
            <Input
              label="地点地址"
              placeholder="如：北京市朝阳区xxx路"
              value={location.address}
              onChangeText={(v) => updateLocation(location.id, 'address', v)}
            />
          </View>
        ))}
        <Button title="添加坐诊地点" variant="secondary" onPress={addLocation} style={{ marginBottom: 20 }} />

        <Text style={styles.sectionTitle}>账号设置</Text>
        <View style={styles.card}>
          <Input
            label="管理员手机号"
            placeholder="用于登录管理后台"
            keyboardType="phone-pad"
            value={settings.admin_phone}
            onChangeText={(v) => setSettings({ ...settings, admin_phone: v })}
          />
          <Input
            label="管理员密码"
            placeholder={isFirstLogin ? '请设置密码' : '留空则不修改'}
            secureTextEntry
            value={settings.admin_password}
            onChangeText={(v) => setSettings({ ...settings, admin_password: v })}
          />
        </View>

        <Button title="保存设置" onPress={handleSave} loading={loading} style={{ marginVertical: 20 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  removeBtn: {
    color: '#EF4444',
    fontSize: 14,
  },
});
