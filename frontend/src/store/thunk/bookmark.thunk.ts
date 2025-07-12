import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createBookmarkService,
  deleteBookmarkService,
  getBookmarksService,
  updateBookmarksService,
} from '@/store/services/bookmark.service';
import type {
  APIError,
  CreateBookMarkPayload,
  CreateBookMarkResponse,
  DeleteBookMarkPayload,
  DeleteBookMarkResponse,
  FetchBookMarkResponse,
  UpdateBookMarkPayload,
  UpdateBookMarkResponse,
} from '@/types/bookmark';
import { AxiosError } from 'axios';
import { API_Response_status } from '@/types/auth';

export const createBookmarkThunk = createAsyncThunk<
  CreateBookMarkResponse,
  CreateBookMarkPayload,
  { rejectValue: APIError }
>('bookmark/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await createBookmarkService(payload);
    if (res.status === API_Response_status.SUCCESS) {
      return res;
    }
    throw Error('error in the create bookmark');
  } catch (err) {
    const error = err as AxiosError<APIError>;
    return rejectWithValue({
      message: error.response?.data?.message || 'Failed to create bookmark',
      status: error.response?.data?.status,
    });
  }
});

export const getBookmarksThunk = createAsyncThunk<
  FetchBookMarkResponse,
  void,
  { rejectValue: APIError }
>('bookmark/list', async (_, { rejectWithValue }) => {
  try {
    const res = await getBookmarksService();
    if (res.status === API_Response_status.SUCCESS) {
      return res;
    }
    throw Error('error in the fetching bookmarks list');
  } catch (err) {
    const error = err as AxiosError<APIError>;
    return rejectWithValue({
      message: error.response?.data?.message || 'Failed to fetch bookmarks',
      status: error.response?.data?.status,
    });
  }
});

export const updateBookmarksThunk = createAsyncThunk<
  UpdateBookMarkResponse,
  UpdateBookMarkPayload,
  { rejectValue: APIError }
>('bookmark/update', async (payload, { rejectWithValue }) => {
  try {
    const res = await updateBookmarksService(payload);
    if (res.status === API_Response_status.SUCCESS) {
      return res;
    }
    throw Error('error in the updating bookmark');
  } catch (err) {
    const error = err as AxiosError<APIError>;
    return rejectWithValue({
      message: error.response?.data?.message || 'Failed to fetch bookmarks',
      status: error.response?.data?.status,
    });
  }
});

export const deleteBookmarkThunk = createAsyncThunk<
  DeleteBookMarkResponse,
  DeleteBookMarkPayload,
  { rejectValue: APIError }
>('bookmark/delete', async (payload, { rejectWithValue }) => {
  try {
    const res = await deleteBookmarkService(payload);
    if (res.status === API_Response_status.SUCCESS) {
      return res;
    }
    throw Error('error in the deleting bookmark');
  } catch (err) {
    const error = err as AxiosError<APIError>;
    return rejectWithValue({
      message: error.response?.data?.message || 'Failed to delete bookmark',
      status: error.response?.data?.status,
    });
  }
});
