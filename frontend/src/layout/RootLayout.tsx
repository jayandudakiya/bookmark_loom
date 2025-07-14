import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/auth/auth-context';
import AuthPage from '@/pages/AuthPage';
import BookmarkPage from '@/pages/BookmarkPage';
import WelcomePage from '@/pages/welcome-page';
import ProtectedRoute from '@/routes/components/ProtectedRoute';
import PublicRoute from '@/routes/components/PublicRoute';
import type { AppDispatch } from '@/store/store';
import { fetchProfileThunk } from '@/store/thunk/user';
import { Auth_Status } from '@/types/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

const RootLayout = () => {
  const { auth_status } = useAuthContext();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchProfileThunk());
      // await dispatch(getBookmarksThunk());
    };
    if (auth_status && auth_status === Auth_Status.LOGGED_IN) {
      fetchData();
    }
  }, [auth_status, dispatch]);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PublicRoute>
              <WelcomePage />
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

        <Route
          path="*"
          element={
            <div className="grid place-items-center h-screen">
              <div className="flex flex-col gap-3">
                <h1 className="text-center ">This Page is not available</h1>
                <Button
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  Back to Home
                </Button>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default RootLayout;
