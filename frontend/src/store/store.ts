import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import profileReducer from './slices/user';
import resetStoreMiddleware from '@/store/middleware/resetStoreMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(resetStoreMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
