import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPartidos, createPartido, updateResultadoPartido } from './partidoAPI';

type Partido = {
    _id: string;
    jornada: number;
    local: string;
    visitante: string;
    fecha: string;
    resultado: string | null; // Puede ser un string o null si aún no se ha jugado
    status: 'pendiente' | 'jugando' | 'finalizado' | 'cancelado';
};

type PartidoState = {
    partidos: Partido[];
    loading: boolean;
    error: string | null;
};

const initialState: PartidoState = {
    partidos: [],
    loading: false,
    error: null
};

export const fetchPartidosThunk = createAsyncThunk(
    'partido/fetchPartidos',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchPartidos();
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
        }
    }
);

export const createPartidoThunk = createAsyncThunk(
  'partidos/create',
  async (data: { jornada: string; local: string; visitante: string }, { rejectWithValue }) => {
    try {
      return await createPartido(data.jornada, data.local, data.visitante);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateResultadoPartidoThunk = createAsyncThunk(
  'partidos/updateResultado',
  async (data: { id: string; resultado: string }, { rejectWithValue }) => {
    try {
      return await updateResultadoPartido(data.id, data.resultado);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const partidoSlice = createSlice({
    name: 'partidos',
    initialState,
    reducers: {
        addPartido: (state, action: { payload: Partido }) => {
            state.partidos.push(action.payload);
        },
        updatePartido: (state, action: { payload: Partido }) => {
            const index = state.partidos.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.partidos[index] = action.payload;
            }
        },
        removePartido: (state, action: { payload: string }) => {
            state.partidos = state.partidos.filter(p => p._id !== action.payload);
        },
        setPartidos: (state, action: { payload: Partido[] }) => {
            state.partidos = action.payload;
        },
        resetPartidos: (state) => {
            state.partidos = [];
            state.loading = false;
            state.error = null;
        }
    },
     extraReducers: (builder) => {
        builder
            .addCase(fetchPartidosThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.partidos = action.payload.map((p: any) => ({
                _id: p._id, // Usa _id en lugar de id
                jornada: p.jornada,
                local: p.local,
                visitante: p.visitante,
                fecha: p.fecha,
                resultado: p.resultado,
                status: p.status
            }));
            })
            .addCase(fetchPartidosThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.error('Failed to fetch partidos:', action.payload);
            })
            .addCase(createPartidoThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(createPartidoThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.partidos.push(action.payload);
            })
            .addCase(createPartidoThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            })
            .addCase(updateResultadoPartidoThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(updateResultadoPartidoThunk.fulfilled, (state, action) => {
            state.loading = false;
            const updatedPartido = action.payload;
            
            // Actualizar el partido en el estado
            const index = state.partidos.findIndex(p => p._id === updatedPartido._id);
            if (index !== -1) {
                state.partidos[index] = {
                _id: updatedPartido._id,
                jornada: updatedPartido.jornada,
                local: updatedPartido.local,
                visitante: updatedPartido.visitante,
                fecha: updatedPartido.fecha,
                resultado: updatedPartido.resultado,
                status: updatedPartido.status
                };
            }
            })
            .addCase(updateResultadoPartidoThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            });
    }
});

export const { addPartido, updatePartido, removePartido, setPartidos, resetPartidos } = partidoSlice.actions;
export default partidoSlice.reducer;