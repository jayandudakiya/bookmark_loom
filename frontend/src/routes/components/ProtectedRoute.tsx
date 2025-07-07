import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuthContext } from '@/context/auth/auth-context';
import { Auth_Status } from '@/types/auth';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { auth_status } = useAuthContext();

  if (auth_status === Auth_Status.LOGGED_OUT) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <AppSidebar />
      <main className="p-2 w-full">{children}</main>
    </>
  );
};

export default ProtectedRoute;
