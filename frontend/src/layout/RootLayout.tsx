import { useAuthContext } from '@/context/auth/auth-context';
import AuthPage from '@/pages/AuthPage';
import BookmarkPage from '@/pages/BookmarkPage';
import ProtectedRoute from '@/routes/components/ProtectedRoute';
import PublicRoute from '@/routes/components/PublicRoute';
import type { AppDispatch } from '@/store/store';
import { fetchProfileThunk } from '@/store/thunk/user';
import { Auth_Status } from '@/types/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

const RootLayout = () => {
  const { auth_status } = useAuthContext();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (auth_status && auth_status === Auth_Status.LOGGED_IN) {
      dispatch(fetchProfileThunk());
    }
  }, [auth_status, dispatch]);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <BookmarkPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default RootLayout;
