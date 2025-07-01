import axios from 'axios';
import type { AxiosError } from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError) => {
        const originalRequest = error.config;
        if (originalRequest) originalRequest._retry = false;
        if (
            originalRequest &&
            originalRequest.url !== '/auth/refresh' &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await api.post('/auth/refresh') satisfies { access_token: string };

                const newAccessToken = refreshResponse?.access_token;
                if (!newAccessToken) {
                    localStorage.removeItem('accessToken');
                    return;
                }

                localStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);


export default api as {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
};
