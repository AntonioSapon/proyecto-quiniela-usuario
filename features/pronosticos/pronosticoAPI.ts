import { authFetch } from '../utils/authFetch';

export const fetchPronosticos = async () => {
  try {
    const response = await authFetch("https://proyecto-quiniela-backend.onrender.com/api/pronosticos");
    if (!response.ok) throw new Error('Error en la respuesta');
    return await response.json();
  } catch (error) {
    console.error('Error fetching pronosticos: ', error);
    throw error;
  }
};

export const createPronosticoPartido = async (participanteId: string, partidoId: string, pronostico: string) => {
  try {
    const response = await authFetch("https://proyecto-quiniela-backend.onrender.com/api/pronosticos", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Añadir header
      },
      body: JSON.stringify({ 
        participanteId, 
        partidoId, 
        prediccion: pronostico // Cambiar nombre a "prediccion"
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear pronóstico');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating pronóstico: ', error);
    throw error;
  }
};

export const createPronosticoCampeonGoleador = async (participanteId: string, campeonPredicho: string, goleadorPredicho: string) => {
  try {
    const response = await authFetch(`https://proyecto-quiniela-backend.onrender.com/api/participantes/${participanteId}/predicciones-extras`, {
      method: 'POST',
      body: JSON.stringify({ participanteId, campeonPredicho, goleadorPredicho })
    });
    if (!response.ok) throw new Error('Error al crear pronóstico');
    return await response.json();
  } catch (error) {
    console.error('Error creating pronóstico: ', error);
    throw error;
  }
};

export const updatePronostico = async (id: string, pronostico: string) => {
  try {
    const response = await authFetch(`https://proyecto-quiniela-backend.onrender.com/api/pronosticos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ pronostico })
    });
    if (!response.ok) throw new Error('Error al actualizar pronóstico');
    return await response.json();
  } catch (error) {
    console.error('Error updating pronóstico: ', error);
    throw error;
  }
};



