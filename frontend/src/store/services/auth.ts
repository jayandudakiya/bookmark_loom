import axiosInstance from '@/lib/axiosInstance';
import type {
  LogOutResponse,
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  SignUpResponse,
} from '@/types/auth';
import axios, { type AxiosResponse } from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const signUpService = async (
  payload: SignUpPayload
): Promise<SignUpResponse> => {
  const response: AxiosResponse<SignUpResponse> = await axiosInstance.post(
    '/auth/register',
    payload
  );
  return response.data;
};

export const loginService = async (
  payload: SignInPayload
): Promise<SignInResponse> => {
  const response: AxiosResponse<SignInResponse> = await axios.post(
    `${BASE_URL}/auth/login`,
    payload
  );
  return response.data;
};

export const logOutService = async (): Promise<LogOutResponse> => {
  const response: AxiosResponse<LogOutResponse> = await axiosInstance.post(
    '/auth/logout',
    {},
    { withCredentials: true }
  );
  return response.data;
};
