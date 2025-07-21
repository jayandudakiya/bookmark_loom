import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Check } from 'lucide-react';
import type { Bookmark } from '@/types/bookmark';
import { Badge } from '@/components/ui/badge';
import { ReactComponent as BookmarkCopyIcon } from '@/assets/icons/bookmarks/bookmark-copy.svg';
import { ReactComponent as BookmarkVisitIcon } from '@/assets/icons/bookmarks/bookmark-visit.svg';
import { ReactComponent as BookmarkEditIcon } from '@/assets/icons/bookmarks/bookmark-edit.svg';
import { ReactComponent as BookmarkRemoveIcon } from '@/assets/icons/bookmarks/bookmark-remove.svg';
import { ReactComponent as FavoriteIcon } from '@/assets/icons/favorite/favorite.svg';
import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  copiedId: string | null;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onCopyLink: (url: string, id: string) => void;
  onToggleFavorite: (bookmark: Bookmark) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function BookmarkCard({
  bookmark,
  index,
  copiedId,
  onEdit,
  onDelete,
  onCopyLink,
  onToggleFavorite,
  isDeleting,
  isUpdating,
}: BookmarkCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Development:
        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
      Design:
        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
      News: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
      'Social Media':
        'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800',
      Entertainment:
        'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
      Education:
        'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
      Shopping:
        'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
      Tools:
        'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800',
      Other:
        'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',

      // Enhanced categories with improved color combinations
      Business:
        'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800',
      Movies:
        'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
      Music:
        'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950 dark:text-fuchsia-300 dark:border-fuchsia-800',
      Sports:
        'bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-950 dark:text-lime-300 dark:border-lime-800',
      Food: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
      Lifestyle:
        'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800',
      Gaming:
        'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800',
      Science:
        'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
      Technology:
        'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800',
      Art: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
      Fashion:
        'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800',
      Photography:
        'bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-800',
      Health:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
      Finance:
        'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
      Productivity:
        'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
      Travel:
        'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',

      // New Anime category
      Anime:
        'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
    };

    return colors[category] || colors['Other'];
  };
  const { isDeletingLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.bookmark
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card
      className={`group col-span-2 hover:shadow-2xl transition-all duration-300 bg-card border-2 hover:border-primary/30 backdrop-blur-sm hover:scale-[1.02] animate-slide-in-up ${
        isUpdating || isDeleting || isDeletingLoading || isUpdateLoading
          ? 'opacity-60 pointer-events-none'
          : ''
      }`}
      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
    >
      <CardHeader className=" flex flex-col gap-3 items-start justify-between flex-wrap">
        <CardTitle className="flex w-full items-center justify-between flex-wrap">
          {bookmark.name}
          <Badge
            className={`ml-2 shadow-sm ${getCategoryColor(bookmark.category)}`}
          >
            {bookmark.category}
          </Badge>
        </CardTitle>
        <CardDescription className="w-full" title={bookmark.url}>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 bg-muted/30 p-1.5 rounded-lg overflow-hidden text-ellipsis whitespace-nowrap max-w-fit">
            {bookmark.url}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className=" min-h-20 flex  flex-col justify-end">
        <div className="w-full">
          {bookmark.description && (
            <Tooltip>
              <TooltipTrigger asChild className="w-full">
                <p className="text-sm w-full text-muted-foreground mb-4 line-clamp-2 bg-muted/30 p-1.5 rounded-lg overflow-hidden text-ellipsis whitespace-nowrap capitalize ">
                  {bookmark?.description}
                </p>
              </TooltipTrigger>
              {bookmark.description.length > 50 && (
                <TooltipContent align="start" alignOffset={0}>
                  <p className="line-clamp-5 max-w-3xs">
                    {bookmark?.description}
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 justify-center sm:justify-end w-full flex-wrap">
            <Button
              variant="outline"
              size="sm"
              asChild
              className=" bg-primary/10 hover:bg-primary/20 border-primary/20 transition-all hover:scale-105"
            >
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <BookmarkVisitIcon className="h-3 w-3" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopyLink(bookmark.url, bookmark._id)}
              className="hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900 dark:hover:text-green-300 transition-all hover:scale-110"
              title="Copy link"
            >
              {copiedId === bookmark._id ? (
                <Check className="h-3 w-3 animate-scale-in" />
              ) : (
                <BookmarkCopyIcon className="h-3 w-3" />
              )}
            </Button>
            <Button
              disabled={isUpdating}
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(bookmark)}
              className={`transition-all hover:scale-110 ${
                bookmark.is_favorite
                  ? 'fill-red-400 hover:bg-red-100 dark:hover:bg-red-900'
                  : ' fill-black  dark:hover:bg-red-500 '
              }`}
              title={bookmark.is_favorite ? 'Unfavorite' : 'Mark as Favorite'}
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              ) : (
                <FavoriteIcon
                  className={`h-3 w-3 ${
                    bookmark.is_favorite ? 'fill-red-500' : ''
                  }`}
                />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              title="Edit url"
              onClick={() => onEdit(bookmark)}
              className="hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-all hover:scale-110"
            >
              <BookmarkEditIcon className="h-3 w-3" />
            </Button>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Delete url"
                  className="hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300 transition-all hover:scale-110"
                  onClick={() => setIsDialogOpen(true)}
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                  ) : (
                    <BookmarkRemoveIcon className="h-3 w-3" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="animate-scale-in">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{bookmark.name}"? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await onDelete(bookmark._id);
                        setIsDialogOpen(false); // ✅ close on success
                      } catch (error) {
                        console.log('error', error);
                      }
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-t-red-600 border-gray-300 rounded-full animate-spin mx-auto" />
                    ) : (
                      'Delete'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
