import { authFetch } from '../utils/authFetch';

export const fetchCampeonGoleadorReal = async () => {
  try {
    const response = await authFetch("https://proyecto-quiniela-backend.onrender.com/api/participantes/puntos-extras");
    if (!response.ok) throw new Error('Error en la respuesta');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};

export const saveCampeonGoleadorReal = async ( campeonReal: string, goleadorReal: string ) => {
  try {
    const response = await authFetch("https://proyecto-quiniela-backend.onrender.com/api/participantes/puntos-extras", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ campeonReal, goleadorReal })
    });
    
    if (!response.ok) throw new Error('Error al guardar Campeón y Goleador Real');
    
    return await response.json();
  } catch (error) {
    console.error('Error saving campeón/goleador real: ', error);
    throw error;
  }
};
