"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/store";
import { fetchPartidosThunk } from "@/features/partidos/partidoSlice";
import Partidos from "./partidos";
import styles from "./partidos.module.css";

export default function PartidosPage() {
  const dispatch = useAppDispatch();
  const { partidos } = useAppSelector((state) => state.partidos);

  useEffect(() => {
    dispatch(fetchPartidosThunk());
  }, [dispatch]);

  return (
    <section className={styles.partidosPage}>
      <div className={styles.content}>

        {/* HEADER ESTILO INICIO */}
        <div className={styles.sectionHeader}>
          <h2 className="mb-0 text-white fw-bold">
            <i className="bi bi-calendar-check"></i>
            ㅤPARTIDOS
          </h2>
        </div>

        {/* CONTENEDOR GRIS */}
        <div className={styles.tableContainer}>
          <Partidos partidos={partidos} />
        </div>

      </div>
    </section>
  );
}
