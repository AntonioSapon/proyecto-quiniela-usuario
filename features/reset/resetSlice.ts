// resetSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resetAllData } from './resetAPI';
import { resetParticipantes } from '../participantes/participanteSlice';
import { resetPartidos } from '../partidos/partidoSlice';
import { resetPronosticos } from '../pronosticos/pronosticoSlice';

interface ResetState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ResetState = {
  loading: false,
  error: null,
  success: false
};

export const resetAllDataThunk = createAsyncThunk(
  'reset/all',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const result = await resetAllData();
      
      // Despachar acciones de reset para cada slice
      dispatch(resetParticipantes());
      dispatch(resetPartidos());
      dispatch(resetPronosticos());
      
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const resetSlice = createSlice({
  name: 'reset',
  initialState,
  reducers: {
    resetResetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetAllDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetAllDataThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetAllDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetResetState } = resetSlice.actions;
export default resetSlice.reducer;