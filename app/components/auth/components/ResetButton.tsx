// ResetButton.tsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/Redux/store'; // Importa el hook personalizado
import { resetAllDataThunk, resetResetState } from '@/features/reset/resetSlice'; // Asegúrate de que la ruta sea correcta
import { RootState } from '@/Redux/store'; // Asegúrate de que la ruta sea correcta
import styles from './admin.module.css';

const ResetButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useAppDispatch(); // Usa el hook personalizado
  const { success, error, loading } = useSelector((state: RootState) => state.reset);
  
  // Cerrar el modal después de éxito
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setShowConfirm(false);
        dispatch(resetResetState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleReset = async () => {
    try {
      // Despacha la acción y espera a que se complete
      await dispatch(resetAllDataThunk()).unwrap();
    } catch (error) {
      console.error('Error al eliminar datos:', error);
    }
  };

  return (
    <div className={styles.resetButtonContainer}>
      <button 
        onClick={() => setShowConfirm(true)}
        className={styles.resetButton}
      >
        Eliminar Todo
      </button>

      {showConfirm && (
        <div className={styles.resetModalOverlay}>
          <div className={styles.resetModal}>
            <h2 className={styles.resetModalTitle}>Confirmar Eliminación Total</h2>
            
            <p className={styles.resetModalMessage}>
              ¿Estás absolutamente seguro de eliminar TODOS los datos? Esta acción:
              <ul>
                <li>Eliminará todos los participantes</li>
                <li>Eliminará todos los partidos</li>
                <li>Eliminará todos los pronósticos</li>
                <li><strong>No se podrá deshacer</strong></li>
              </ul>
            </p>
            
            <div className={styles.resetStatusContainer}>
              {loading && (
                <div className={`${styles.resetStatusContainer} ${styles.resetLoading}`}>
                  <div className={styles.resetSpinner}></div>
                  <span>Eliminando todos los datos...</span>
                </div>
              )}
              
              {success && (
                <div className={`${styles.resetStatusContainer} ${styles.resetSuccess}`}>
                  <span className={styles.resetStatusIcon}>✓</span>
                  Todos los datos han sido eliminados exitosamente
                </div>
              )}
              
              {error && (
                <div className={`${styles.resetStatusContainer} ${styles.resetError}`}>
                  <span className={styles.resetStatusIcon}>!</span>
                  Error: {error}
                </div>
              )}
            </div>
            
            <div className={styles.resetModalActions}>
              {!success && (
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    dispatch(resetResetState());
                  }}
                  className={styles.resetCancelButton}
                  disabled={loading}
                >
                  Cancelar
                </button>
              )}
              
              <button
                onClick={handleReset}
                className={`${styles.resetConfirmButton} ${(loading || success) ? styles.resetButtonDisabled : ''}`}
                disabled={loading || success}
              >
                {success ? '✓ Hecho' : (loading ? 'Eliminando...' : 'Sí, eliminar todo')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetButton;