import type { API_RESPONSE_STATUS } from '@/types/auth';

export interface Bookmark {
  _id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  createdAt: Date;
}

export interface CreateBookMarkPayload {
  name: string;
  url: string;
  category: string;
  description: string;
}

export interface CreateBookMarkResponse {
  status: API_RESPONSE_STATUS;
  message?: string;
}

export interface FetchBookMarkResponse {
  status: API_RESPONSE_STATUS;
  message?: string;
  bookmarks: Bookmark[];
}

export interface UpdateBookMarkPayload {
  name: string;
  url: string;
  category: string;
  description: string;
  _id: string;
}

export interface UpdateBookMarkResponse {
  status: API_RESPONSE_STATUS;
  message?: string;
}

export interface DeleteBookMarkPayload {
  _id: string;
}

export interface DeleteBookMarkResponse {
  status: API_RESPONSE_STATUS;
  message?: string;
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
  'Other',
];
