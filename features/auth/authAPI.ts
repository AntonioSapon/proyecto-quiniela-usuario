import { authFetch } from '../utils/authFetch';

export const loginUser = async (credentials: { user: string; password: string }) => {
  try {
    const response = await fetch("https://proyecto-quiniela-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error de autenticación');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Función para verificar la sesión
export const checkSession = async () => {
  try {
    const response = await authFetch("https://proyecto-quiniela-backend.onrender.com/api/auth/check-session");
    if (!response.ok) throw new Error('Sesión inválida');
    return await response.json();
  } catch (error) {
    console.error('Error verificando sesión:', error);
    throw error;
  }
};