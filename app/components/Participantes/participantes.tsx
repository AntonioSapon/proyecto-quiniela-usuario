import { useState } from 'react';
import { useAppSelector } from '@/Redux/store'; // 👈 NUEVO
import LoadingOverlay from '@/app/components/LoadingOverlay/LoadingOverlay'; // 👈 NUEVO
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
  const [openId, setOpenId] = useState<string | null>(null);

  // 🔥 Estado de carga desde Redux
  const { loading } = useAppSelector((state) => state.participantes);

  const participantesOrdenados = [...participantes].sort(
    (a, b) =>
      (b.puntosTotales || 0) - (a.puntosTotales || 0) ||
      (b.PartidosAcertados || 0) - (a.PartidosAcertados || 0)
  );

  // Estado vacío (cuando ya terminó de cargar y no hay datos)
  if (!loading && !participantesOrdenados.length) {
    return (
      <div className={styles.emptyState}>
        <i className="bi bi-calendar-x"></i>
        <h3>No hay participantes aún</h3>
        <p>Pide que te registren para aparecer en la clasificación</p>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center position-relative">
      
      {/* 🔥 LOADING OVERLAY */}
      {loading && (
        <LoadingOverlay text="Cargando clasificación..." />
      )}

      <div className={styles.cardHeader}>
        <h2 className="mb-0 text-white fw-bold">
          <i className="bi bi-trophy-fill me-3 text-warning"></i>
          ㅤClasificación General
        </h2>
      </div>

      <div className={styles.tableWrapper}>
        <div className="table-responsive">
          <table className={`table align-middle mb-0 ${styles.table}`}>
            <thead>
              <tr>
                <th>#</th>
                <th>Participante</th>
                <th>Puntos</th>
                <th><i className="bi bi-check-circle-fill"></i> Exactos</th>
                <th><i className="bi bi-flag-fill"></i> Ganador</th>
                <th><i className="bi bi-x-circle-fill"></i> Fallados</th>
              </tr>
            </thead>
            <tbody>
              {participantesOrdenados.map((p, index) => (
                <tr
                  key={p._id}
                  className={`${styles.tableRow} ${
                    openId === p._id ? styles.rowOpen : ''
                  } ${
                    index === 0
                      ? styles.firstPlace
                      : index === 1
                      ? styles.secondPlace
                      : index === 2
                      ? styles.thirdPlace
                      : ''
                  }`}
                  onClick={() =>
                    setOpenId(openId === p._id ? null : p._id)
                  }
                >
                  {/* POSICIÓN */}
                  <td>
                    <span className={styles.positionBadge}>{index + 1}</span>
                  </td>

                  {/* PARTICIPANTE */}
                  <td>
                    <div className={styles.participantName}>
                      <strong>{p.nombre}</strong>
                      <small>Puntos extra: {p.puntosExtras || 0}</small>
                    </div>

                    {/* ===== DETALLES SOLO MÓVIL ===== */}
                    <div className={styles.mobileDetails}>
                      <div><i className="bi bi-check-circle-fill"></i> ㅤExactos: {p.PartidosAcertados}</div>
                      <div><i className="bi bi-flag-fill"></i> ㅤGanador: {p.PartidosGanador}</div>
                      <div><i className="bi bi-x-circle-fill"></i> ㅤFallados: {p.PartidosNoAcertados}</div>
                    </div>
                  </td>

                  {/* PUNTOS */}
                  <td>
                    <span className={styles.pointsBadge}>{p.puntosTotales}</span>
                  </td>

                  {/* EXACTOS */}
                  <td>
                    <span className={styles.exactBadge}>
                      {p.PartidosAcertados}
                    </span>
                  </td>

                  {/* GANADOR */}
                  <td>
                    <span className={styles.winnerBadge}>
                      {p.PartidosGanador}
                    </span>
                  </td>

                  {/* FALLADOS */}
                  <td>
                    <span className={styles.missedBadge}>
                      {p.PartidosNoAcertados}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <small>
          Exactos: <strong>5 pts</strong> | Ganador/Empate:{' '}
          <strong>3 pts</strong>
        </small>
      </div>
    </div>
  );
}
