import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Screen } from '@/components/Screen';
import { getConfig } from '@/utils/api';
import { useSafeRouter } from '@/hooks/useSafeRouter';

export default function HomeScreen() {
  const router = useSafeRouter();
  const [config, setConfig] = useState<any>({
    home_title: '在线预约',
    home_subtitle: '便捷预约，贴心服务',
    doctor_name: '',
    doctor_intro: '',
    doctor_avatar: '',
  });

  useEffect(() => {
    getConfig().then(setConfig).catch(() => {});
  }, []);

  return (
    <Screen scroll={false}>
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{config.home_title}</Text>
          <Text style={styles.heroSubtitle}>{config.home_subtitle}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.doctorCard}>
          {config.doctor_avatar ? (
            <Image source={{ uri: config.doctor_avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>医</Text>
            </View>
          )}
          <Text style={styles.doctorName}>{config.doctor_name || '医生'}</Text>
          <Text style={styles.doctorIntro}>{config.doctor_intro || '专业医疗服务'}</Text>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('Book')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#EEF2FF' }]}>
              <Text style={styles.menuEmoji}>📅</Text>
            </View>
            <Text style={styles.menuTitle}>预约挂号</Text>
            <Text style={styles.menuDesc}>选择时间，快速预约</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('Query')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.menuEmoji}>🔍</Text>
            </View>
            <Text style={styles.menuTitle}>预约查询</Text>
            <Text style={styles.menuDesc}>查看预约状态</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.adminButton}
          onPress={() => router.push('AdminLogin')}
        >
          <Text style={styles.adminButtonText}>管理入口</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#4F46E5',
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    marginTop: -30,
    paddingHorizontal: 20,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  doctorIntro: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  menu: {
    gap: 12,
    marginBottom: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuEmoji: {
    fontSize: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  menuDesc: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  adminButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  adminButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
