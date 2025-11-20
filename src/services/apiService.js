import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Posts ---
export const getPosts = () => api.get('/posts');
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (postData) => api.post('/posts', postData);
export const updatePost = (id, postData) => api.put(`/posts/${id}`, postData);
export const deletePost = (id) => api.delete(`/posts/${id}`);

// --- Categorías ---
export const getCategories = () => api.get('/categories');

// --- Comentarios ---
export const getComments = (postId) => api.get(`/posts/${postId}/comments`);
export const createComment = (postId, data) => api.post(`/posts/${postId}/comments`, data);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);
export const updateComment = (commentId, data) => api.put(`/comments/${commentId}`, data);

export default api;