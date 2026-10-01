const API_BASE = 'http://localhost:5263/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API Error ${res.status}: ${error}`);
  }
  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ===================== TENANTS =====================
export const tenantsApi = {
  getAll: () => request<any[]>('/tenants'),
  getById: (id: string) => request<any>(`/tenants/${id}`),
  create: (data: any) => request<any>('/tenants', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<void>(`/tenants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/tenants/${id}`, { method: 'DELETE' }),
};

// ===================== APARTMENTS =====================
export const apartmentsApi = {
  getAll: () => request<any[]>('/apartments'),
  getById: (id: string) => request<any>(`/apartments/${id}`),
  create: (data: any) => request<any>('/apartments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<void>(`/apartments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) =>
    request<any>(`/apartments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  assignResident: (id: string, data: { residentName: string; phone: string; email: string; isOwner?: boolean }) =>
    request<any>(`/apartments/${id}/assign-resident`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/apartments/${id}`, { method: 'DELETE' }),
};

// ===================== RESIDENTS =====================
export const residentsApi = {
  getAll: () => request<any[]>('/residents'),
  getById: (id: string) => request<any>(`/residents/${id}`),
  create: (data: any) => request<any>('/residents', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<void>(`/residents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  activate: (id: string) => request<any>(`/residents/${id}/activate`, { method: 'PATCH' }),
  suspend: (id: string) => request<any>(`/residents/${id}/suspend`, { method: 'PATCH' }),
  delete: (id: string) => request<void>(`/residents/${id}`, { method: 'DELETE' }),
};

// ===================== CONTRACTS =====================
export const contractsApi = {
  getAll: () => request<any[]>('/contracts'),
  getById: (id: string) => request<any>(`/contracts/${id}`),
  create: (data: any) => request<any>('/contracts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<void>(`/contracts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/contracts/${id}`, { method: 'DELETE' }),
};

// ===================== INVOICES =====================
export const invoicesApi = {
  getAll: () => request<any[]>('/invoices'),
  getById: (id: string) => request<any>(`/invoices/${id}`),
  create: (data: any) => request<any>('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  pay: (id: string, paymentMethod: string) =>
    request<any>(`/invoices/${id}/pay`, { method: 'PATCH', body: JSON.stringify({ paymentMethod }) }),
  batchGenerate: () => request<any[]>('/invoices/batch-generate', { method: 'POST' }),
  delete: (id: string) => request<void>(`/invoices/${id}`, { method: 'DELETE' }),
};

// ===================== COMPLAINTS =====================
export const complaintsApi = {
  getAll: () => request<any[]>('/complaints'),
  getById: (id: string) => request<any>(`/complaints/${id}`),
  create: (data: any) => request<any>('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) =>
    request<any>(`/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addMessage: (id: string, data: { senderName: string; senderRole: string; content: string }) =>
    request<any>(`/complaints/${id}/messages`, { method: 'POST', body: JSON.stringify(data) }),
  assignStaff: (id: string, data: { staffName: string; deadline: string }) =>
    request<any>(`/complaints/${id}/assign`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/complaints/${id}`, { method: 'DELETE' }),
};

// ===================== STAFF =====================
export const staffApi = {
  getAll: () => request<any[]>('/staff'),
  getById: (id: string) => request<any>(`/staff/${id}`),
  create: (data: any) => request<any>('/staff', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<void>(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/staff/${id}`, { method: 'DELETE' }),
};

// ===================== SHIFTS =====================
export const shiftsApi = {
  getAll: () => request<any[]>('/shifts'),
  getById: (id: string) => request<any>(`/shifts/${id}`),
  create: (data: any) => request<any>('/shifts', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/shifts/${id}`, { method: 'DELETE' }),
};

// ===================== BOOKINGS =====================
export const bookingsApi = {
  getAll: () => request<any[]>('/bookings'),
  getById: (id: string) => request<any>(`/bookings/${id}`),
  create: (data: any) => request<any>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/bookings/${id}`, { method: 'DELETE' }),
};

// ===================== SERVICE REQUESTS =====================
export const serviceRequestsApi = {
  getAll: () => request<any[]>('/servicerequests'),
  getById: (id: string) => request<any>(`/servicerequests/${id}`),
  create: (data: any) => request<any>('/servicerequests', { method: 'POST', body: JSON.stringify(data) }),
  approve: (id: string) => request<any>(`/servicerequests/${id}/approve`, { method: 'PATCH' }),
  reject: (id: string) => request<any>(`/servicerequests/${id}/reject`, { method: 'PATCH' }),
  delete: (id: string) => request<void>(`/servicerequests/${id}`, { method: 'DELETE' }),
};

// ===================== PARCELS =====================
export const parcelsApi = {
  getAll: () => request<any[]>('/parcels'),
  getById: (id: string) => request<any>(`/parcels/${id}`),
  create: (data: any) => request<any>('/parcels', { method: 'POST', body: JSON.stringify(data) }),
  markReceived: (id: string) => request<any>(`/parcels/${id}/received`, { method: 'PATCH' }),
  delete: (id: string) => request<void>(`/parcels/${id}`, { method: 'DELETE' }),
};

// ===================== USERS =====================
export const usersApi = {
  getAll: () => request<any[]>('/users'),
  getById: (id: string) => request<any>(`/users/${id}`),
  create: (data: any) => request<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<void>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' }),
};

// ===================== DASHBOARD =====================
export const dashboardApi = {
  getStats: (tenantId?: string) =>
    request<any>(`/dashboard/stats${tenantId ? `?tenantId=${tenantId}` : ''}`),
};
