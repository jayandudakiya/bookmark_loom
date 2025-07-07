import { BookmarkCard } from '@/components/bookmark/bookmark-card';
import { BookmarkForm } from '@/components/bookmark/bookmark-form';
import { EmptyState } from '@/components/bookmark/empty-state';
import { Header } from '@/components/bookmark/header';
import { SearchAndFilters } from '@/components/bookmark/search-and-filters';
import { StatsBar } from '@/components/bookmark/stats-bar';
import type {
  Bookmark,
  BookmarkForm as BookmarkFromType,
} from '@/types/bookmark';
import type { Profile } from '@/types/user';
import { useEffect, useState } from 'react';

const BookmarkContainer = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<Profile>({
    user_name: '',
    email: '',
    isDeleted: false,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookmarkFromType>({
    name: '',
    url: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    setUser({
      user_name: 'John Doe',
      email: 'john.doe@example.com',
      isDeleted: false,
    });
  }, []);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Filter bookmarks based on search and category
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || bookmark.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Website name is required';
    }
    if (!formData.url.trim()) {
      errors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        errors.url = 'Please enter a valid URL';
      }
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({ name: '', url: '', category: '', description: '' });
    setFormErrors({});
    setEditingBookmark(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingBookmark) {
      setBookmarks(
        bookmarks.map((bookmark) =>
          bookmark._id === editingBookmark._id
            ? { ...bookmark, ...formData }
            : bookmark
        )
      );
    } else {
      const newBookmark: Bookmark = {
        _id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      };
      setBookmarks([newBookmark, ...bookmarks]);
    }

    resetForm();
    setIsDialogOpen(false);
    setIsSubmitting(false);
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

  const handleDelete = (_id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark._id !== _id));
  };

  const handleCopyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleAddBookmark = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 lg:pt-0">
        <div className="w-full px-4 lg:px-6 lg:py-8 max-w-none">
          <Header
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            profile={user}
            onLogout={handleLogout}
          />

          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddBookmark={handleAddBookmark}
          />

          <StatsBar
            totalBookmarks={bookmarks.length}
            filteredCount={filteredBookmarks.length}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
          />

          {filteredBookmarks.length === 0 ? (
            <EmptyState
              totalBookmarks={bookmarks.length}
              onAddBookmark={handleAddBookmark}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredBookmarks.map((bookmark, index) => (
                <BookmarkCard
                  key={bookmark._id}
                  bookmark={bookmark}
                  index={index}
                  copiedId={copiedId}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onCopyLink={handleCopyLink}
                />
              ))}
            </div>
          )}

          <BookmarkForm
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
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
