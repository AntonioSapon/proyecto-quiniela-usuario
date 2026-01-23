"use client";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/store';
import { saveCampeonGoleadorRealThunk } from "@/features/resultados/resultadoSlice";
import {  } from '@/features/resultados/resultadoSlice';
import styles from './admin.module.css';

export default function IngresarCampeonGoleador() {
  const dispatch = useAppDispatch();
  
  const [campeonReal, setCampeon] = useState('');
  const [goleadorReal, setGoleador] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campeonReal || !goleadorReal) {
      alert('Por favor, complete todos los campos');
      return;
    }
    dispatch(saveCampeonGoleadorRealThunk({ campeonReal, goleadorReal }))
      .unwrap()
      .then(() => {
        alert('¡Campeón y Goleador Real guardados correctamente!');
        setCampeon('');
        setGoleador('');
      })
      .catch((error: any) => {
        console.error('Error al guardar Campeón y Goleador Real:', error);
        alert(error.message || 'Error al guardar Campeón y Goleador Real');
      });
  }
  

  return (
    <div className={styles.sectionContainer}>
      <h2>Ingresar Campeón y Goleador Real</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Campeón:</label>
          <input
            type="text"
            value={campeonReal}
            onChange={(e) => setCampeon(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Goleador:</label>
          <input
            type="text"
            value={goleadorReal}
            onChange={(e) => setGoleador(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Guardar
        </button>
      </form>
    </div>
  );
}