import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/types/bookmark';
import { Search } from 'lucide-react';
import { ReactComponent as BookmarkAddIcon } from '@/assets/icons/bookmarks/bookmark-add.svg';
import { ReactComponent as FavoriteIcon } from '@/assets/icons/favorite/favorite.svg';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  onAddBookmark: () => void;
  showFavoritesOnly: boolean; // ✅ NEW
  onToggleFavorites: () => void; // ✅ NEW
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onAddBookmark,
  onToggleFavorites,
  showFavoritesOnly,
}: SearchAndFiltersProps) {
  return (
    <div
      className="flex flex-col gap-4 mb-8 animate-slide-in-up w-full"
      style={{ animationDelay: '0.1s' }}
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 border-2 focus:border-primary/50 transition-all duration-300"
          />
        </div>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full lg:w-64 min-h-12 border-2 focus:border-primary/50 transition-all duration-300">
            <SelectValue placeholder="All Categories" />
            {/* <SelectItem value="favorites">Favorites</SelectItem> */}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={onAddBookmark}
          className="h-11 w-14 cursor-pointer px-6 bg-primary hover:bg-primary/75 transition-all duration-300 shadow-lg hover:shadow-xl hover:opacity-75"
        >
          <BookmarkAddIcon className="stroke-zinc-950 dark:stroke-zinc-50" />
        </Button>
        <Button
          variant={showFavoritesOnly ? 'secondary' : 'outline'}
          onClick={onToggleFavorites}
          className="h-12 min-w-[50px] whitespace-nowrap"
        >
          {showFavoritesOnly ? <FavoriteIcon className='fill-red-400' /> : <FavoriteIcon />}
        </Button>
      </div>
    </div>
  );
}
