import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

API.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const loginAdmin = (data) => API.post('/admin/login', data)

// Categories
export const getCategories = () => API.get('/categories')
export const createCategory = (data) => API.post('/categories', data)
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data)
export const deleteCategory = (id) => API.delete(`/categories/${id}`)

// Products
export const getProducts = (params) => API.get('/products', { params })
export const getProduct = (id) => API.get(`/products/${id}`)
export const createProduct = (data) => API.post('/products', data)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data)
export const deleteProduct = (id) => API.delete(`/products/${id}`)

// Videos
export const getVideos = () => API.get('/videos')
export const createVideo = (data) => API.post('/videos', data)
export const updateVideo = (id, data) => API.put(`/videos/${id}`, data)
export const deleteVideo = (id) => API.delete(`/videos/${id}`)