import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type React from 'react';
import { categories, type Bookmark, type BookmarkForm } from '@/types/bookmark';


interface BookmarkFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingBookmark: Bookmark | null;
  formData: BookmarkForm;
  onFormDataChange: (data: BookmarkForm) => void;
  formErrors: { [key: string]: string };
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function BookmarkForm({
  isOpen,
  onClose,
  editingBookmark,
  formData,
  onFormDataChange,
  formErrors,
  isSubmitting,
  onSubmit,
}: BookmarkFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>
            {editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
          </DialogTitle>
          <DialogDescription>
            {editingBookmark
              ? 'Update your bookmark details.'
              : 'Add a new bookmark to your collection.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Website Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                onFormDataChange({ ...formData, name: e.target.value })
              }
              autoComplete="off"
              placeholder="e.g., GitHub"
              className={formErrors.name ? 'border-destructive' : ''}
              required
            />
            {formErrors.name && (
              <p className="text-destructive text-sm mt-1 animate-slide-in-up">
                {formErrors.name}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) =>
                onFormDataChange({ ...formData, url: e.target.value })
              }
              placeholder="https://github.com"
              className={formErrors.url ? 'border-destructive' : ''}
              required
            />
            {formErrors.url && (
              <p className="text-destructive text-sm mt-1 animate-slide-in-up">
                {formErrors.url}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                onFormDataChange({ ...formData, category: value })
              }
              required
              
            >
              <SelectTrigger
                className={formErrors.category ? 'border-destructive w-full' : 'w-full'}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.category && (
              <p className="text-destructive text-sm mt-1 animate-slide-in-up">
                {formErrors.category}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                onFormDataChange({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the website..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  {editingBookmark ? 'Updating...' : 'Adding...'}
                </div>
              ) : (
                <>{editingBookmark ? 'Update' : 'Add'} Bookmark</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
