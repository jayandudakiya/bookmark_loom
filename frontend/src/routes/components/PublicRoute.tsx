import { Header } from '@/components/bookmark/header';
import Loading from '@/components/loading/Loading';
import { useAuthContext } from '@/context/auth/auth-context';
import { Auth_Status } from '@/types/auth';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { auth_status, isAuthLoading } = useAuthContext();

  if (isAuthLoading) {
    return <Loading />;
  }

  if (auth_status === Auth_Status.LOGGED_IN) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="w-full">
      <Header />
      {children}
    </div>
  );
};

export default PublicRoute;
