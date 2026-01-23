import { authFetch } from '../utils/authFetch';

export const fetchParticipantes = async () => {
  try {
    const response = await authFetch("https://proyecto-quiniela-backend.onrender.com/api/participantes");
    if (!response.ok) throw new Error('Error en la respuesta');
    return await response.json();
  } catch (error) {
    console.error('Error fetching participantes: ', error);
    throw error;
  }
};

export const createParticipante = async (nombre: string) => {
  try {
    const response = await authFetch("https://proyecto-quiniela-backend.onrender.com/api/participantes", {
      method: 'POST',
      body: JSON.stringify({ nombre })
    });
    if (!response.ok) throw new Error('Error al crear participante');
    return await response.json();
  } catch (error) {
    console.error('Error creating participante: ', error);
    throw error;
  }
};

export const deleteParticipante = async (id: string) => {
  try {
    const response = await authFetch(`https://proyecto-quiniela-backend.onrender.com/api/participantes/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar participante');
    return await response.json();
  } catch (error) {
    console.error('Error deleting participante: ', error);
    throw error;
  }
};


export const fetchPronosticoPartidos = async (_id: string) => {
  try {
    const response = await authFetch(`https://proyecto-quiniela-backend.onrender.com/api/participantes/${_id}/pronosticos`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Error al crear pronóstico');
    return await response.json();
  } catch (error) {
    console.error('Error creating pronóstico: ', error);
    throw error;
  }
};