import type { API_RESPONSE_STATUS } from '@/types/auth';

export type Profile = {
  email: string;
  user_name: string;
  isDeleted: boolean;
};

export type ProfileResponse = {
  status: API_RESPONSE_STATUS;
  profile: Profile;
  message?: string;
};

export type UpdateProfilePayload = {
  email?: string;
  user_name?: string;
};

export type UpdateProfileResponse = {
  message?: string;
  status: API_RESPONSE_STATUS;
};
