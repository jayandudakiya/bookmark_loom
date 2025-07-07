import { createContext, useContext } from 'react';

type AuthContextType = {
  auth_status: string | null;
  isAuthLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
