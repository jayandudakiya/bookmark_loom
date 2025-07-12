import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/auth/Auth-Provider.tsx';
import { Toaster } from 'sonner';
import ThemeProvider from '@/context/theme/Theme-provider.tsx';
import { store } from '@/store/store.ts';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
