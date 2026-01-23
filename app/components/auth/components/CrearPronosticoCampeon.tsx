"use client";
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/Redux/store';
import { createPronosticoCampeonGoleadorThunk } from '@/features/pronosticos/pronosticoSlice';
import styles from './admin.module.css';
import CrearParticipante from '../components/CrearParticipante';
import { fetchParticipantesThunk } from '@/features/participantes/participanteSlice';

export default function PronosticoCampeonGoleador() {
  const dispatch = useAppDispatch();
  const { participantes } = useAppSelector((state) => state.participantes);
  const [participanteId, setParticipanteId] = useState('');
  const [campeonPredicho, setCampeon] = useState('');
  const [goleadorPredicho, setGoleador] = useState('');


  // Recargar partidos al montar el componente
    useEffect(() => {
      dispatch(fetchParticipantesThunk());
    }, [dispatch]);
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participanteId) return;
    dispatch(createPronosticoCampeonGoleadorThunk({ participanteId, campeonPredicho, goleadorPredicho }));
    setCampeon('');
    setGoleador('');
    alert('¡Pronóstico de Campeón y Goleador creado correctamente!');
  };

  return (
    <div className={styles.sectionContainer}>
      <h2>Pronóstico Campeón y Goleador</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Participante:</label>
          <select
            value={participanteId}
            onChange={(e) => setParticipanteId(e.target.value)}
            required
          >
            <option value="">Seleccione un participante</option>
            {participantes.map(participante => (
              <option key={participante._id} value={participante._id}>
                {participante.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Campeón:</label>
          <input
            type="text"
            value={campeonPredicho}
            onChange={(e) => setCampeon(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Goleador:</label>
          <input
            type="text"
            value={goleadorPredicho}
            onChange={(e) => setGoleador(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Guardar</button>
      </form>
    </div>
  );
}