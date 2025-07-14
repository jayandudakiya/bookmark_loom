import axiosInstance from '@/lib/axiosInstance';
export const createBookmarkService = async (payload) => {
    const response = await axiosInstance.post('/bookmark/create', payload);
    return response.data;
};
export const getBookmarksService = async () => {
    const response = await axiosInstance.get('/bookmark/list');
    return response.data;
};
export const updateBookmarksService = async (payload) => {
    const response = await axiosInstance.post('/bookmark/update', payload);
    return response.data;
};
export const deleteBookmarkService = async (payload) => {
    const response = await axiosInstance.post(`/bookmark/delete`, payload);
    return response.data;
};
