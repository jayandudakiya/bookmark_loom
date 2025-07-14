import axiosInstance from '@/lib/axiosInstance';
import type {
  CreateBookMarkPayload,
  CreateBookMarkResponse,
  DeleteBookMarkPayload,
  DeleteBookMarkResponse,
  FetchBookMarkResponse,
  UpdateBookMarkPayload,
  UpdateBookMarkResponse,
} from '@/types/bookmark';
import type { AxiosResponse } from 'axios';

export const createBookmarkService = async (
  payload: CreateBookMarkPayload
): Promise<CreateBookMarkResponse> => {
  const response: AxiosResponse<CreateBookMarkResponse> =
    await axiosInstance.post('/bookmark/create', payload);
  return response.data;
};

export const getBookmarksService = async (): Promise<FetchBookMarkResponse> => {
  const response: AxiosResponse<FetchBookMarkResponse> =
    await axiosInstance.get('/bookmark/list');
  return response.data;
};

export const updateBookmarksService = async (
  payload: UpdateBookMarkPayload
): Promise<UpdateBookMarkResponse> => {
  console.log('➡ ~ payload:', payload)
  const response: AxiosResponse<UpdateBookMarkResponse> =
    await axiosInstance.post(`/bookmark/update`, payload);
  return response.data;
};

export const deleteBookmarkService = async (
  payload: DeleteBookMarkPayload
): Promise<DeleteBookMarkResponse> => {
  const response: AxiosResponse<DeleteBookMarkResponse> =
    await axiosInstance.post(`/bookmark/delete`, payload);
  return response.data;
};
