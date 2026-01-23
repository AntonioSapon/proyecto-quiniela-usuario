export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && options.body) {
    headers.append('Content-Type', 'application/json');
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Manejar errores de autenticación
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Error de conexión con el servidor');
  }
};