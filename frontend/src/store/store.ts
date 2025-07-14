import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import profileReducer from './slices/user';
import bookmarkReducer from './slices/bookmark.slice';
import resetStoreMiddleware from '@/store/middleware/resetStoreMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    bookmark: bookmarkReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(resetStoreMiddleware),
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
