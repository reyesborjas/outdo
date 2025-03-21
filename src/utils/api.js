import axios from 'axios';

// Base API URL
const API_URL = 'https://api.outdoer.com'; // Reemplaza con tu URL de API real

// Crear instancia de axios con configuración común
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores específicos
    if (error.response) {
      // Errores del servidor (status diferente a 2xx)
      switch (error.response.status) {
        case 401:
          // No autorizado - redirigir a la página de login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Prohibido - sin permisos
          console.error('No tienes permisos para realizar esta acción');
          break;
        case 404:
          // Recurso no encontrado
          console.error('El recurso solicitado no existe');
          break;
        case 500:
          // Error interno del servidor
          console.error('Error en el servidor, inténtalo más tarde');
          break;
        default:
          console.error('Error en la solicitud:', error.response.data);
      }
    } else if (error.request) {
      // Sin respuesta del servidor
      console.error('No se recibió respuesta del servidor');
    } else {
      // Error en la configuración de la solicitud
      console.error('Error en la configuración de la solicitud:', error.message);
    }

    return Promise.reject(error);
  }
);

// Funciones de API para entidades principales

// Actividades
export const activityService = {
  getAll: (params = {}) => api.get('/activities', { params }),
  getById: (id) => api.get(`/activities/${id}`),
  create: (data) => api.post('/activities', data),
  update: (id, data) => api.put(`/activities/${id}`, data),
  delete: (id) => api.delete(`/activities/${id}`),
  getCategories: () => api.get('/activity-categories'),
  getReviews: (id) => api.get(`/activities/${id}/reviews`),
  scheduleActivity: (id, scheduleData) => api.post(`/activities/${id}/schedules`, scheduleData),
  bookActivity: (scheduleId, bookingData) => api.post(`/activity-schedules/${scheduleId}/bookings`, bookingData),
};

// Expediciones
export const expeditionService = {
  getAll: (params = {}) => api.get('/expeditions', { params }),
  getById: (id) => api.get(`/expeditions/${id}`),
  create: (data) => api.post('/expeditions', data),
  update: (id, data) => api.put(`/expeditions/${id}`, data),
  delete: (id) => api.delete(`/expeditions/${id}`),
  getRoutes: (id) => api.get(`/expeditions/${id}/routes`),
  getReviews: (id) => api.get(`/expeditions/${id}/reviews`),
  scheduleDates: (id, dateData) => api.post(`/expeditions/${id}/dates`, dateData),
  bookExpedition: (dateId, bookingData) => api.post(`/expedition-dates/${dateId}/bookings`, bookingData),
};

// Guías
export const guideService = {
  getAll: (params = {}) => api.get('/guides', { params }),
  getById: (id) => api.get(`/guides/${id}`),
  getActivities: (id) => api.get(`/guides/${id}/activities`),
  getExpeditions: (id) => api.get(`/guides/${id}/expeditions`),
  getReviews: (id) => api.get(`/guides/${id}/reviews`),
  getCertifications: (id) => api.get(`/guides/${id}/certifications`),
  updateProfile: (id, data) => api.put(`/guides/${id}`, data),
  updateAvailability: (id, data) => api.put(`/guides/${id}/availability`, data),
};

// Exploradores
export const explorerService = {
  getAll: (params = {}) => api.get('/explorers', { params }),
  getById: (id) => api.get(`/explorers/${id}`),
  getBookings: (id) => api.get(`/explorers/${id}/bookings`),
  getReviews: (id) => api.get(`/explorers/${id}/reviews`),
  updateProfile: (id, data) => api.put(`/explorers/${id}`, data),
};

// Ubicaciones
export const locationService = {
  getAll: (params = {}) => api.get('/locations', { params }),
  getById: (id) => api.get(`/locations/${id}`),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
  getActivitiesByLocation: (id) => api.get(`/locations/${id}/activities`),
  getExpeditionsByLocation: (id) => api.get(`/locations/${id}/expeditions`),
};

// Recursos
export const resourceService = {
  getAll: (params = {}) => api.get('/resources', { params }),
  getById: (id) => api.get(`/resources/${id}`),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
  getCategories: () => api.get('/resource-categories'),
};

// Autenticación
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  refreshToken: () => api.post('/auth/refresh-token'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export default api;