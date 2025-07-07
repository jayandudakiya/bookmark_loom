import axiosInstance from '@/lib/axiosInstance';
import type { ProfileResponse } from '@/types/user';
import { type AxiosResponse } from 'axios';

export const profileService = async (): Promise<ProfileResponse> => {
  const response: AxiosResponse<ProfileResponse> = await axiosInstance.get(
    '/user/profile'
  );
  return response.data;
};
