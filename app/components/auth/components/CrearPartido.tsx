"use client";
import { useState } from 'react';
import { useAppDispatch } from '@/Redux/store';
import { createPartidoThunk } from '@/features/partidos/partidoSlice';
import styles from './admin.module.css';

export default function CrearPartido() {
  const dispatch = useAppDispatch();
  const [jornada, setJornada] = useState('');
  const [local, setLocal] = useState('');
  const [visitante, setVisitante] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dispatch(createPartidoThunk({ 
        jornada, 
        local, 
        visitante 
      })).unwrap();
      
      alert('Partido creado exitosamente!');
      setJornada('');
      setLocal('');
      setVisitante('');
    } catch (error: any) {
      alert(`Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.sectionContainer}>
      <h2>Crear Partido</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Jornada:</label>
          <input
            type="number"
            value={jornada}
            onChange={(e) => setJornada(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Equipo Local:</label>
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Equipo Visitante:</label>
          <input
            type="text"
            value={visitante}
            onChange={(e) => setVisitante(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando...' : 'Crear Partido'}
        </button>
      </form>
    </div>
  );
}