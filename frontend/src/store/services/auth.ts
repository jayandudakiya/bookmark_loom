import axiosInstance from '@/lib/axiosInstance';
import type {
  LogOutResponse,
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  SignUpResponse,
} from '@/types/auth';
import { type AxiosResponse } from 'axios';

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
  const response: AxiosResponse<SignInResponse> = await axiosInstance.post(
    '/auth/login',
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
