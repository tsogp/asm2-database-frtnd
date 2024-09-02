import axios, { AxiosError } from 'axios';
import requestService from "@/src/services/RequestService";
import loginService from "@/src/services/LoginService/LoginService";
import router from '../router';

export const setupAxiosInterceptors = () => {
  requestService.axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      if (error.response?.status === 403) {
        loginService.cleanUser();
        router.push('/signup');
      }
      
      return Promise.reject(error);
    }
  );
};

