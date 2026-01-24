"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/store";
import { fetchPartidosThunk } from "@/features/partidos/partidoSlice";
import { fetchParticipantesThunk } from "@/features/participantes/participanteSlice";
import Participantes from "./components/Participantes/participantes";
import styles from "./page.module.css";

export default function Home() {
  const dispatch = useAppDispatch();

  const { participantes } = useAppSelector((state) => state.participantes);

  useEffect(() => {
    dispatch(fetchPartidosThunk());
    dispatch(fetchParticipantesThunk());
  }, [dispatch]);

  return (
    <main className={styles.home}>
      <section className={styles.content}>
        <Participantes participantes={participantes} />
      </section>
    </main>
  );
}
