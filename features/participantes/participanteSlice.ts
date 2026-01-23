import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchParticipantes, createParticipante, fetchPronosticoPartidos } from './participanteAPI';

type Participante = {
  _id: string;
  nombre: string;
  puntosTotales: number;
  PartidosAcertados: number;
  PartidosGanador: number;
  PartidosNoAcertados: number;
  puntosExtras?: number;
  campeonPredicho?: string | null;
  goleadorPredicho?: string | null;

  
};

type ParticipanteState = {
    participantes: Participante[];

    pronosticosPartidos: any[]; // O define una interfaz específica

    loading: boolean;
    error: string | null;
};



const initialState: ParticipanteState = {
    participantes: [],

    pronosticosPartidos: [],

    loading: false,
    error: null
};

export const fetchParticipantesThunk = createAsyncThunk(
    'participante/fetchParticipantes',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchParticipantes();
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
        }
    }
);

export const createParticipanteThunk = createAsyncThunk(
  'participantes/create',
  async (nombre: string, { rejectWithValue }) => {
    try {
      return await createParticipante(nombre);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const fetchPronosticoPartidosThunk = createAsyncThunk(
  'participantes/id/pronosticos',
  async (data: {_id: string}, { rejectWithValue }) => {
    try{
      return await fetchPronosticoPartidos(data._id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const participanteSlice = createSlice({
    name: 'participantes',
    initialState,
    reducers: {
        addParticipante: (state, action: { payload: Participante }) => {
            state.participantes.push(action.payload);
        },
        updateParticipante: (state, action: { payload: Participante }) => {
            const index = state.participantes.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.participantes[index] = action.payload;
            }
        },
        removeParticipante: (state, action: { payload: string }) => {
            state.participantes = state.participantes.filter(p => p._id !== action.payload);
        },
        setParticipantes: (state, action: { payload: Participante[] }) => {
            state.participantes = action.payload;
        },
        resetParticipantes: (state) => {
          state.participantes = [];
          state.pronosticosPartidos = [];
          state.loading = false;
          state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
      .addCase(fetchParticipantesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipantesThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Mapea todos los campos necesarios
        state.participantes = action.payload.map((p: any) => ({
          _id: p._id,
          nombre: p.nombre,
          puntosTotales: p.puntosTotales,
          PartidosAcertados: p.PartidosAcertados || 0,
          PartidosGanador: p.PartidosGanador || 0,
          PartidosNoAcertados: p.PartidosNoAcertados || 0,
          puntosExtras: p.puntosExtras || 0,
          campeonPredicho: p.campeonPredicho || null,
          goleadorPredicho: p.goleadorPredicho || null
        }));
      })
      .addCase(fetchParticipantesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to fetch participantes:', action.payload);
      })
      .addCase(createParticipanteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParticipanteThunk.fulfilled, (state, action) => {
        const newParticipant = action.payload;
        state.participantes.push({
          _id: newParticipant._id,
          nombre: newParticipant.nombre,
          puntosTotales: 0,
          PartidosAcertados: 0,
          PartidosGanador: 0,
          PartidosNoAcertados: 0,
          puntosExtras: 0,
          campeonPredicho: null,
          goleadorPredicho: null
        });
      })


      .addCase(fetchPronosticoPartidosThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPronosticoPartidosThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.pronosticosPartidos = action.payload;
      })
      .addCase(fetchPronosticoPartidosThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to fetch pronosticos de partidos:', action.payload);
      })
    }   
});

export const {addParticipante, updateParticipante, removeParticipante, setParticipantes, resetParticipantes } = participanteSlice.actions;
export default participanteSlice.reducer;

