/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookmarkCard } from '@/components/bookmark/bookmark-card';
import {
  BookmarkForm,
  type BookmarkFormSchema,
} from '@/components/bookmark/bookmark-form';
import { EmptyState } from '@/components/bookmark/empty-state';
import { SearchAndFilters } from '@/components/bookmark/search-and-filters';
import { StatsBar } from '@/components/bookmark/stats-bar';
import { Skeleton } from '@/components/ui/skeleton';
import type { AppDispatch, RootState } from '@/store/store';
import {
  createBookmarkThunk,
  deleteBookmarkThunk,
  getBookmarksThunk,
  updateBookmarksThunk,
} from '@/store/thunk/bookmark.thunk';
import type {
  Bookmark,
  BookmarkForm as BookmarkFromType,
} from '@/types/bookmark';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Papa from 'papaparse';

const BookmarkContainer = () => {
  const { bookmarks, isLoading } = useSelector(
    (state: RootState) => state.bookmark
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [updatingBookmarkId, setUpdatingBookmarkId] = useState<string | null>(
    null
  );
  const [deletingBookmarkId, setDeletingBookmarkId] = useState<string | null>(
    null
  );

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookmarkFromType>({
    name: '',
    url: '',
    category: '',
    description: '',
  });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getBookmarksThunk());
      } catch (error) {
        console.log('error', error);
      }
    };
    if (bookmarks === null) fetchData();
  }, []);

  const filteredBookmarks =
    bookmarks &&
    bookmarks.filter((bookmark) => {
      const matchesSearch =
        bookmark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || bookmark.category === selectedCategory;

      const matchesFavorite =
        !showFavoritesOnly || bookmark.is_favorite === true;

      return matchesSearch && matchesCategory && matchesFavorite;
    });

  const resetForm = () => {
    setFormData({ name: '', url: '', category: '', description: '' });
    setFormErrors({});
    setEditingBookmark(null);
  };

  const handleSubmit = async (data: BookmarkFormSchema) => {
    setIsSubmitting(true);

    try {
      if (editingBookmark) {
        const editBookmarkData = { ...editingBookmark, ...data };

        const resultAction = await dispatch(
          updateBookmarksThunk(editBookmarkData)
        );

        if (updateBookmarksThunk.fulfilled.match(resultAction)) {
          toast.success(
            resultAction.payload?.message || 'Bookmark updated successfully!'
          );
        } else if (updateBookmarksThunk.rejected.match(resultAction)) {
          toast.error(
            resultAction.payload?.message || 'Failed to update bookmark'
          );
          return;
        }
      } else {
        const resultAction = await dispatch(createBookmarkThunk(data));

        if (createBookmarkThunk.fulfilled.match(resultAction)) {
          toast.success(
            resultAction.payload.message || 'Bookmark created successfully!'
          );
        } else if (createBookmarkThunk.rejected.match(resultAction)) {
          toast.error(
            resultAction.payload?.message || 'Failed to create bookmark'
          );
          return;
        }
      }

      resetForm();
      setIsDialogOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Submit error:', err);
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({
      name: bookmark.name,
      url: bookmark.url,
      category: bookmark.category,
      description: bookmark.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (_id: string) => {
    if (!_id) {
      toast.error('_id is required to delete bookmark');
      return;
    }
    setDeletingBookmarkId(_id);
    try {
      const resultAction = await dispatch(deleteBookmarkThunk({ _id }));

      if (deleteBookmarkThunk.fulfilled.match(resultAction)) {
        toast.success(
          resultAction.payload?.message || 'Bookmark deleted successfully.'
        );
      } else {
        toast.error(
          resultAction.payload?.message || 'Failed to delete bookmark.'
        );
      }
    } catch (err: any) {
      console.error('Delete failed:', err);
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setDeletingBookmarkId(null);
    }
  };

  const handleCopyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link.');
    }
  };

  const handleToggleFavorite = async (bookmark: Bookmark) => {
    setUpdatingBookmarkId(bookmark._id);
    try {
      const resultAction = await dispatch(
        updateBookmarksThunk({
          _id: bookmark._id,
          is_favorite: !bookmark.is_favorite,
        })
      );

      if (updateBookmarksThunk.fulfilled.match(resultAction)) {
        toast.success(
          resultAction.payload?.message ||
            `Bookmark ${
              bookmark.is_favorite ? 'removed from' : 'added to'
            } favorites.`
        );
      } else {
        toast.error(
          resultAction.payload?.message || 'Failed to update favorite status.'
        );
      }
    } catch (err: any) {
      console.error('Favorite toggle failed:', err);
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setUpdatingBookmarkId(null);
    }
  };

  const handleAddBookmark = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const downloadBookmarksCSV = ({
    filename = 'bookmarks.csv',
  }: {
    bookmarksData?: Bookmark[];
    filename?: string;
  }) => {
    setIsDownloading(true);

    const dataWithIndex = bookmarks?.map((bookmark, index) => ({
      Index: index + 1,
      ID: bookmark._id,
      Name: bookmark.name,
      URL: bookmark.url,
      Category: bookmark.category,
      Description: bookmark.description,
      CreatedAt: new Date(bookmark.createdAt).toISOString(),
      Favorite: bookmark.is_favorite ? 'Yes' : 'No',
    }));

    const csv = Papa.unparse(dataWithIndex || []);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloading(false);
    toast.success('Bookmarks downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 lg:pt-0">
        <div className="w-full p-5 lg:px-6 lg:py-[70px] max-w-none">
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddBookmark={handleAddBookmark}
            showFavoritesOnly={showFavoritesOnly} // ✅
            onToggleFavorites={setShowFavoritesOnly} // ✅
            downloadBookmarksCSV={downloadBookmarksCSV} // ✅
            isDownloading={isDownloading} // ✅
          />

          <div className="flex flex-col gap-3">
            <StatsBar
              totalBookmarks={bookmarks?.length || 0}
              filteredCount={filteredBookmarks?.length || 0}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
            />

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-4 gap-4">
                {[1, 2, 3].map((num) => {
                  return <Skeleton className="col-span-2 h-44" key={num} />;
                })}
              </div>
            ) : filteredBookmarks && filteredBookmarks.length === 0 ? (
              <EmptyState
                totalBookmarks={bookmarks.length}
                onAddBookmark={handleAddBookmark}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-4 gap-4">
                {filteredBookmarks &&
                  filteredBookmarks.map((bookmark, index) => (
                    <BookmarkCard
                      key={bookmark._id}
                      bookmark={bookmark}
                      index={index}
                      copiedId={copiedId}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onCopyLink={handleCopyLink}
                      onToggleFavorite={handleToggleFavorite}
                      isDeleting={deletingBookmarkId === bookmark._id}
                      isUpdating={updatingBookmarkId === bookmark._id}
                    />
                  ))}
              </div>
            )}
          </div>

          <BookmarkForm
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setEditingBookmark(null);
            }}
            editingBookmark={editingBookmark}
            formData={formData}
            onFormDataChange={setFormData}
            formErrors={formErrors}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default BookmarkContainer;
