import { useState, useEffect } from 'react';
import styles from './partidos.module.css';

/* ================= NORMALIZACIÓN ================= */
const normalizeCountry = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/* ================= TIPOS ================= */
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
  

  const [jornadaSeleccionada, setJornadaSeleccionada] =
    useState<number | 'todas'>('todas');
  const [jornadasDisponibles, setJornadasDisponibles] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);

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

  if (!partidos || partidos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No hay partidos programados</h3>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
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
                <tr key={partido.id}>
                  <td className={styles.jornadaCol}>{partido.jornada}</td>

                  <td>
                    <div className={`${styles.teamCell} ${styles.teamLocal}`}>
                      {getFlagUrl(partido.local) && (
                        <img
                          src={getFlagUrl(partido.local)!}
                          className={styles.flag}
                        />
                      )}
                      <span>{partido.local}</span>
                    </div>
                  </td>

                  <td className={styles.resultadoCol}>
                    {partido.resultado ?? '—'}
                  </td>

                  <td>
                    <div
                      className={`${styles.teamCell} ${styles.teamVisitante}`}
                    >
                      {getFlagUrl(partido.visitante) && (
                        <img
                          src={getFlagUrl(partido.visitante)!}
                          className={styles.flag}
                        />
                      )}
                      <span>{partido.visitante}</span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        partido.status
                      )}`}
                    >
                      {partido.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MÓVIL (CARDS) ================= */}
      {isMobile && (
        <div key={jornadaSeleccionada}
           className={`${styles.mobileList} ${styles.fadeIn}`}>
          {partidosFiltrados.map(partido => (
            <div key={partido.id} className={styles.mobileCard}>

              {/* Jornada */}
              <div className={styles.mobileJornada}>
                Jornada {partido.jornada}
              </div>

              <div className={styles.mobileTeams}>
                <div className={styles.mobileTeam}>
                  {getFlagUrl(partido.local) && (
                    <img
                      src={getFlagUrl(partido.local)!}
                      className={styles.flag}
                    />
                  )}
                  <span>{partido.local}</span>
                </div>

                <div className={styles.mobileResult}>
                  {partido.resultado ?? '—'}
                </div>

                <div className={styles.mobileTeam}>
                  {getFlagUrl(partido.visitante) && (
                    <img
                      src={getFlagUrl(partido.visitante)!}
                      className={styles.flag}
                    />
                  )}
                  <span>{partido.visitante}</span>
                </div>
              </div>

              <div className={styles.mobileStatus}>
                <span
                  className={`${styles.statusBadge} ${getStatusClass(
                    partido.status
                  )}`}
                >
                  {partido.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}