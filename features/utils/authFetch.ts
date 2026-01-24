export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',          // 👈 CLAVE
      credentials: 'omit',   // 👈 CLAVE (no cookies aún)
    });

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
