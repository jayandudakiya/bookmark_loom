import { LOCAL_SETTING_KEYS } from '@/config/keys.config';
import { ThemeProviderContext } from '@/context/theme/theme-context';
import { getLocalStorage, setLocalStorage } from '@/lib/secureLocalStorage';
import type { Theme } from '@/types/theme';
import { useEffect, useState } from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export default function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = LOCAL_SETTING_KEYS.UI_THEME,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => getLocalStorage({ key: storageKey }) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      setTheme(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setLocalStorage({ key: storageKey, value: theme });
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
