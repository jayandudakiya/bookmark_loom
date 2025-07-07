import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Edit, Trash2, ExternalLink, Copy, Check } from 'lucide-react';
import type { Bookmark } from '@/types/bookmark';

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  copiedId: string | null;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onCopyLink: (url: string, id: string) => void;
}

export function BookmarkCard({
  bookmark,
  index,
  copiedId,
  onEdit,
  onDelete,
  onCopyLink,
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
      className="group hover:shadow-2xl transition-all duration-300 bg-card border-2 hover:border-primary/30 backdrop-blur-sm hover:scale-[1.02] animate-slide-in-up"
      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate text-card-foreground">
              {bookmark.name}
            </CardTitle>
            <CardDescription className="text-sm truncate font-mono bg-muted/50 px-2 py-1 rounded mt-1">
              {bookmark.url}
            </CardDescription>
          </div>
          <Badge
            className={`ml-2 shadow-sm ${getCategoryColor(bookmark.category)}`}
          >
            {bookmark.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {bookmark.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 bg-muted/30 p-3 rounded-lg">
            {bookmark.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 bg-primary/10 hover:bg-primary/20 border-primary/20 transition-all hover:scale-105"
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              Visit
            </a>
          </Button>
          <div className="flex gap-1">
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
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(bookmark)}
              className="hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-all hover:scale-110"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300 transition-all hover:scale-110"
                >
                  <Trash2 className="h-3 w-3" />
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
