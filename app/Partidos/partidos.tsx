import { useState, useEffect } from 'react';
import styles from './partidos.module.css';

type Partido = {
    id: string;
    jornada: number;
    local: string;
    visitante: string;
    fecha: string;
    resultado: string | null;
    status: 'pendiente' | 'jugando' | 'finalizado' | 'cancelado';
};

type PartidosProps = {
    partidos: Partido[];
    isAdmin?: boolean;
};

export default function Partidos({ partidos, isAdmin = false }: PartidosProps) {
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<number | 'todas'>('todas');
  const [jornadasDisponibles, setJornadasDisponibles] = useState<number[]>([]);
  
  // Obtener jornadas únicas al cargar los partidos
  useEffect(() => {
    if (partidos && partidos.length > 0) {
      const jornadas = [...new Set(partidos.map(p => p.jornada))].sort((a, b) => a - b);
      setJornadasDisponibles(jornadas);
      
      
    }
  }, [partidos]);

  const partidosFiltrados = jornadaSeleccionada === 'todas' 
    ? partidos 
    : partidos.filter(p => p.jornada === jornadaSeleccionada);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'jugando': return styles.playing;
      case 'finalizado': return styles.finished;
      case 'cancelado': return styles.cancelled;
      default: return styles.pending;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'jugando': return <i className="bi bi-play-circle-fill"></i>;
      case 'finalizado': return <i className="bi bi-check-circle-fill"></i>;
      case 'cancelado': return <i className="bi bi-x-circle-fill"></i>;
      default: return <i className="bi bi-clock"></i>;
    }
  };

  if (!partidos || partidos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <i className="bi bi-calendar-x"></i>
        <h3>No hay partidos programados</h3>
        <p>Actualmente no hay partidos disponibles para mostrar</p>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      {/* Selector de jornada */}
      <div className={styles.jornadaSelector}>
        <label htmlFor="jornadaSelect" className={styles.jornadaLabel}>
          Seleccionar Jornada:
        </label>
        <select 
          id="jornadaSelect"
          className={styles.jornadaSelect}
          value={jornadaSeleccionada}
          onChange={(e) => setJornadaSeleccionada(
            e.target.value === 'todas' ? 'todas' : parseInt(e.target.value)
          )}
        >
          <option value="todas">Todas las jornadas</option>
          {jornadasDisponibles.map(jornada => (
            <option key={jornada} value={jornada}>
              Jornada {jornada}
            </option>
          ))}
        </select>
      </div><br />

      

      {/* Lista de partidos */}
      <div className={styles.partidosGrid}>
        {partidosFiltrados.map((partido) => (
          <div key={isAdmin ? partido.id : `${partido.jornada}-${partido.local}-${partido.visitante}`} 
               className={styles.partidoCard}>
            
            <div className={styles.partidoHeader}>
              <span className={styles.jornadaBadge}>
                Jornada {partido.jornada}
              </span>
              <span className={`${styles.statusBadge} ${getStatusColor(partido.status)}`}>
                {getStatusIcon(partido.status)} {partido.status}
              </span>
            </div>
            
            <div className={styles.equiposContainer}>
              <div className={styles.equiposContainer}>
              <div className={styles.teamName}>{partido.local}</div>
              <span className={styles.vs}>ㅤvsㅤ</span>
              <div className={styles.teamName}>{partido.visitante}</div>
              </div>
 
            </div>

              {partido.resultado && (
                  <span className={styles.resultado}>
                    {partido.resultado}
                  </span>
                )}

          </div>
        ))}
      </div>
    </div>
  );
}