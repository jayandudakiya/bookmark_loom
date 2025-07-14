import { createSlice } from '@reduxjs/toolkit';
import {
  API_Response_status,
  Auth_Status,
  type AuthStatus,
} from '@/types/auth';
import { getCookie, removeCookie } from '@/lib/secureCookies';
import { LOCAL_AUTH_KEYS } from '@/config/keys.config';
import { loginThunk, logOutThunk, signUpThunk } from '@/store/thunk/auth';

interface AuthState {
  isSignUpLoading: boolean;
  isLoginLoading: boolean;
  isLogOutLoading: boolean;
  signUpError: string | null;
  loginError: string | null;
  logOutError: string | null;
  authStatus: AuthStatus | null;
}

const authStatus = getCookie({ key: LOCAL_AUTH_KEYS.AUTH_STATUS }) || null;

export const initialState: AuthState = {
  authStatus: authStatus,
  isSignUpLoading: false,
  isLoginLoading: false,
  isLogOutLoading: false,
  signUpError: null,
  loginError: null,
  logOutError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLogout(state) {
      state.authStatus = null;
      state.signUpError = null;
      state.loginError = null;
      removeCookie({ key: LOCAL_AUTH_KEYS.AUTH_TOKEN });
      removeCookie({ key: LOCAL_AUTH_KEYS.AUTH_STATUS });
    },
    reFetchAuthCredentials(state) {
      const status = getCookie({
        key: LOCAL_AUTH_KEYS.AUTH_STATUS,
      }) as AuthStatus | null;
      state.authStatus = status;
    },
    resetAuth() {
      removeCookie({ key: LOCAL_AUTH_KEYS.AUTH_TOKEN });
      removeCookie({ key: LOCAL_AUTH_KEYS.AUTH_STATUS });
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔐 Sign Up
      .addCase(signUpThunk.pending, (state) => {
        state.isSignUpLoading = true;
        state.signUpError = null;
      })
      .addCase(signUpThunk.fulfilled, (state) => {
        state.isSignUpLoading = false;
        state.signUpError = null;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.isSignUpLoading = false;
        state.signUpError =
          (action.payload as { message?: string })?.message || 'Sign up failed';
      })

      // 🔐 Login
      .addCase(loginThunk.pending, (state) => {
        state.isLoginLoading = true;
        state.loginError = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoginLoading = false;
        state.loginError = null;
        if (action.payload.status === API_Response_status.SUCCESS) {
          state.authStatus = Auth_Status.LOGGED_IN;
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.loginError =
          (action.payload as { message?: string })?.message || 'Login failed';
      })

      // 🔓 Logout
      .addCase(logOutThunk.pending, (state) => {
        state.isLogOutLoading = true;
        state.logOutError = null;
      })
      .addCase(logOutThunk.fulfilled, (state, action) => {
        state.isLogOutLoading = false;
        state.logOutError = null;
        if (action.payload.status === API_Response_status.SUCCESS) {
          state.authStatus = null;
          state.signUpError = null;
          state.loginError = null;
        }
      })
      .addCase(logOutThunk.rejected, (state, action) => {
        state.isLogOutLoading = false;
        state.logOutError =
          (action.payload as { message?: string })?.message || 'Logout failed';
      });
  },
});

export const { authLogout, reFetchAuthCredentials, resetAuth } =
  authSlice.actions;
export default authSlice.reducer;
export type { AuthState };