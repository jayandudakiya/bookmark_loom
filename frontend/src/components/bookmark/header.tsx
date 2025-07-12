'use client';

import { Button } from '@/components/ui/button';
import type { Profile } from '@/types/user';
import { ExternalLink, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  profile?: Profile;
  onLogout?: () => void;
}

export function Header({ isDarkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <div className='w-full'>
      {/* Mobile Navigation Bar */}
      <div className=" fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg shadow-lg">
              <ExternalLink className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              BookmarkHub
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleDarkMode}
            className="h-9 w-9 transition-all hover:scale-105 bg-transparent"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

    </div>
  );
}
