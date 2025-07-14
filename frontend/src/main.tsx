import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/auth/Auth-Provider';
import { Toaster } from 'sonner';
import ThemeProvider from '@/context/theme/Theme-provider';
import { store } from '@/store/store';
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
