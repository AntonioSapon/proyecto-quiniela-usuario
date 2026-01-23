import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createPronosticoPartido, createPronosticoCampeonGoleador } from './pronosticoAPI';

interface PronosticoPartido {
  id: string;
  participanteId: string;
  partidoId: string;
  pronostico: string;
}

interface PronosticoCampeonGoleador {
  id: string;
  participanteId: string;
  campeonPredicho: string;
  goleadorPredicho: string;
}

interface PronosticoState {
  pronosticosPartido: PronosticoPartido[];
  pronosticosCampeonGoleador: PronosticoCampeonGoleador[];
  loading: boolean;
  error: string | null;
}

const initialState: PronosticoState = {
  pronosticosPartido: [],
  pronosticosCampeonGoleador: [],
  loading: false,
  error: null
};

export const createPronosticoPartidoThunk = createAsyncThunk(
  'pronosticos/partido/create',
  async (data: { participanteId: string; partidoId: string; pronostico: string }, { rejectWithValue }) => {
    try {
      return await createPronosticoPartido(data.participanteId, data.partidoId, data.pronostico);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPronosticoCampeonGoleadorThunk = createAsyncThunk(
  'pronosticos/campeongoleador/create',
  async (data: { participanteId: string; campeonPredicho: string; goleadorPredicho: string }, { rejectWithValue }) => {
    try {
      return await createPronosticoCampeonGoleador(data.participanteId, data.campeonPredicho, data.goleadorPredicho);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const pronosticoSlice = createSlice({
  name: 'pronosticos',
  initialState,
  reducers: {
    resetPronosticos: (state) => {
    state.pronosticosPartido = [];
    state.pronosticosCampeonGoleador = [];
    state.loading = false;
    state.error = null;
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPronosticoCampeonGoleadorThunk.fulfilled, (state, action) => {
        state.pronosticosCampeonGoleador.push(action.payload);
      })
      .addCase(createPronosticoPartidoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPronosticoPartidoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.pronosticosPartido.push(action.payload);
      })
      .addCase(createPronosticoPartidoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    }
});

export const { resetPronosticos } = pronosticoSlice.actions;
export default pronosticoSlice.reducer;