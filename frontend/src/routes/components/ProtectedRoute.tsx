import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/auth/auth-context';
import { Auth_Status } from '@/types/auth';
import { Header } from '@/components/bookmark/header';
import Loading from '@/components/loading/Loading';
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { auth_status, isAuthLoading } = useAuthContext();

  if (isAuthLoading) {
    return <Loading />;
  }

  if (auth_status === Auth_Status.LOGGED_OUT) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default ProtectedRoute;
