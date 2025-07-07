import { useAuthContext } from '@/context/auth/auth-context';
import { Auth_Status } from '@/types/auth';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { auth_status } = useAuthContext();

  // Optional: redirect logged-in users away from public pages like login
  if (auth_status === Auth_Status.LOGGED_IN) {
    return <Navigate to="/dashboard" />;
  }

  return <div className="w-full">{children}</div>;
};

export default PublicRoute;
