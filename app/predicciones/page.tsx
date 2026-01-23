'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/Redux/store';
import { fetchParticipantesThunk } from '@/features/participantes/participanteSlice';
import Predicciones from './Predicciones';

const PrediccionesPage = () => {
  const dispatch = useAppDispatch();

  // Cargar participantes al montar la página
  useEffect(() => {
    dispatch(fetchParticipantesThunk());
  }, [dispatch]);

  return (
    <div className="min-vh-100 py-4">
      <div className="container">
        <Predicciones />
      </div>
    </div>
  );
};

export default PrediccionesPage;