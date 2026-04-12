import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/store';
import { fetchPronosticoPartidosThunk } from '@/features/participantes/participanteSlice';
import styles from './predicciones.module.css';

/* ================= LOADING OVERLAY ================= */
import LoadingOverlay from '@/app/components/LoadingOverlay/LoadingOverlay';

const Predicciones = () => {
  const dispatch = useAppDispatch();
  const { participantes, loading } = useAppSelector((state) => state.participantes);

  const [participanteSeleccionado, setParticipanteSeleccionado] = useState<string>('');
  const [pronosticosPartidos, setPronosticosPartidos] = useState<any[]>([]);
  const [loadingPronosticos, setLoadingPronosticos] = useState<boolean>(false);

  /* ================= NORMALIZACIÓN ================= */
  const normalizeCountry = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

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

  // Participante seleccionado
  const participante = participantes.find(
    p => p._id === participanteSeleccionado
  );

  // Cargar pronósticos al cambiar participante
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
    <>
      {/* ===================================================== */}
      {/* ===== LOADING OVERLAY GLOBAL ======================== */}
      {/* Se muestra al cargar participantes o pronósticos     */}
      {/* ===================================================== */}
      {(loading || loadingPronosticos) && (
        <LoadingOverlay text="Cargando..." />
      )}

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardBody}>

            {/* SELECT PARTICIPANTE */}
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
                  <option key={p._id} value={p._id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* ===== CONTENIDO PRINCIPAL ===== */}
            {participanteSeleccionado && participante && (
              <div className={styles.prediccionesContainer}>

                {/* ================= PREDICCIONES ESPECIALES ================= */}
                <div className={styles.prediccionesEspeciales}>
                  <h3 className={styles.subtitle}>
                    <i className="bi bi-trophy me-2"></i>
                    ㅤPredicciones Especiales
                  </h3>

                  <div className={styles.prediccionItem}>
                    <span className={styles.prediccionLabel}>
                      Campeón Predicho:
                    </span>
                    <span className={styles.prediccionValue}>
                      {participante.campeonPredicho || 'No especificado'}
                    </span>
                  </div>

                  <div className={styles.prediccionItem}>
                    <span className={styles.prediccionLabel}>
                      Goleador Predicho:
                    </span>
                    <span className={styles.prediccionValue}>
                      {participante.goleadorPredicho || 'No especificado'}
                    </span>
                  </div>
                </div>

                {/* ================= PRONÓSTICOS ================= */}
                <div className={styles.pronosticosPartidos}>
                  <h3 className={styles.subtitle}>
                    <i className="bi bi-calendar-event me-2"></i>
                    ㅤPronósticos de Partidos
                  </h3>

                  {/* ===== SIN PRONÓSTICOS ===== */}
                  {pronosticosPartidos.length === 0 ? (
                    <div className={styles.empty}>
                      <p>
                        <i className="bi bi-exclamation-circle"></i>
                        ㅤNo hay pronósticos de partidos registrados
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* ================= DESKTOP TABLE ================= */}
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
                                  <div className={styles.desktopTeams}>
                                    
                                    {/* LOCAL: nombre + bandera */}
                                    <span className={`${styles.team} ${styles.teamLocal}`}>
                                      <span>{pronostico.partido?.local}</span>
                                      {getFlagUrl(pronostico.partido?.local) && (
                                        <img
                                          src={getFlagUrl(pronostico.partido?.local)!}
                                          className={styles.flag}
                                        />
                                      )}
                                    </span>

                                    <span className={styles.vs}>vs</span>

                                    {/* VISITANTE: bandera + nombre */}
                                    <span className={`${styles.team} ${styles.teamVisitante}`}>
                                      {getFlagUrl(pronostico.partido?.visitante) && (
                                        <img
                                          src={getFlagUrl(pronostico.partido?.visitante)!}
                                          className={styles.flag}
                                        />
                                      )}
                                      <span>{pronostico.partido?.visitante}</span>
                                    </span>

                                  </div>
                                </td>

                                <td className={styles.prediction}>
                                  {pronostico.prediccion}
                                </td>
                                <td className={styles.result}>
                                  {pronostico.partido?.resultado || 'Por jugar'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* ================= MOBILE CARDS ================= */}
                      <div className={styles.mobileOnly}>
                        <div className={styles.mobileList}>
                          {pronosticosPartidos.map((pronostico) => (
                            <div
                              key={pronostico._id}
                              className={styles.mobileCard}
                            >
                              {/* FILA SUPERIOR */}
                              <div className={styles.mobileRowTop}>
                                <span className={styles.mobileJornada}>
                                  J{pronostico.partido?.jornada}
                                </span>
                              
                                <span className={styles.mobileTeams}>
                                  {pronostico.partido?.local}
                                  <strong>ㅤVSㅤ</strong>
                                  {pronostico.partido?.visitante}
                                </span>
                              </div>

                              {/* FILA INFERIOR */}
                              <div className={styles.mobileRowBottom}>
                                <span className={styles.mobilePred}>
                                  Pred: {pronostico.prediccion}
                                </span>

                                <span className={styles.mobileResult}>
                                  {pronostico.partido?.resultado || 'Por jugar'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Predicciones;
