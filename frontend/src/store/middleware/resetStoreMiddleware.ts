import { resetAuth } from '@/store/slices/auth';
import { resetBookmark } from '@/store/slices/bookmark.slice';
import { resetUser } from '@/store/slices/user';
import { logOutThunk } from '@/store/thunk/auth';
import { type Middleware } from '@reduxjs/toolkit';

const resetStoreMiddleware: Middleware = (store) => (next) => (action) => {
  if (logOutThunk.fulfilled.match(action)) {
    // If the logout request is successful, reset all slices
    store.dispatch(resetAuth());
    store.dispatch(resetBookmark());
    store.dispatch(resetUser());
  }
  return next(action);
};

export default resetStoreMiddleware;
