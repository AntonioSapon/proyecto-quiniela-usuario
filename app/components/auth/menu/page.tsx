"use client";
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/store';
import { fetchParticipantesThunk } from '@/features/participantes/participanteSlice';
import { fetchPartidosThunk } from '@/features/partidos/partidoSlice';
import CrearParticipante from '../components/CrearParticipante';
import CrearPartido from '../components/CrearPartido';
import ActualizarResultado from '../components/ActualizarResultado';
import PronosticoPartido from '../components/CrearPronosticoPartido';
import PronosticoCampeonGoleador from '../components/CrearPronosticoCampeon';
import IngresarCampeonGoleador from '../components/IngresarCampeonGoleador';
import styles from "../components/admin.module.css";
import { useRouter } from 'next/navigation';
import { checkSessionThunk } from '@/features/auth/authSlice'; // Importa la verificación de sesión
import ResetButton from '../components/ResetButton';


export default function AdminPage() {
  const dispatch = useAppDispatch();
  
  const router = useRouter();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Verificar sesión al cargar la página
    dispatch(checkSessionThunk());
  }, [dispatch]);

  useEffect(() => {
    // Cargar datos solo si hay usuario autenticado
    dispatch(fetchParticipantesThunk());
      dispatch(fetchPartidosThunk());
  }, [dispatch, user]);

  useEffect(() => {
    // Redirigir a login si no hay usuario autenticado
    if (!loading && !user) {
      router.push('/components/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h2 className="mb-0">
                <i className={`bi bi-tools me-2`}>  </i>
                 Panel de Administración
      </h2><br />
      
      <div className={styles.sectionsContainer}>
        <div className={styles.column}>
          <CrearParticipante />
          <CrearPartido />
          <ActualizarResultado />
        </div>
        
        <div className={styles.column}>
          <PronosticoPartido />
          <PronosticoCampeonGoleador />
          <IngresarCampeonGoleador />
          <ResetButton />
        </div>

      </div>
    </div>
  );
}