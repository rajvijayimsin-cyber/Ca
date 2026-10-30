import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach Bearer token from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Auto-refresh on 401
let isRefreshing = false;
let queue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

api.interceptors.response.use(
  res => res,
  async err => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      // Don't retry refresh or login calls
      if (orig.url?.includes('/auth/refresh') || orig.url?.includes('/auth/login')) {
        return Promise.reject(err);
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => { queue.push({ resolve, reject }); })
          .then(() => api(orig));
      }
      orig._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        const res = await api.post('/api/auth/refresh', { refresh_token: refreshToken });
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        queue.forEach(p => p.resolve(null));
        return api(orig);
      } catch (e) {
        queue.forEach(p => p.reject(e));
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(e);
      } finally {
        queue = [];
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
