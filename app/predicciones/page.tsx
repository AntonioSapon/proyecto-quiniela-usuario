'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/Redux/store';
import { fetchParticipantesThunk } from '@/features/participantes/participanteSlice';
import Predicciones from './Predicciones';
import styles from './predicciones.module.css';

const PrediccionesPage = () => {
  const dispatch = useAppDispatch();

  // Cargar participantes al montar la página
  useEffect(() => {
    dispatch(fetchParticipantesThunk());
  }, [dispatch]);

  return (

    <section className={styles.predicPage}>

      <div className={styles.content}>

        {/* HEADER ESTILO INICIO */}
        <div className={styles.sectionHeader}>
          <h2 className="mb-0 text-white fw-bold">
            <i className="bi bi-graph-up me-3"> </i>
             ㅤPredicciones
          </h2>
        </div>

          <Predicciones />

      </div>

    </section>

  );
};

export default PrediccionesPage;