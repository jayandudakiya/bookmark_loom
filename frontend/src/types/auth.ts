export type AuthStatus = 'LOGGED_IN' | 'LOGGED_OUT';
export type API_RESPONSE_STATUS = 'SUCCESS' | 'FAIL' | 'ERROR';

export const Auth_Status = {
  LOGGED_IN: 'LOGGED_IN' as AuthStatus,
  LOGGED_OUT: 'LOGGED_OUT' as AuthStatus,
};
export const API_Response_status = {
  SUCCESS: 'SUCCESS' as API_RESPONSE_STATUS,
  FAIL: 'FAIL' as API_RESPONSE_STATUS,
  ERROR: 'ERROR' as API_RESPONSE_STATUS,
};

export type SignUpPayload = {
  user_name: string;
  email: string;
  password: string;
};
export type SignUpResponse = {
  status: API_RESPONSE_STATUS;
  token?: string;
  message?: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignInResponse = {
  status: API_RESPONSE_STATUS;
  token?: string;
  message?: string;
};

export type LogOutResponse = {
  status: API_RESPONSE_STATUS;
  message: string;
};

export interface APIError {
  message?: string;
  status?: string;
}
