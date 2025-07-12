import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/auth/auth-context';
import { Auth_Status } from '@/types/auth';
import { Header } from '@/components/bookmark/header';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { auth_status } = useAuthContext();

  if (auth_status === Auth_Status.LOGGED_OUT) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header
        isDarkMode={false}
        onToggleDarkMode={() => {}}
        // profile={user}
        // onLogout={handleLogout}
      />
      {children}
    </>
  );
};

export default ProtectedRoute;
