import { authFetch } from '../utils/authFetch';

export const fetchPartidos = async () => {
  try {
    const response = await authFetch("https://proyecto-quiniela-backend.onrender.com/api/partidos");
    if (!response.ok) throw new Error('Error en la respuesta');
    return await response.json();
  } catch (error) {
    console.error('Error fetching partidos: ', error);
    throw error;
  }
};

// Crear partido
export const createPartido = async (jornada: string, local: string, visitante: string) => {
  try {
    const response = await authFetch("https://proyecto-quiniela-backend.onrender.com/api/partidos", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jornada, local, visitante })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear partido');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating partido: ', error);
    throw error;
  }
};

// Actualizar resultado (usando PATCH)
export const updateResultadoPartido = async (id: string, resultado: string) => {
  try {
    const response = await authFetch(`https://proyecto-quiniela-backend.onrender.com/api/partidos/${id}/resultado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resultado })
    });
    
    if (!response.ok) {
      // Mejor manejo de errores
      let errorMessage = 'Error al actualizar resultado';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // No se pudo parsear la respuesta de error
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating resultado: ', error);
    throw error;
  }
};

export const deletePartido = async (id: string) => {
  try {
    const response = await authFetch(`https://proyecto-quiniela-backend.onrender.com/api/partidos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar partido');
    return await response.json();
  } catch (error) {
    console.error('Error deleting partido: ', error);
    throw error;
  }
};