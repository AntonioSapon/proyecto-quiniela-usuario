import { useAppSelector } from '@/Redux/store'; // 👈 NUEVO
import LoadingOverlay from '@/app/components/LoadingOverlay/LoadingOverlay'; // 👈 NUEVO
import styles from './partidos.module.css';
import React, { useState, useEffect } from 'react';

/* ================= NORMALIZACIÓN ================= */
const normalizeCountry = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/* ================= TIPOS ================= */
type Partido = {
  _id: string;
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

/* ================= TIPO PRONÓSTICO ================= */
type PronosticoPartido = {
  _id: string;
  participante: string;
  prediccion: string;
  puntosObtenidos: number;
  tipoAcierto: 'exacto' | 'ganador/empate' | 'none';
};

/* ================= MAPEO PAÍS → ISO ================= */
const rawCountryCodeMap: Record<string, string> = {
  // CONCACAF
  'mexico': 'mx',
  'canada': 'ca',
  'estados unidos': 'us',
  'usa': 'us',
  'costa rica': 'cr',
  'panama': 'pa',
  'jamaica': 'jm',
  'honduras': 'hn',
  'curazao': 'cw',
  'haiti': 'ht',
  'cabo verde': 'cv',

  // CONMEBOL
  'argentina': 'ar',
  'brasil': 'br',
  'uruguay': 'uy',
  'colombia': 'co',
  'chile': 'cl',
  'peru': 'pe',
  'ecuador': 'ec',
  'paraguay': 'py',
  'bolivia': 'bo',
  'venezuela': 've',

  // UEFA
  'alemania': 'de',
  'francia': 'fr',
  'espana': 'es',
  'italia': 'it',
  'inglaterra': 'gb-eng',
  'escocia': 'gb-sct',
  'gales': 'gb-wls',
  'portugal': 'pt',
  'belgica': 'be',
  'paises bajos': 'nl',
  'holanda': 'nl',
  'suiza': 'ch',
  'austria': 'at',
  'croacia': 'hr',
  'dinamarca': 'dk',
  'suecia': 'se',
  'noruega': 'no',
  'polonia': 'pl',
  'serbia': 'rs',
  'ucrania': 'ua',
  'turquia': 'tr',
  'rumania': 'ro',
  'republica checa': 'cz',
  'chequia': 'cz',
  'hungria': 'hu',
  'grecia': 'gr',
  'irlanda': 'ie',
  'eslovaquia': 'sk',
  'eslovenia': 'si',
  'finlandia': 'fi',
  'islandia': 'is',
  'R. Checa': 'cz',
  'Bosnia y H.': 'ba',


  // AFC
  'japon': 'jp',
  'corea del sur': 'kr',
  'corea': 'kr',
  'china': 'cn',
  'iran': 'ir',
  'irak': 'iq',
  'qatar': 'qa',
  'arabia saudita': 'sa',
  'australia': 'au',
  'uzbekistan': 'uz',
  'emiratos arabes unidos': 'ae',
  'oman': 'om',

  // CAF
  'marruecos': 'ma',
  'senegal': 'sn',
  'nigeria': 'ng',
  'camerun': 'cm',
  'ghana': 'gh',
  'tunez': 'tn',
  'egipto': 'eg',
  'argelia': 'dz',
  'costa de marfil': 'ci',
  'mali': 'ml',
  'sudafrica': 'za',
  'jordania': 'jo',
  'RD Congo': 'cd',

  // OFC
  'nueva zelanda': 'nz',
};

/* Normalizamos TODAS las keys del mapa */
const countryCodeMap: Record<string, string> = {};
Object.entries(rawCountryCodeMap).forEach(([key, value]) => {
  countryCodeMap[normalizeCountry(key)] = value;
});

const getFlagUrl = (country: string) => {
  const key = normalizeCountry(country);
  const code = countryCodeMap[key];
  return code ? `https://flagcdn.com/w40/${code}.png` : null;
};



/* ================= COMPONENTE ================= */
export default function Partidos({ partidos }: PartidosProps) {

  // 🔥 Estado de carga desde Redux
  const { loading } = useAppSelector((state) => state.partidos);

  const [jornadaSeleccionada, setJornadaSeleccionada] =
    useState<number | 'todas'>(3); // Por defecto, mostrar la jornada 3
  const [jornadasDisponibles, setJornadasDisponibles] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  /* ================= PRONÓSTICOS ================= */

// Partido actualmente expandido
const [partidoExpandido, setPartidoExpandido] = useState<string | null>(null);

// Pronósticos del partido seleccionado
const [pronosticos, setPronosticos] = useState<PronosticoPartido[]>([]);

// Loading independiente
const [loadingPronosticos, setLoadingPronosticos] = useState(false);


  /* Detectar tamaño de pantalla */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (partidos.length > 0) {
      const jornadas = [...new Set(partidos.map(p => p.jornada))].sort(
        (a, b) => a - b
      );
      setJornadasDisponibles(jornadas);
    }
  }, [partidos]);

  const partidosFiltrados =
    jornadaSeleccionada === 'todas'
      ? partidos
      : partidos.filter(p => p.jornada === jornadaSeleccionada);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'finalizado':
        return styles.finished;
      case 'jugando':
        return styles.playing;
      case 'cancelado':
        return styles.cancelled;
      default:
        return styles.pending;
    }
  };

  /* ================= OBTENER PRONÓSTICOS ================= */
