import { fetchProfileThunk } from '@/store/thunk/user';
import type { Profile } from '@/types/user';
import { createSlice } from '@reduxjs/toolkit';

type ProfileState = {
  profile: Profile | null;
  isLoading: boolean;
  isLoadingUpdate: boolean;
  error: string | null;
};

export  const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  isLoadingUpdate: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetUser: () => initialState, // ✅ Fix state reset
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.profile = payload.profile;
      })
      .addCase(fetchProfileThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error =
          (payload as { message?: string })?.message || 'Sign up failed';
      });
  },
});

export const { resetUser } = profileSlice.actions;
export default profileSlice.reducer;
