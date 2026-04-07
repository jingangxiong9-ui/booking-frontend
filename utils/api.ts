const BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'https://booking-backend-caeu.onrender.com';

export interface Location {
  id: string;
  name: string;
  address: string;
  work_days: number[];
  schedule: Record<number, { enabled: boolean; time_slots: { time: string; capacity: number }[] }>;
}

export interface TimeSlot {
  time: string;
  capacity: number;
  available: boolean;
}

export interface Appointment {
  id: number;
  location_id: string;
  appointment_date: string;
  time_slot: string;
  patient_name: string;
  patient_phone: string;
  patient_gender: string;
  patient_age: number;
  chief_complaint: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export interface DoctorSettings {
  home_title: string;
  home_subtitle: string;
  doctor_name: string;
  doctor_intro: string;
  doctor_avatar: string;
  locations: Location[];
}

// 首页配置
export async function getConfig() {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/config`);
  return res.json();
}

// 获取坐诊地点
export async function getLocations(): Promise<Location[]> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/locations`);
  return res.json();
}

// 获取可用日期
export async function getAvailableDates(locationId: string): Promise<string[]> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/available-dates?location_id=${locationId}`);
  return res.json();
}

// 获取时间段
export async function getTimeSlots(locationId: string, date: string): Promise<TimeSlot[]> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/time-slots?location_id=${locationId}&date=${date}`);
  return res.json();
}

// 提交预约
export async function createAppointment(data: {
  location_id: string;
  appointment_date: string;
  time_slot: string;
  patient_name: string;
  patient_phone: string;
  patient_gender: string;
  patient_age: number;
  chief_complaint?: string;
}) {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || '预约失败');
  }
  return res.json();
}

// 查询预约
export async function queryAppointments(phone: string, code?: string): Promise<Appointment[]> {
  let url = `${BACKEND_BASE_URL}/api/v1/appointments/query?phone=${phone}`;
  if (code) url += `&code=${code}`;
  const res = await fetch(url);
  return res.json();
}

// 取消预约
export async function cancelAppointment(id: number, phone: string) {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/appointments/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, phone }),
  });
  return res.json();
}

// 管理员登录
export async function adminLogin(phone: string, password: string) {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || '登录失败');
  }
  return res.json();
}

// 管理员获取设置
export async function getAdminSettings(sessionId: string): Promise<DoctorSettings> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/admin/settings`, {
    headers: { 'x-session-id': sessionId },
  });
  if (!res.ok) throw new Error('未授权');
  return res.json();
}

// 管理员更新设置
export async function updateAdminSettings(sessionId: string, data: Partial<DoctorSettings>) {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionId,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// 管理员获取预约列表
export async function getAdminAppointments(sessionId: string, params?: {
  start_date?: string;
  end_date?: string;
  status?: string;
  location_id?: string;
}): Promise<Appointment[]> {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/admin/appointments?${query}`, {
    headers: { 'x-session-id': sessionId },
  });
  return res.json();
}

// 管理员获取待确认数量
export async function getPendingCount(sessionId: string): Promise<{ count: number }> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/admin/pending-count`, {
    headers: { 'x-session-id': sessionId },
  });
  return res.json();
}

// 管理员确认预约
export async function confirmAppointment(sessionId: string, id: number) {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/admin/appointments/${id}/confirm`, {
    method: 'POST',
    headers: { 'x-session-id': sessionId },
  });
  return res.json();
}

// 管理员删除预约
export async function deleteAppointment(sessionId: string, id: number) {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/admin/appointments/${id}`, {
    method: 'DELETE',
    headers: { 'x-session-id': sessionId },
  });
  return res.json();
}

// 管理员修改密码
export async function changePassword(sessionId: string, oldPassword: string, newPassword: string) {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/admin/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessionId,
    },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
  return res.json();
}

export { BACKEND_BASE_URL };
