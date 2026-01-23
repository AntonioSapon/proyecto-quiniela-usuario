"use client";
import { useState } from 'react';
import { useAppDispatch } from '@/Redux/store';
import { createParticipanteThunk } from '@/features/participantes/participanteSlice';
import styles from './admin.module.css';

export default function CrearParticipante() {
  const dispatch = useAppDispatch();
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();    
    setLoading(true);
    try {
      dispatch(createParticipanteThunk(nombre)).unwrap();
      setNombre('');
      setSuccess(true);
      alert('Participante creado exitosamente!');
      
    } catch (error) {
      console.error('Error al crear participante:', error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className={styles.sectionContainer}>
      <h2>Crear Participante</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Crear</button>
      </form>
    </div>
  );
}