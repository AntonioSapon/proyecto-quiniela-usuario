import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/store';
import { fetchPronosticoPartidosThunk } from '@/features/participantes/participanteSlice';
import styles from './predicciones.module.css';

const Predicciones = () => {
  const dispatch = useAppDispatch();
  const { participantes, loading } = useAppSelector((state) => state.participantes);
  const [participanteSeleccionado, setParticipanteSeleccionado] = useState<string>('');
  const [pronosticosPartidos, setPronosticosPartidos] = useState<any[]>([]);
  const [loadingPronosticos, setLoadingPronosticos] = useState<boolean>(false);
  
  // Encontrar el participante seleccionado para obtener campeonPredicho y goleadorPredicho
  const participante = participantes.find(p => p._id === participanteSeleccionado);

  // Cargar pronósticos cuando se selecciona un participante
  useEffect(() => {
    if (participanteSeleccionado) {
      setLoadingPronosticos(true);
      dispatch(fetchPronosticoPartidosThunk({ _id: participanteSeleccionado }))
        .unwrap()
        .then((data) => {
          setPronosticosPartidos(data);
          setLoadingPronosticos(false);
        })
        .catch(() => {
          setLoadingPronosticos(false);
        });
    } else {
      setPronosticosPartidos([]);
    }
  }, [participanteSeleccionado, dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>
            <i className="bi bi-graph-up-arrow me-3"> </i>
             ㅤPredicciones
          </h2>
        </div>
        
        <div className={styles.cardBody}>
          {/* Dropdown de participantes */}
          <div className={styles.formGroup}>
            <label htmlFor="participanteSelect" className={styles.label}>
              Seleccionar Participante:
            </label>
            <select 
              id="participanteSelect"
              className={styles.select}
              value={participanteSeleccionado}
              onChange={(e) => setParticipanteSeleccionado(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Selecciona un participante --</option>
              {participantes.map(p => (
                <option key={p._id} value={p._id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          {/* Mostrar estado de carga */}
          {loading && <div className={styles.loading}>Cargando participantes...</div>}
          
          {/* Si se ha seleccionado un participante, mostrar sus predicciones */}
          {participanteSeleccionado && participante && (
            <div className={styles.prediccionesContainer}>
              {/* Sección de campeón y goleador */}
              <div className={styles.prediccionesEspeciales}>
                <h3 className={styles.subtitle}>
                  <i className="bi bi-trophy me-2"></i>
                  ㅤPredicciones Especiales
                </h3>
                <div className={styles.prediccionItem}>
                  <span className={styles.prediccionLabel}>Campeón Predicho:</span>
                  <span className={styles.prediccionValue}>
                    {participante.campeonPredicho || 'No especificado'}
                  </span>
                </div>
                <div className={styles.prediccionItem}>
                  <span className={styles.prediccionLabel}>Goleador Predicho:</span>
                  <span className={styles.prediccionValue}>
                    {participante.goleadorPredicho || 'No especificado'}
                  </span>
                </div>
              </div>
              
              {/* Sección de pronósticos de partidos */}
              <div className={styles.pronosticosPartidos}>
                <h3 className={styles.subtitle}>
                  <i className="bi bi-calendar-event me-2"></i>
                  ㅤPronósticos de Partidos
                </h3>
                
                {loadingPronosticos ? (
                  <div className={styles.loading}>Cargando pronósticos...</div>
                ) : pronosticosPartidos.length === 0 ? (
                  <div className={styles.empty}>
                    <i className="bi bi-exclamation-circle"></i>
                    <p>No hay pronósticos de partidos registrados</p>
                  </div>
                ) : (
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Jornada</th>
                          <th>Partido</th>
                          <th>Predicción</th>
                          <th>Resultado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pronosticosPartidos.map((pronostico) => (
                          <tr key={pronostico._id}>
                            <td>{pronostico.partido?.jornada}</td>
                            <td>
                              {pronostico.partido?.local}ㅤvsㅤ{pronostico.partido?.visitante}
                            </td>
                            <td className={styles.prediction}>{pronostico.prediccion}</td>
                            <td className={styles.result}>
                                {pronostico.partido?.resultado || 'Por jugar'} 
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predicciones;