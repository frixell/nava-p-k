import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const apiClient: AxiosInstance = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
});

export const postJson = async <T = unknown>(
    url: string,
    data: unknown,
    config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, {
        ...config,
        headers: {
            'Content-Type': 'application/json',
            ...(config.headers ?? {})
        }
    });
};

export const postFormUrlEncoded = async <T = unknown>(
    url: string,
    data: Record<string, string>,
    config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    const params = new URLSearchParams(data);

    return apiClient.post<T>(url, params.toString(), {
        ...config,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...(config.headers ?? {})
        }
    });
};

export default apiClient;
