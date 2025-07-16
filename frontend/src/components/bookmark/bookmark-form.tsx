import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { categories, type Bookmark, type BookmarkForm } from '@/types/bookmark';
import z from 'zod';
import { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface BookmarkFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingBookmark: Bookmark | null;
  formData: BookmarkForm;
  onFormDataChange: (data: BookmarkForm) => void;
  formErrors: { [key: string]: string };
  isSubmitting: boolean;
  onSubmit: (data: BookmarkFormSchema) => void;
}

const bookmarkSchema = z.object({
  name: z.string().min(1, 'Website name is required.'),
  url: z
    .string()
    .url('Enter a valid URL.')
    .regex(/^https?:\/\//, 'URL must start with http:// or https://'),
  category: z.string().min(1, 'Category is required.'),
  description: z
    .string()
    .max(200, 'Description must be at most 200 characters.')
    .optional(),
});

export type BookmarkFormSchema = z.infer<typeof bookmarkSchema>;
export function BookmarkForm({
  isOpen,
  onClose,
  editingBookmark,
  isSubmitting,
  onSubmit,
}: BookmarkFormProps) {
  const form = useForm<BookmarkFormSchema>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      name: '',
      url: '',
      category: '',
      description: '',
    },
    mode: 'onBlur',
  });
  // Reset form when modal opens
  useEffect(() => {
    if (editingBookmark) {
      form.reset(editingBookmark);
    } else {
      form.reset({
        name: '',
        url: '',
        category: '',
        description: '',
      });
    }
  }, [editingBookmark, isOpen, form]);

  const handelOnClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handelOnClose}>
      <DialogContent
        className="sm:max-w-md animate-scale-in"
        onInteractOutside={(e) => e.preventDefault()}
      >
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GitHub" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description (optional) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-muted">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the website..."
                      rows={3}
                      maxLength={200}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
