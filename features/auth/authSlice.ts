// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, checkSession } from './authAPI';

type AuthState = {
  user: null | {
    username: string;
    token: string;
  };
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { user: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      
      // Almacenar token en localStorage
      localStorage.setItem('authToken', response.token);
      
      return {
        username: credentials.user,
        token: response.token
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const checkSessionThunk = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No hay token almacenado');
      
      const response = await checkSession();
      return {
        username: response.username,
        token: token
      };
    } catch (error) {
      localStorage.removeItem('authToken');
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('authToken');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          username: action.payload.username,
          token: action.payload.token
        };
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkSessionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSessionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          username: action.payload.username,
          token: action.payload.token
        };
      })
      .addCase(checkSessionThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;