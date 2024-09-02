import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

class RequestService {
  public axiosInstance: AxiosInstance;
  private static readonly baseURL = 'http://localhost:2099/hospital_management/api/v1';
  private static readonly TOKEN_KEY = 'accessToken';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: RequestService.baseURL
    });
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  public async getWithAuth<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, {
      ...config,
      withCredentials: true,
    });
  }
  
  public async postWithAuth<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, {
      ...config,
      withCredentials: true,
    });
  }

  public async putWithAuth<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, {
      ...config,
      withCredentials: true,
    });
  }
  
  public async deleteWithAuth<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, {
      ...config,
      withCredentials: true,
    });
  }
}

const requestService = new RequestService();

export type RequestServiceType = typeof requestService;
export default requestService;
