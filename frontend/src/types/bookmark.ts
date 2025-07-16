import type { API_RESPONSE_STATUS } from '@/types/auth';

export type Bookmark = {
  _id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  createdAt: Date;
  is_favorite?: boolean;
};

export interface CreateBookMarkPayload {
  name: string;
  url: string;
  category: string;
  description?: string;
}

export interface CreateBookMarkResponse {
  status: API_RESPONSE_STATUS;
  message?: string;
  bookmark?: Bookmark;
}

export interface FetchBookMarkResponse {
  status: API_RESPONSE_STATUS;
  message?: string;
  bookmarks: Bookmark[];
}

export interface UpdateBookMarkPayload {
  _id: string;
  name?: string;
  url?: string;
  category?: string;
  description?: string;
  is_favorite?: boolean;
}

export interface UpdateBookMarkResponse {
  status: API_RESPONSE_STATUS;
  message?: string;
  updatedBookmark?: Bookmark;
}

export interface DeleteBookMarkPayload {
  _id: string;
}

export interface DeleteBookMarkResponse {
  status: API_RESPONSE_STATUS;
  message?: string;
  deletedBookmark_id?: string;
}

export interface BookmarkForm {
  name: string;
  url: string;
  category: string;
  description: string;
}

export const categories = [
  'Development',
  'Design',
  'News',
  'Social Media',
  'Entertainment',
  'Education',
  'Shopping',
  'Tools',
  'Business',
  'Movies',
  'Music',
  'Sports',
  'Food',
  'Lifestyle',
  'Gaming',
  'Science',
  'Technology',
  'Art',
  'Fashion',
  'Photography',
  'Health',
  'Finance',
  'Productivity',
  'Travel',
  'Other',
];

export interface APIError {
  message?: string;
  status?: API_RESPONSE_STATUS;
}
