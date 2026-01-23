// resetAPI.ts
import { authFetch } from '../utils/authFetch';

export const resetAllData = async () => {
  try {
    const response = await authFetch("https://proyecto-quiniela-backend.onrender.com/api/reset", {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar datos');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error resetting all data: ', error);
    throw error;
  }
};