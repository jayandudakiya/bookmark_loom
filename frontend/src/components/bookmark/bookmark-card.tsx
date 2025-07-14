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
interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  copiedId: string | null;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onCopyLink: (url: string, id: string) => void;
  onToggleFavorite: (bookmark: Bookmark) => void;
}

export function BookmarkCard({
  bookmark,
  index,
  copiedId,
  onEdit,
  onDelete,
  onCopyLink,
  onToggleFavorite
}: BookmarkCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Development:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Design:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      News: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Social Media':
        'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      Entertainment:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      Education:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Shopping:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      Tools: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      Other:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    };
    return colors[category] || colors['Other'];
  };

  return (
    <Card
      className="group col-span-2  hover:shadow-2xl transition-all duration-300 bg-card border-2 hover:border-primary/30 backdrop-blur-sm hover:scale-[1.02] animate-slide-in-up"
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
          {/* <Tooltip>
            <TooltipTrigger className="w-full">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 bg-muted/30 p-1.5 rounded-lg overflow-hidden text-ellipsis whitespace-nowrap max-w-fit">
                {bookmark.url}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{bookmark.url}</p>
            </TooltipContent>
          </Tooltip> */}

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 bg-muted/30 p-1.5 rounded-lg overflow-hidden text-ellipsis whitespace-nowrap max-w-fit">
            {bookmark.url}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        {bookmark.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 bg-muted/30 p-3 rounded-lg">
            {bookmark.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 justify-end w-full">
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
              <FavoriteIcon
                className={`h-3 w-3 ${
                  bookmark.is_favorite ? 'fill-red-500' : ''
                }`}
              />
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Delete url"
                  className="hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300 transition-all hover:scale-110"
                >
                  <BookmarkRemoveIcon className="h-3 w-3" />
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
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(bookmark._id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
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
