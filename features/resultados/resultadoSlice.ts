import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCampeonGoleadorReal, saveCampeonGoleadorReal } from './resultadoAPI';

type ResultadoCGReal = {
    id: string;
    campeonReal: string;
    goleadorReal: string;
}

type ResultadoCGRealState = {
    resultadoCGReals: ResultadoCGReal[];
    loading: boolean;
    error: string | null;
};

const initialState: ResultadoCGRealState = {
  resultadoCGReals: [],
  loading: false,
  error: null
};

export const saveCampeonGoleadorRealThunk = createAsyncThunk(
  'resultados/saveCampeonGoleadorReal',
  async (data: { campeonReal: string; goleadorReal: string }, { rejectWithValue }) => {
    try {
      return await saveCampeonGoleadorReal(data.campeonReal, data.goleadorReal);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  });


export const fetchCampeonGoleadorRealThunk = createAsyncThunk(
  'resultados/fetchCampeonGoleadorReal',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCampeonGoleadorReal();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const resultadoCampeonGoleadorRealSlice = createSlice({
  name: 'resultadoCGReals',
  initialState,
  reducers: {
    addresultadoscamperongoleadorReal: (state, action: {payload: ResultadoCGReal}) =>{
        state.resultadoCGReals.push(action.payload);
    },
    updateResultadoCGReal: (state, action : { payload: ResultadoCGReal}) => {
        const index = state.resultadoCGReals.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
            state.resultadoCGReals[index] = action.payload;
        }
    },
    removeresultadoCGReals: (state, action: {payload: string}) =>{
        state.resultadoCGReals = state.resultadoCGReals.filter(p => p.id !== action.payload);
    },
    setresultadoCGReals: (state, action: { payload : ResultadoCGReal[]}) => {
        state.resultadoCGReals = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampeonGoleadorRealThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampeonGoleadorRealThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.resultadoCGReals = action.payload;
      })
      .addCase(fetchCampeonGoleadorRealThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to fetch CampeónGoleadorReal: ', action.payload)
      });
  }
});

export const { 
addresultadoscamperongoleadorReal,updateResultadoCGReal,removeresultadoCGReals,setresultadoCGReals} = resultadoCampeonGoleadorRealSlice.actions;
export default resultadoCampeonGoleadorRealSlice.reducer;