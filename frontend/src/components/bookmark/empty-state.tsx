'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReactComponent as BookmarkIcon } from '@/assets/icons/bookmarks/bookmarks.svg';
import { ReactComponent as AddBookmarkIcon } from '@/assets/icons/bookmarks/bookmark-add.svg';

interface EmptyStateProps {
  totalBookmarks: number;
  onAddBookmark: () => void;
}

export function EmptyState({ totalBookmarks, onAddBookmark }: EmptyStateProps) {
  return (
    <Card
      className="text-center py-16 bg-card border-2 border-dashed border-muted-foreground/20 animate-slide-in-up"
      style={{ animationDelay: '0.2s' }}
    >
      <CardContent>
        <div className="p-4 bg-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <BookmarkIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          No bookmarks found
        </h3>
        <p className="text-muted-foreground mb-6 text-lg">
          {totalBookmarks === 0
            ? 'Start by adding your first bookmark!'
            : 'Try adjusting your search or filter criteria.'}
        </p>
        {totalBookmarks === 0 && (
          <Button
            onClick={onAddBookmark}
            className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <AddBookmarkIcon className="h-4 w-4 mr-2" />
            Add Your First Bookmark
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
