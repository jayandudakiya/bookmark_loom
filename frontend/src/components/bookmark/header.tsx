import { Button } from '@/components/ui/button';
import { Sun, Moon, LogOut } from 'lucide-react';
import { ReactComponent as BookmarkLogo } from '@/assets/bookmark-logo.svg';
import { useAuthContext } from '@/context/auth/auth-context';
import { Auth_Status } from '@/types/auth';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { useThemeContext } from '@/context/theme/theme-context';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { logOutThunk } from '@/store/thunk/auth';
import { toast } from 'sonner';

export function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { auth_status, isAuthLoading } = useAuthContext();
  const { setTheme, theme } = useThemeContext();
  const { isLoading, profile } = useSelector(
    (state: RootState) => state.profile
  );

  const userName = useMemo(() => {
    if (profile?.user_name) {
      const name =
        profile.user_name.charAt(0).toLocaleUpperCase() +
        profile.user_name.charAt(1).toLocaleUpperCase();
      return name;
    }
    return '';
  }, [profile?.user_name]);

  const onGetStarted = () => {
    navigate('/register');
  };

  const handleLogOut = async () => {
    const result = await dispatch(logOutThunk());
    console.log('➡ ~ handleLogOut ~ result:', result);

    if (logOutThunk.fulfilled.match(result)) {
      toast.success(result.payload.message || 'logout successful!');
      navigate('/'); // Redirect to home
    } else {
      toast.error('Failed to log out. Please try again.');
    }
  };
  return (
    <div className="w-full">
      {/* Mobile Navigation Bar */}
      <div className=" fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link className="flex items-center gap-3" to="/dashboard">
            <BookmarkLogo className="h-10 animate-pulse ease-in" />
            <span className="text-lg font-bold text-foreground hidden md:block">
              Bookmark Loom
            </span>
          </Link>

          <div className="flex items-center justify-end gap-3.5">
            {auth_status === Auth_Status.LOGGED_IN ? (
              <ul className="flex items-center gap-2">
                {/* <li>
                  <Link to="/favorites">Favorite</Link>
                </li> */}
                {/* <li>
                  <Link to="/profile">Profile</Link>
                </li> */}
              </ul>
            ) : auth_status === Auth_Status.LOGGED_OUT ? (
              <>
                <Button onClick={onGetStarted}>Get Started</Button>
              </>
            ) : null}
            {auth_status === Auth_Status.LOGGED_IN ? (
              isLoading ? (
                <>
                  <Skeleton className="h-[34px] w-[34px] rounded-full" />
                </>
              ) : (
                <>
                  <Avatar className="h-[34px] w-[34px]">
                    <AvatarFallback> {userName}</AvatarFallback>
                  </Avatar>
                </>
              )
            ) : null}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
              className="h-9 w-9 transition-all hover:scale-105 bg-transparent"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            {auth_status === Auth_Status.LOGGED_IN ? (
              isAuthLoading ? (
                <>
                  <Skeleton className="h-[34px] w-[34px] rounded-full" />
                </>
              ) : (
                <Button
                  onClick={handleLogOut}
                  size="icon"
                  variant="secondary"
                  className="bg-red-600 hover:bg-red-400/85 "
                >
                  <LogOut />
                </Button>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
