import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginService,
  logOutService,
  signUpService,
} from '@/store/services/auth';
import {
  API_Response_status,
  Auth_Status,
  type LogOutResponse,
  type SignInPayload,
  type SignInResponse,
  type SignUpPayload,
  type SignUpResponse,
} from '@/types/auth';
import { removeCookie, setCookie } from '@/lib/secureCookies';
import { LOCAL_AUTH_KEYS } from '@/config/keys.config';
import type { AxiosError } from 'axios';

export const signUpThunk = createAsyncThunk<SignUpResponse, SignUpPayload>(
  'auth/signUp',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await signUpService(payload);
      const response = data;
      if (response.status === API_Response_status.SUCCESS) {
        setCookie({
          key: LOCAL_AUTH_KEYS.AUTH_TOKEN,
          value: response.token,
        });
        setCookie({
          key: LOCAL_AUTH_KEYS.AUTH_STATUS,
          value: Auth_Status.LOGGED_IN,
        });
      }
      return data;
    } catch (err) {
      // Handle error as needed
      // ✅ Check for AxiosError and extract message
      const error = err as AxiosError<{ message?: string; status?: string }>;
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred';

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.data?.status || 'FAIL',
      });
    }
  }
);

export const loginThunk = createAsyncThunk<SignInResponse, SignInPayload>(
  'auth/logIn',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginService(payload);
      const response = data;
      if (response.status === API_Response_status.SUCCESS) {
        setCookie({
          key: LOCAL_AUTH_KEYS.AUTH_TOKEN,
          value: response.token,
        });
        setCookie({
          key: LOCAL_AUTH_KEYS.AUTH_STATUS,
          value: Auth_Status.LOGGED_IN,
        });
      }
      return data;
    } catch (err) {
      // Handle error as needed
      // ✅ Check for AxiosError and extract message
      const error = err as AxiosError<{ message?: string; status?: string }>;
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred';

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.data?.status || 'FAIL',
      });
    }
  }
);

export const logOutThunk = createAsyncThunk<LogOutResponse, void>(
  'auth/logOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logOutService();
      if (response.status === API_Response_status.SUCCESS) {
        removeCookie({ key: LOCAL_AUTH_KEYS.AUTH_TOKEN });
        removeCookie({ key: LOCAL_AUTH_KEYS.AUTH_STATUS });
         window.location.href = '/register';
      }
      return response;
    } catch (error) {
      return rejectWithValue({
        message:
          'failed to logout' +
          (error instanceof Error ? `: ${error.message}` : ''),
      });
    }
  }
);
