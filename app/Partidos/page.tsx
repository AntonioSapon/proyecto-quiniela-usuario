// app/partidos/page.tsx
"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/store";
import { fetchPartidosThunk } from "@/features/partidos/partidoSlice";
import Partidos from "./partidos";
import styles from './partidos.module.css';

export default function PartidosPage() {
  const dispatch = useAppDispatch();
  const { partidos } = useAppSelector((state) => state.partidos);

  // Cargar datos al montar el componente
  useEffect(() => {
    dispatch(fetchPartidosThunk());
  }, [dispatch]);

  return (
    <div className="container py-4">
      <div className="row ">
        <div className="col-lg-10 col-xl-8">
          <div className="card border-0 shadow-lg">
            <div className={`card-header bg-primary text-white text-center py-3  ${styles.NameTitle}`}>
              <h2 className="mb-0">
                <i className={`bi bi-calendar-check me-2`}> </i>
                ㅤLista de Partidos
              </h2><br />
            </div>
            <div className="card-body" >
              <Partidos partidos={partidos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}