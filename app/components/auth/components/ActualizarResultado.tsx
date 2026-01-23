"use client";
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/Redux/store';
import { updateResultadoPartidoThunk, fetchPartidosThunk } from '@/features/partidos/partidoSlice';
import styles from './admin.module.css';

export default function ActualizarResultado() {
  const dispatch = useAppDispatch();
  const { partidos, loading: loadingPartidos } = useAppSelector(state => state.partidos);
  const [partidoId, setPartidoId] = useState('');
  const [resultado, setResultado] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Recargar partidos al montar el componente
  useEffect(() => {
    dispatch(fetchPartidosThunk());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!partidoId || !resultado) {
      setError('Seleccione un partido y ingrese un resultado');
      return;
    }
    
    if (!/^\d+-\d+$/.test(resultado)) {
      setError('Formato de resultado inválido. Use el formato: 2-1');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await dispatch(updateResultadoPartidoThunk({ 
        id: partidoId, 
        resultado 
      }));
      
      if (updateResultadoPartidoThunk.fulfilled.match(result)) {
        setSuccess(true);
        setResultado('');
        setPartidoId('');
        
        // Recargar partidos después de actualizar
        dispatch(fetchPartidosThunk());
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => setSuccess(false), 3000);
        alert('Resultado actualizado correctamente!');
      } else {
        throw new Error(result.error?.message || 'Error al actualizar resultado');
      }
    } catch (error: any) {
      let errorMessage = 'Error desconocido al actualizar';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.payload) {
        errorMessage = error.payload;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar partidos que no están finalizados
  const partidosDisponibles = partidos.filter(partido => 
    partido.status !== 'finalizado' && partido.status !== 'cancelado'
  );

  return (
    <div className={styles.sectionContainer}>
      <h2>Actualizar Resultado</h2>
      
      {error && (
        <div className={styles.errorAlert}>
          {error}
        </div>
      )}
      
      {success && (
        <div className={styles.successAlert}>
          ¡Resultado actualizado correctamente!
          
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Partido:</label>
          <select
            value={partidoId}
            onChange={(e) => setPartidoId(e.target.value)}
            required
            disabled={isSubmitting || loadingPartidos}
          >
            <option value="">Seleccione un partido</option>
            {partidosDisponibles.map(partido => (
              <option key={partido._id} value={partido._id}>
                {partido.local} vs {partido.visitante} - Jornada {partido.jornada}
              </option>
            ))}
          </select>
          {loadingPartidos && <small>Cargando partidos...</small>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Resultado (ej: 2-1):</label>
          <input
            type="text"
            value={resultado}
            onChange={(e) => setResultado(e.target.value)}
            required
            pattern="\d+-\d+"
            title="Formato: número-número (ej: 2-1)"
            disabled={isSubmitting}
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting || loadingPartidos}
        >
          {isSubmitting ? 'Actualizando...' : 'Actualizar'}
        </button>
      </form>
    </div>
  );
}