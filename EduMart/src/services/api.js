const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('edumart_token')
}

async function request(path, options = {}) {
  const headers = { ...options.headers }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  googleLogin: (credential) =>
    request('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
  me: () => request('/auth/me'),
  updateProfile: (body) =>
    request('/auth/profile', { method: 'PATCH', body: JSON.stringify(body) }),

  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/products${q ? `?${q}` : ''}`)
  },
  getProduct: (id) => request(`/products/${id}`),
  getMyProducts: () => request('/products/mine'),
  createProduct: (body) =>
    request('/products', { method: 'POST', body: JSON.stringify(body) }),
  priceHint: () => request('/products/hints/price'),

  uploadImage: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return request('/upload/image', { method: 'POST', body: fd })
  },
  uploadPdf: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return request('/upload/pdf', { method: 'POST', body: fd })
  },
  uploadAvatar: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return request('/upload/avatar', { method: 'POST', body: fd })
  },

  createPaymentOrder: (productId) =>
    request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),
  verifyPayment: (body) =>
    request('/payments/verify', { method: 'POST', body: JSON.stringify(body) }),
  getOrders: () => request('/payments/orders'),

  getConversations: () => request('/chat/conversations'),
  startConversation: (body) =>
    request('/chat/conversations', { method: 'POST', body: JSON.stringify(body) }),
  getMessages: (id) => request(`/chat/conversations/${id}/messages`),
  sendMessage: (id, body) =>
    request(`/chat/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  adminStats: () => request('/admin/stats'),
  adminProducts: (status) => request(`/admin/products?status=${status || 'pending'}`),
  adminApprove: (id, status) =>
    request(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  adminUsers: () => request('/admin/users'),
  adminDeleteProduct: (id) =>
    request(`/admin/products/${id}`, { method: 'DELETE' }),
}
