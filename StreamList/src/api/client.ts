import axios, { type AxiosInstance } from 'axios';

export interface ApiClientConfig {
  baseUrl: string;
  accessToken?: string;
}

export interface GetJsonOptions {
  signal?: AbortSignal;
}

export function createApiClient(config: ApiClientConfig): {
  getJson: <T>(path: string, options?: GetJsonOptions) => Promise<T>;
} {
  const { baseUrl, accessToken } = config;
  const normalizedBase = baseUrl.replace(/\/$/, '');

  const instance: AxiosInstance = axios.create({
    baseURL: normalizedBase,
    headers: {
      Accept: 'application/json',
      ...(accessToken !== undefined && accessToken.length > 0
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
    },
    validateStatus: () => true,
  });

  return {
    async getJson<T>(path: string, options?: GetJsonOptions): Promise<T> {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      const response = await instance.get<T>(normalizedPath, {
        signal: options?.signal,
      });
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.data;
    },
  };
}
