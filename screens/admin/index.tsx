import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { getPendingCount, getAdminAppointments, confirmAppointment, deleteAppointment } from '@/utils/api';

const STATUS_TEXT: Record<string, { text: string; color: string }> = {
  pending: { text: '待确认', color: '#F59E0B' },
  confirmed: { text: '已确认', color: '#10B981' },
  cancelled: { text: '已取消', color: '#9CA3AF' },
  completed: { text: '已完成', color: '#4F46E5' },
};

export default function AdminScreen() {
  const router = useSafeRouter();
  const { isAuthenticated, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('pending');

  const loadData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [count, list] = await Promise.all([
        getPendingCount(''),
        getAdminAppointments('', filter === 'all' ? {} : { status: filter }),
      ]);
      setPendingCount(count.count);
      setAppointments(list);
    } catch (error) {
      console.error('加载失败', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        loadData();
      }
    }, [isAuthenticated, filter])
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated]);

  const handleConfirm = async (id: number) => {
    try {
      await confirmAppointment('', id);
      loadData();
    } catch (error) {
      Alert.alert('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('确认删除', '确定删除这条预约记录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: async () => {
        try {
          await deleteAppointment('', id);
          loadData();
        } catch (error) {
          Alert.alert('操作失败');
        }
      }},
    ]);
  };

  if (!isAuthenticated) return null;

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>管理后台</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push('AdminSettings')}>
              <Text style={styles.headerButton}>设置</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <Text style={styles.headerButton}>退出</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{pendingCount}</Text>
            <Text style={styles.statLabel}>待确认</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {(['pending', 'confirmed', 'all'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterItem, filter === f && styles.filterItemActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? '全部' : f === 'pending' ? '待确认' : '已确认'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadData} />
          }
          renderItem={({ item }) => {
            const status = STATUS_TEXT[item.status] || { text: item.status, color: '#9CA3AF' };
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.patientName}>{item.patient_name}</Text>
                    <Text style={styles.patientInfo}>{item.patient_phone} · {item.patient_gender === 'male' ? '男' : '女'} · {item.patient_age}岁</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
                  </View>
                </View>
                
                <View style={styles.cardBody}>
                  <Text style={styles.appointmentInfo}>📅 {item.appointment_date} {item.time_slot}</Text>
                  {item.chief_complaint && (
                    <Text style={styles.complaint}>病情：{item.chief_complaint}</Text>
                  )}
                </View>

                {item.status === 'pending' && (
                  <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.confirmBtn} onPress={() => handleConfirm(item.id)}>
                      <Text style={styles.confirmBtnText}>确认</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                      <Text style={styles.deleteBtnText}>删除</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>暂无数据</Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    color: '#fff',
    fontSize: 14,
  },
  stats: {
    padding: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  filterItemActive: {
    backgroundColor: '#4F46E5',
  },
  filterText: {
    fontSize: 13,
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  patientInfo: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  appointmentInfo: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  complaint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
