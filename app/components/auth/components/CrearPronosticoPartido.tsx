"use client";
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/Redux/store';
import { createPronosticoPartidoThunk } from '@/features/pronosticos/pronosticoSlice';
import styles from './admin.module.css';
import { fetchParticipantesThunk } from '@/features/participantes/participanteSlice';

export default function PronosticoPartido() {
  const dispatch = useAppDispatch();
  const participantes = useAppSelector(state => state.participantes.participantes);
  const partidos = useAppSelector(state => state.partidos.partidos);
  const [participanteId, setParticipanteId] = useState('');
  const [partidoId, setPartidoId] = useState('');
  const [pronostico, setPronostico] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');


  // Cargar participantes al montar el componente
  useEffect(() => {
    dispatch(fetchParticipantesThunk());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!participanteId || !partidoId || !pronostico) {
      setError('Complete todos los campos');
      return;
    }
    
    if (!/^\d+-\d+$/.test(pronostico)) {
      setError('Formato de pronóstico inválido. Use: número-número (ej: 2-1)');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await dispatch(createPronosticoPartidoThunk({ 
        participanteId, 
        partidoId, 
        pronostico 
      })).unwrap();
      
      alert('¡Pronóstico creado correctamente!');
      setPronostico('');
      setParticipanteId('');
      setPartidoId('');
    } catch (error: any) {
      console.error('Error creando pronóstico:', error);
      setError(error.message || 'Error al crear pronóstico');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.sectionContainer}>
      <h2>Crear Pronóstico de Partido</h2>
      
      {error && (
        <div className={styles.errorAlert}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Participante:</label>
          <select
            value={participanteId}
            onChange={(e) => setParticipanteId(e.target.value)}
            required
            disabled={isSubmitting}
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
          <label>Partido:</label>
          <select
            value={partidoId}
            onChange={(e) => setPartidoId(e.target.value)}
            required
            disabled={isSubmitting}
          >
            <option value="">Seleccione un partido</option>
            {partidos
              .filter(partido => partido.status === 'pendiente') // Solo partidos pendientes
              .map(partido => (
                <option key={partido._id} value={partido._id}>
                  {partido.local} vs {partido.visitante} - Jornada {partido.jornada}
                </option>
              ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Pronóstico (ej: 2-1):</label>
          <input
            type="text"
            value={pronostico}
            onChange={(e) => setPronostico(e.target.value)}
            required
            pattern="\d+-\d+"
            title="Formato: número-número (ej: 2-1)"
            disabled={isSubmitting}
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}