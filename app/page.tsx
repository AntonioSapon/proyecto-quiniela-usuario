"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/store";
import { fetchPartidosThunk } from "@/features/partidos/partidoSlice";
import { fetchParticipantesThunk } from "@/features/participantes/participanteSlice";
import Participantes from "./components/Participantes/participantes";


export default function Home() {
  const dispatch = useAppDispatch();
  
  // Obtener datos del estado
  const { partidos } = useAppSelector((state) => state.partidos);
  const { participantes } = useAppSelector((state) => state.participantes);

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(fetchPartidosThunk());
    dispatch(fetchParticipantesThunk());
  }, [dispatch]);

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10 col-xl-8"> {/* Ancho controlado pero centrado */}
        <div className="card border-0 shadow-lg">
          
          <div className="card-header bg-primary text-white text-center py-3">
          </div>
          <div className="card-body">
            <Participantes participantes={participantes} />
          </div>
          <br />
        </div>
      </div>
    </div>
  );
}