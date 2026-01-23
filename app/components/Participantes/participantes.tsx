import styles from './participantes.module.css';

type Participante = {
  _id: string;
  nombre: string;
  puntosTotales: number;
  PartidosAcertados: number;
  PartidosGanador: number;
  PartidosNoAcertados: number;
  puntosExtras?: number;
};

type ParticipantesProps = {
  participantes: Participante[];
};

export default function Participantes({ participantes }: ParticipantesProps) {
  const participantesOrdenados = [...participantes].sort((a, b) => 
  (b.puntosTotales || 0) - (a.puntosTotales || 0) || 
  (b.PartidosAcertados || 0) - (a.PartidosAcertados || 0)
);

  if (!participantesOrdenados?.length) {
    return (
      <div className={styles.emptyState}>
        <i className="bi bi-calendar-x"></i>
        <h3>No hay participantes aún</h3>
        <p>Pide que te registren para aparecer en la clasificación</p>
      </div>
    );
  }

  return (
    
    <div className="d-flex justify-content-center"> 
      <div className={` ${styles.cardHeader}`}>
        <br />
        <h2 className="mb-0 text-white fw-bold"> 
          <i className="bi bi-trophy me-3 text-warning "> </i>
           Clasificación General  
        </h2>
        
        
        
      </div>
      
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className={`table align-middle mb-0 ${styles.table}`}>
            <thead>
              <tr>
                <th className="text-light" style={{ width: '60px', paddingLeft: '25px' }}>#</th>
                <th className="text-light">Participante</th>
                <th className="text-center text-light" style={{ width: '120px' }}>Puntos</th>
                <th className="text-center text-light" style={{ width: '140px' }} title="Aciertos Exactos">
                  <i className="bi bi-check-circle fs-5 text-success me-1"></i>
                  <span className="d-none d-md-inline">  Exactos</span>
                </th>
                <th className="text-center text-light" style={{ width: '140px' }} title="Ganador/Empate">
                  <i className="bi bi-flag fs-5 text-warning me-1"></i>
                  <span className="d-none d-md-inline">  Ganador</span>
                </th>
                <th className="text-center text-light" style={{ width: '140px' }} title="No Acertados">
                  <i className="bi bi-x-circle fs-5 text-danger me-1"></i>
                  <span className="d-none d-md-inline">  Fallados</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {participantesOrdenados.map((p, index) => (
                <tr 
                  key={`${p._id}-${index}`} 
                  className={`${index === 0 ? styles.firstPlace : index === 1 ? styles.secondPlace : index === 2 ? styles.thirdPlace : ''} ${styles.tableRow}`}
                >
                  <td className="fw-bold" style={{ paddingLeft: '25px' }}>
                    <span className={`badge rounded-circle ${
                      index === 0 ? styles.bgGold : 
                      index === 1 ? styles.bgSilver : 
                      index === 2 ? styles.bgBronze : 'bg-secondary'
                    } ${styles.positionBadge}`}>
                      {index + 1}
                    </span>
                  </td>
                  
                  <td>
                    <div className="d-flex align-items-center">
                      
                      <div>
                        <div className="fw-semibold text-light">{p.nombre}</div>
                        <small className="text-muted">Puntos extras: {p.puntosExtras || 0}</small>
                      </div>
                    </div>
                  </td>
                  
                  <td className="text-center">
                    <span className={`fw-bold ${styles.pointsBadge}`}>
                      {p.puntosTotales}
                    </span>
                  </td>
                  
                  <td className="text-center">
                    <span className={`badge ${styles.exactBadge}`}>
                      {p.PartidosAcertados}
                    </span>
                  </td>
                  
                  <td className="text-center">
                    <span className={`badge ${styles.winnerBadge}`}>
                      {p.PartidosGanador}
                    </span>
                  </td>
                  
                  <td className="text-center">
                    <span className={`badge ${styles.missedBadge}`}>
                      {p.PartidosNoAcertados}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={`card-footer ${styles.cardFooter}`}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-2 mb-md-0">
            <small className="text-light">
              <i className="bi bi-info-circle me-2 text-warning"></i>
              <span className="d-block d-md-inline"> Aciertos exactos: <span className="fw-bold">5 pts </span></span> 
              <span className="d-none d-md-inline mx-2">|</span> 
              <span className="d-block d-md-inline"> Ganador/Empate: <span className="fw-bold">3 pts</span></span>
            </small>
          </div>
          <div>
            {/*  // No necesario por el momento
            <small className="text-light">
              <i className="bi bi-clock-history me-1 text-info"></i>
              Actualizado: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </small>
              */}
          </div>
        </div>
      </div>
    </div>
  );
}