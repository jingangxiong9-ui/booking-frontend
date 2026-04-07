import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { getLocations, getAvailableDates, getTimeSlots, createAppointment } from '@/utils/api';
import { useSafeRouter } from '@/hooks/useSafeRouter';

const DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default function BookScreen() {
  const router = useSafeRouter();
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_gender: 'male',
    patient_age: '',
    chief_complaint: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    getLocations().then(setLocations).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setAvailableDates([]);
      setSelectedDate('');
      setTimeSlots([]);
      setSelectedSlot('');
      getAvailableDates(selectedLocation).then(setAvailableDates).catch(() => {});
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedLocation && selectedDate) {
      setTimeSlots([]);
      setSelectedSlot('');
      getTimeSlots(selectedLocation, selectedDate).then(setTimeSlots).catch(() => {});
    }
  }, [selectedLocation, selectedDate]);

  const handleSubmit = async () => {
    if (!formData.patient_name || !formData.patient_phone || !formData.patient_age) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.patient_phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    setLoading(true);
    try {
      const result = await createAppointment({
        location_id: selectedLocation,
        appointment_date: selectedDate,
        time_slot: selectedSlot,
        patient_name: formData.patient_name,
        patient_phone: formData.patient_phone,
        patient_gender: formData.patient_gender,
        patient_age: parseInt(formData.patient_age),
        chief_complaint: formData.chief_complaint,
      });
      
      Alert.alert('预约成功', `预约号：${result.id}`, [
        { text: '确定', onPress: () => router.replace('/') }
      ]);
    } catch (error: any) {
      Alert.alert('预约失败', error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedLocationData = locations.find(l => l.id === selectedLocation);

  return (
    <Screen>
      <View style={styles.container}>
        {/* 步骤指示器 */}
        <View style={styles.steps}>
          <View style={[styles.step, step >= 1 && styles.stepActive]}>
            <Text style={[styles.stepText, step >= 1 && styles.stepTextActive]}>1</Text>
            <Text style={styles.stepLabel}>选择地点</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.step, step >= 2 && styles.stepActive]}>
            <Text style={[styles.stepText, step >= 2 && styles.stepTextActive]}>2</Text>
            <Text style={styles.stepLabel}>选择时间</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.step, step >= 3 && styles.stepActive]}>
            <Text style={[styles.stepText, step >= 3 && styles.stepTextActive]}>3</Text>
            <Text style={styles.stepLabel}>填写信息</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 步骤1：选择地点 */}
          {step === 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>选择坐诊地点</Text>
              {locations.map(location => (
                <TouchableOpacity
                  key={location.id}
                  style={[styles.locationItem, selectedLocation === location.id && styles.locationItemActive]}
                  onPress={() => setSelectedLocation(location.id)}
                >
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationAddress}>{location.address}</Text>
                  </View>
                  {selectedLocation === location.id && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              {selectedLocation && (
                <Button title="下一步" onPress={() => setStep(2)} style={{ marginTop: 20 }} />
              )}
            </View>
          )}

          {/* 步骤2：选择日期和时间 */}
          {step === 2 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>选择日期</Text>
              <View style={styles.dateGrid}>
                {availableDates.slice(0, 14).map(date => {
                  const d = new Date(date);
                  return (
                    <TouchableOpacity
                      key={date}
                      style={[styles.dateItem, selectedDate === date && styles.dateItemActive]}
                      onPress={() => setSelectedDate(date)}
                    >
                      <Text style={[styles.dateDay, selectedDate === date && styles.dateDayActive]}>
                        {DAYS[d.getDay()]}
                      </Text>
                      <Text style={[styles.dateNum, selectedDate === date && styles.dateNumActive]}>
                        {d.getDate()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedDate && timeSlots.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: 24 }]}>选择时间</Text>
                  <View style={styles.slotGrid}>
                    {timeSlots.map(slot => (
                      <TouchableOpacity
                        key={slot.time}
                        style={[
                          styles.slotItem,
                          !slot.available && styles.slotItemDisabled,
                          selectedSlot === slot.time && styles.slotItemActive
                        ]}
                        onPress={() => slot.available && setSelectedSlot(slot.time)}
                        disabled={!slot.available}
                      >
                        <Text style={[
                          styles.slotText,
                          !slot.available && styles.slotTextDisabled,
                          selectedSlot === slot.time && styles.slotTextActive
                        ]}>
                          {slot.time}
                        </Text>
                        {!slot.available && (
                          <Text style={styles.slotFull}>已满</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <View style={styles.buttonRow}>
                <Button title="上一步" variant="secondary" onPress={() => setStep(1)} style={{ flex: 1, marginRight: 8 }} />
                {selectedSlot && (
                  <Button title="下一步" onPress={() => setStep(3)} style={{ flex: 1, marginLeft: 8 }} />
                )}
              </View>
            </View>
          )}

          {/* 步骤3：填写信息 */}
          {step === 3 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>填写预约信息</Text>
              
              <Input
                label="姓名"
                placeholder="请输入患者姓名"
                value={formData.patient_name}
                onChangeText={(v) => setFormData({ ...formData, patient_name: v })}
              />
              
              <Input
                label="手机号"
                placeholder="请输入手机号"
                keyboardType="phone-pad"
                value={formData.patient_phone}
                onChangeText={(v) => setFormData({ ...formData, patient_phone: v })}
              />

              <Text style={styles.inputLabel}>性别</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[styles.genderItem, formData.patient_gender === 'male' && styles.genderItemActive]}
                  onPress={() => setFormData({ ...formData, patient_gender: 'male' })}
                >
                  <Text style={[styles.genderText, formData.patient_gender === 'male' && styles.genderTextActive]}>男</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderItem, formData.patient_gender === 'female' && styles.genderItemActive]}
                  onPress={() => setFormData({ ...formData, patient_gender: 'female' })}
                >
                  <Text style={[styles.genderText, formData.patient_gender === 'female' && styles.genderTextActive]}>女</Text>
                </TouchableOpacity>
              </View>

              <Input
                label="年龄"
                placeholder="请输入年龄"
                keyboardType="number-pad"
                value={formData.patient_age}
                onChangeText={(v) => setFormData({ ...formData, patient_age: v })}
              />

              <Input
                label="病情描述（选填）"
                placeholder="请简要描述病情"
                multiline
                numberOfLines={3}
                value={formData.chief_complaint}
                onChangeText={(v) => setFormData({ ...formData, chief_complaint: v })}
                style={{ height: 80, textAlignVertical: 'top' }}
              />

              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>预约信息确认</Text>
                <Text style={styles.summaryText}>地点：{selectedLocationData?.name}</Text>
                <Text style={styles.summaryText}>日期：{selectedDate}</Text>
                <Text style={styles.summaryText}>时间：{selectedSlot}</Text>
              </View>

              <View style={styles.buttonRow}>
                <Button title="上一步" variant="secondary" onPress={() => setStep(2)} style={{ flex: 1, marginRight: 8 }} />
                <Button title="提交预约" onPress={handleSubmit} loading={loading} style={{ flex: 1, marginLeft: 8 }} />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  step: {
    alignItems: 'center',
  },
  stepActive: {},
  stepText: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 14,
    fontWeight: '600',
    overflow: 'hidden',
  },
  stepTextActive: {
    backgroundColor: '#4F46E5',
    color: '#fff',
  },
  stepLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  section: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  locationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationItemActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 13,
    color: '#6B7280',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateItem: {
    width: '14%',
    aspectRatio: 0.8,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateItemActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  dateDay: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  dateDayActive: {
    color: '#fff',
  },
  dateNum: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dateNumActive: {
    color: '#fff',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotItem: {
    width: '30%',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  slotItemActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  slotItemDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  slotText: {
    fontSize: 14,
    color: '#111827',
  },
  slotTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  slotTextDisabled: {
    color: '#9CA3AF',
  },
  slotFull: {
    fontSize: 10,
    color: '#EF4444',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  genderItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  genderItemActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  genderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  genderTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  summary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
});
