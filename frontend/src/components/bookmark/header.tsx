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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
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

      {/* Desktop Header */}
      <div className=" w-full flex items-center justify-between mb-8 bg-card/50 rounded-2xl p-6 border backdrop-blur-sm animate-slide-in-up">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-lg transition-transform hover:scale-105">
            <ExternalLink className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Bookmark Manager
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg">
              Organize and manage your favorite websites
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleDarkMode}
          className="hidden lg:flex h-12 w-12 border-2 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 bg-transparent"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
