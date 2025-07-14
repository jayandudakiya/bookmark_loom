interface StatsBarProps {
  totalBookmarks: number;
  filteredCount: number;
  searchTerm: string;
  selectedCategory: string;
}

export function StatsBar({
  totalBookmarks,
  filteredCount,
  searchTerm,
  selectedCategory,
}: StatsBarProps) {
  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-3 border">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse-slow"></div>
        <span className="font-medium">Total: {totalBookmarks} bookmarks</span>
      </div>
      {(searchTerm || selectedCategory !== 'all') && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
          <span className="font-medium">Showing: {filteredCount} results</span>
        </div>
      )}
      {selectedCategory !== 'all' && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Category: {selectedCategory}</span>
        </div>
      )}
    </div>
  );
}
