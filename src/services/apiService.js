import axios from 'axios';


const API_URL = 'http://localhost:5000/api';

//  instancia de Axios
const api = axios.create({
    baseURL: API_URL
});


api.interceptors.request.use(
    (config) => {
        // Obtenemos el token de localStorage
        const token = localStorage.getItem('token');
        
        // Si el token existe, lo añadimos 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Funciones de API para Posts ---

// GET /api/posts
export const getPosts = () => {
    // El interceptor añadirá el token automáticamente
    return api.get('/posts');
};

// GET /api/posts/<id>
export const getPost = (id) => {
    return api.get(`/posts/${id}`);
};

// POST /api/posts
export const createPost = (postData) => {
    return api.post('/posts', postData);
};

// PUT /api/posts/<id>
export const updatePost = (id, postData) => {
    return api.put(`/posts/${id}`, postData);
};

// DELETE /api/posts/<id>
export const deletePost = (id) => {
    return api.delete(`/posts/${id}`);
};

export const getCategories = () => {
    return api.get('/categories');
};

export default api;