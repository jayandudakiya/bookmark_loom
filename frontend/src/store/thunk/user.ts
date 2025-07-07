import { profileService } from '@/store/services/user';
import type {
  ProfileResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from '@/types/user';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';

export const fetchProfileThunk = createAsyncThunk<ProfileResponse, void>(
  'profile/get',
  async (_, { rejectWithValue }) => {
    try {
      const data = await profileService();
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

export const updateProfileThunk = createAsyncThunk<
  UpdateProfileResponse,
  UpdateProfilePayload
>('profile/update', async (_payload, { rejectWithValue }) => {
  try {
    const data = {} as UpdateProfileResponse;
    return data;
  } catch (error) {
    return rejectWithValue({
      message: 'Login failed' + (error instanceof Error ? error.message : ''),
    });
  }
});
