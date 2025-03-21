import { authService } from './api';

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    // Check if token is expired
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp && decoded.exp > currentTime) {
      return true;
    } else {
      // Token expired
      localStorage.removeItem('token');
      return false;
    }
  } catch (error) {
    console.error('Error validating token:', error);
    localStorage.removeItem('token');
    return false;
  }
};

// Get current user data from token
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return {
      id: decoded.user_id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role_name,
      firstName: decoded.first_name,
      lastName: decoded.last_name,
      avatar: decoded.profile_image_url
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await authService.login({ email, password });
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return { success: true, user: getCurrentUser() };
    } else {
      throw new Error('No se recibió un token válido');
    }
  } catch (error) {
    let errorMessage = 'Error al iniciar sesión';
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Credenciales incorrectas';
          break;
        case 403:
          errorMessage = 'Cuenta desactivada o sin permisos';
          break;
        case 429:
          errorMessage = 'Demasiados intentos fallidos. Inténtalo más tarde';
          break;
        default:
          errorMessage = error.response.data.message || errorMessage;
      }
    }
    
    return { success: false, message: errorMessage };
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await authService.register(userData);
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return { success: true, user: getCurrentUser() };
    }
    
    return { success: true, message: 'Registro exitoso. Inicia sesión para continuar.' };
  } catch (error) {
    let errorMessage = 'Error al registrar usuario';
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Datos de registro inválidos';
          break;
        case 409:
          errorMessage = 'El correo electrónico ya está registrado';
          break;
        default:
          errorMessage = error.response.data.message || errorMessage;
      }
    }
    
    return { success: false, message: errorMessage };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

// Check user role
export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // If requiredRole is an array, check if user has any of the roles
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  // Otherwise check for the specific role
  return user.role === requiredRole;
};

// Check if token needs refresh
export const checkTokenRefresh = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // If token expires in less than 5 minutes, refresh it
    if (decoded.exp && decoded.exp - currentTime < 300) {
      const response = await authService.refreshToken();
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking token refresh:', error);
    return false;
  }
};

// Setup token refresh interval
export const setupTokenRefresh = () => {
  // Check every 4 minutes
  const refreshInterval = setInterval(async () => {
    if (isAuthenticated()) {
      await checkTokenRefresh();
    } else {
      clearInterval(refreshInterval);
    }
  }, 4 * 60 * 1000);
  
  return refreshInterval;
};