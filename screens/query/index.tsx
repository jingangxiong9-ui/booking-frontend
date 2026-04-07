import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { queryAppointments, cancelAppointment, Appointment } from '@/utils/api';

const STATUS_TEXT: Record<string, { text: string; color: string }> = {
  pending: { text: '待确认', color: '#F59E0B' },
  confirmed: { text: '已确认', color: '#10B981' },
  cancelled: { text: '已取消', color: '#9CA3AF' },
  completed: { text: '已完成', color: '#4F46E5' },
};

export default function QueryScreen() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phone) {
      Alert.alert('提示', '请输入手机号');
      return;
    }
    setLoading(true);
    try {
      const result = await queryAppointments(phone, code || undefined);
      setAppointments(result);
      setSearched(true);
    } catch (error) {
      Alert.alert('查询失败', '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (item: Appointment) => {
    Alert.alert('确认取消', `确定要取消 ${item.appointment_date} ${item.time_slot} 的预约吗？`, [
      { text: '否', style: 'cancel' },
      {
        text: '是',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelAppointment(item.id, item.patient_phone);
            handleSearch();
          } catch (error) {
            Alert.alert('取消失败', '请稍后重试');
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <Input
            placeholder="请输入手机号"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Input
            placeholder="预约号后4位（选填）"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <Button title="查询" onPress={handleSearch} loading={loading} />
        </View>

        {searched && (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>
              {appointments.length > 0 ? `找到 ${appointments.length} 条预约` : '未找到预约记录'}
            </Text>
            
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const status = STATUS_TEXT[item.status] || { text: item.status, color: '#9CA3AF' };
                return (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardId}>预约号：{item.id}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.cardBody}>
                      <Text style={styles.infoText}>日期：{item.appointment_date}</Text>
                      <Text style={styles.infoText}>时间：{item.time_slot}</Text>
                      <Text style={styles.infoText}>姓名：{item.patient_name}</Text>
                      <Text style={styles.infoText}>性别：{item.patient_gender === 'male' ? '男' : '女'}</Text>
                      <Text style={styles.infoText}>年龄：{item.patient_age}岁</Text>
                      {item.chief_complaint && (
                        <Text style={styles.infoText}>病情：{item.chief_complaint}</Text>
                      )}
                    </View>

                    {item.status === 'pending' && (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancel(item)}
                      >
                        <Text style={styles.cancelText}>取消预约</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>暂无预约记录</Text>
                </View>
              }
            />
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchBox: {
    paddingVertical: 20,
  },
  result: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardId: {
    fontSize: 13,
    color: '#6B7280',
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
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  cancelText: {
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