const handleMostrarPronosticos = async (partidoId: string) => {

  // Si ya está abierto lo cerramos
  if (partidoExpandido === partidoId) {
    setPartidoExpandido(null);
    setPronosticos([]);
    return;
  }

  try {
    setLoadingPronosticos(true);

    const response = await fetch(
      `https://proyecto-quiniela-backend.onrender.com/api/partidos/${partidoId}/pronosticos`
    );

    const data = await response.json();

    setPronosticos(data);
    setPartidoExpandido(partidoId);

  } catch (error) {
    console.error('Error obteniendo pronósticos:', error);
  } finally {
    setLoadingPronosticos(false);
  }
};

  // ❗ Estado vacío SOLO si ya terminó de cargar
  if (!loading && (!partidos || partidos.length === 0)) {
    return (
      <div className={styles.emptyState}>
        <h3>No hay partidos programados</h3>
      </div>
    );
  }

  return (
    
    <div className={`${styles.mainContainer} position-relative`}>

      {/* 🔥 LOADING OVERLAY */}
      {loading && (
        <LoadingOverlay text="Cargando partidos..." />
      )}

      {/* Selector de jornada */}
      <div className={styles.jornadaSelector}>
        <label>Jornada:</label>
        <select
          value={jornadaSeleccionada}
          onChange={e =>
            setJornadaSeleccionada(
              e.target.value === 'todas'
                ? 'todas'
                : Number(e.target.value)
            )
          }
        >
          <option value="todas">Todas</option>
          {jornadasDisponibles.map(j => (
            <option key={j} value={j}>
              Jornada {j}
            </option>
          ))}
        </select>
      </div>

      {/* ================= DESKTOP (TABLA) ================= */}
      {!isMobile && (
        <div
          key={jornadaSeleccionada}
          className={`${styles.tableWrapper} ${styles.fadeIn}`}
        >
          <table className={styles.partidosTable}>
            <thead>
              <tr>
                <th>Jornada</th>
                <th>Local</th>
                <th>Resultado</th>
                <th>Visitante</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {partidosFiltrados.map(partido => (
                <React.Fragment key={partido._id}>
                  <tr
                    onClick={() => handleMostrarPronosticos(partido._id)}
                    style={{ cursor: 'pointer' }}
                  >
                  <td className={styles.jornadaCol}>{partido.jornada}</td>
                  <td>
                    <div className={`${styles.teamCell} ${styles.teamLocal}`}>
                      {getFlagUrl(partido.local) && (
                        <img src={getFlagUrl(partido.local)!} className={styles.flag} />
                      )}
                      <span>{partido.local}</span>
                    </div>
                  </td>
                  <td className={styles.resultadoCol}>
                    {partido.resultado ?? '—'}
                  </td>
                  <td>
                    <div className={`${styles.teamCell} ${styles.teamVisitante}`}>
                      {getFlagUrl(partido.visitante) && (
                        <img src={getFlagUrl(partido.visitante)!} className={styles.flag} />
                      )}
                      <span>{partido.visitante}</span>
                    </div>
                  </td>
                  
                  <td>
                        <span className={`${styles.statusBadge} ${getStatusClass(partido.status)}`}>
                          {partido.status}
                        </span>
                      </td>

                      </tr>
                      
                      {partidoExpandido === partido._id && (
                        <tr>
                          <td colSpan={5}>
                            <div
                              style={{
                                background: 'rgba(37, 37, 34, 0.8)',
                                padding: '15px',
                                borderRadius: '15px',
                                width: '100%',
                                maxWidth: '1000px',
                                justifyContent: 'center',
                                margin: 'auto',
                                textAlign: 'center'
                              }}
                            >
                            <h5 style={{ 
                              borderBottom: '2px solid rgba(255, 195, 0, 0.6)', 
                              padding: '5px 0', 
                              color: 'rgba(255, 195, 0)' 
                              }}>Pronósticos</h5> 
                              <br/>

                              {loadingPronosticos ? (
                                <p>Cargando...</p>
                              ) : pronosticos.length === 0 ? (
                                <p>No hay pronósticos registrados.</p>
                              ) : (

                            //Estructura de grid para mostrar los pronósticos en 4 columnas
                                <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                      gap: '12px',
                                      marginTop: '10px'
                                    }}
                                  >
                                  {pronosticos.map((p) => {
                                                                        
const partidoFinalizado = partido.status === 'finalizado';

const borderColor =
  !partidoFinalizado
    ? 'rgba(255, 215, 0, 0.55)' // amarillo para partidos pendientes
    : p.tipoAcierto === 'exacto'
    ? 'rgba(41, 219, 107, 0.60)' // verde suave
    : p.tipoAcierto === 'none'
    ? 'rgba(220, 38, 38, 0.50)' // rojo suave
    : 'rgba(255, 215, 0, 0.50)'; // amarillo para ganador/empate

const badgeColor =
  !partidoFinalizado
    ? '#ffd700'
    : p.tipoAcierto === 'exacto'
    ? '#49be74'
    : p.tipoAcierto === 'none'
    ? '#a83838'
    : '#ffd700';

const badgeBackground =
  !partidoFinalizado
    ? 'rgba(255, 215, 0, 0.18)'
    : p.tipoAcierto === 'exacto'
    ? 'rgba(34, 197, 94, 0.12)'
    : p.tipoAcierto === 'none'
    ? 'rgba(220, 38, 38, 0.12)'
    : 'rgba(255, 215, 0, 0.18)';

                                    return (
                                      <div
                                        key={p._id}
                                        style={{
                                          display: 'grid',
                                          gridTemplateColumns: '1fr auto',
                                          alignItems: 'center',
                                          padding: '10px 14px',
                                          borderBottom: `1.5px solid ${borderColor}`,
                                          borderRadius: '20px',
                                          border: `1.5px solid ${borderColor}`,
                                          background: 'rgba(22, 22, 21, 0.6)',
                                        }}
                                      >
                                        <span
                                          style={{
                                            textAlign: 'left',
                                          }}
                                        >
                                          {p.participante}
                                        </span>

                                        <strong
                                          style={{
                                            background: badgeBackground,
                                            padding: '3px 10px',
                                            border: `1.5px solid ${borderColor}`,
                                            borderRadius: '12px',
                                            color: badgeColor
                                          }}
                                        >
                                          {p.prediccion}
                                        </strong>
                                      </div>
                                    );
                                  })}
                                </div>


                              )}
                            </div>
                          </td>
                        </tr>
                      )}

                      </React.Fragment>

              ))}
            </tbody>
            
          </table>
        </div>
      )}

      {/* ================= MÓVIL (CARDS) ================= */}
      {isMobile && (
        <div key={jornadaSeleccionada} className={`${styles.mobileList} ${styles.fadeIn}`}>
          {partidosFiltrados.map(partido => (

            <div
                key={partido._id}
                className={styles.mobileCard}
                onClick={() => handleMostrarPronosticos(partido._id)}
              >

              <div className={styles.mobileJornada}>
                Jornada {partido.jornada}
              </div>

              <div className={styles.mobileTeams}>
                <div className={styles.mobileTeam}>
                  {getFlagUrl(partido.local) && (
                    <img src={getFlagUrl(partido.local)!} className={styles.flag} />
                  )}
                  <span>{partido.local}</span>
                </div>

                <div className={styles.mobileResult}>
                  {partido.resultado ?? '—'}
                </div>

                <div className={styles.mobileTeam}>
                  {getFlagUrl(partido.visitante) && (
                    <img src={getFlagUrl(partido.visitante)!} className={styles.flag} />
                  )}
                  <span>{partido.visitante}</span>
                </div>
              </div>

              <div className={styles.mobileStatus}>
                  <span className={`${styles.statusBadge} ${getStatusClass(partido.status)}`}>
                    {partido.status}
                  </span>
                </div>


{partidoExpandido === partido._id && (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '12px'
    }}
  >
    <h5
      style={{
        borderBottom: '2px solid rgba(255, 195, 0, 0.6)',
        padding: '5px 0',
        color: 'rgba(255, 195, 0)',
        textAlign: 'center'
      }}
    >
      Pronósticos
    </h5>

    {pronosticos.map((p) => {
      const partidoFinalizado = partido.status === 'finalizado';

      const borderColor =
        !partidoFinalizado
          ? 'rgba(255, 215, 0, 0.55)'
          : p.tipoAcierto === 'exacto'
          ? 'rgba(34, 197, 94, 0.42)'
          : p.tipoAcierto === 'none'
          ? 'rgba(220, 38, 38, 0.42)'
          : 'rgba(255, 215, 0, 0.55)';

      const badgeColor =
        !partidoFinalizado
          ? '#ffd700'
          : p.tipoAcierto === 'exacto'
          ? '#4ade80'
          : p.tipoAcierto === 'none'
          ? '#f87171'
          : '#ffd700';

      const badgeBackground =
        !partidoFinalizado
          ? 'rgba(255, 215, 0, 0.18)'
          : p.tipoAcierto === 'exacto'
          ? 'rgba(34, 197, 94, 0.12)'
          : p.tipoAcierto === 'none'
          ? 'rgba(220, 38, 38, 0.12)'
          : 'rgba(255, 215, 0, 0.18)';

      return (
        <div
          key={p._id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            padding: '10px 14px',
            borderRadius: '16px',
            border: `1.5px solid ${borderColor}`,
            background: 'rgba(22, 22, 21, 0.6)'
          }}
        >
          <span
            style={{
              textAlign: 'left',
              fontSize: '14px'
            }}
          >
            {p.participante}
          </span>

          <strong
            style={{
              background: badgeBackground,
              padding: '3px 10px',
              border: `1.5px solid ${borderColor}`,
              borderRadius: '12px',
              color: badgeColor
            }}
          >
            {p.prediccion}
          </strong>
        </div>
      );
    })}
  </div>


                    )}
                  </div>
            

            
          ))}
        </div>
      )}
    </div>
  );
}
