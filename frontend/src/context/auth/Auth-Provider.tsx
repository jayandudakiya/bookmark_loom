import { LOCAL_AUTH_KEYS } from '@/config/keys.config';
import { AuthContext } from '@/context/auth/auth-context';
import { getCookie } from '@/lib/secureCookies';
import type { RootState } from '@/store/store';
import { Auth_Status, type AuthStatus } from '@/types/auth';
import { useEffect, useState, type ReactNode } from 'react';
import { useSelector } from 'react-redux';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authStatus = getCookie({ key: LOCAL_AUTH_KEYS.AUTH_STATUS });
  const authToken = getCookie({ key: LOCAL_AUTH_KEYS.AUTH_TOKEN });
  const { authStatus: rootAuthStatus } = useSelector(
    (state: RootState) => state.auth
  );

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [auth_status, setAuthStatus] = useState<AuthStatus>(
    Auth_Status.LOGGED_OUT
  );

  useEffect(() => {
    const fetchAuthConfig = async () => {
      try {
        if (
          authToken &&
          (authStatus === Auth_Status.LOGGED_IN ||
            rootAuthStatus === Auth_Status.LOGGED_IN)
        ) {
          setAuthStatus(authStatus || rootAuthStatus);
          setIsAuthLoading(false);
        }
      } catch (error) {
        console.log('error', error);
        setIsAuthLoading(false);
      } finally {
        setIsAuthLoading(false);
      }
    };
    fetchAuthConfig();
  }, [authStatus, authToken, rootAuthStatus]);

  return (
    <AuthContext.Provider value={{ auth_status, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
