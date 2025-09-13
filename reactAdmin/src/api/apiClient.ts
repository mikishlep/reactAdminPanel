import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({ baseURL });

        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem("access_token");

            if (token) {
                config.headers!["Authorization"] = `Bearer ${token}`;
            }
            return config;
        });
    }

    get<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
        return this.client
            .get<T>(url, { params, ...config })
            .then((res: AxiosResponse<T>) => res.data);
    }

    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.client
            .post<T>(url, data, config)
            .then((res: AxiosResponse<T>) => res.data);
    }

    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.client
            .put<T>(url, data, config)
            .then((res: AxiosResponse<T>) => res.data);
    }

    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.client
            .delete<T>(url, config)
            .then((res: AxiosResponse<T>) => res.data);
    }
}

export const api = new ApiClient(import.meta.env.VITE_API_URL);