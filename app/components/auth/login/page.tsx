"use client";
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/store';
import { loginThunk } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginThunk({ user: username, password })).unwrap();
      router.push('./menu'); // Redirige al menú principal después de iniciar sesión
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={`card ${styles.loginCard}`}>
        <div className={`card-header ${styles.cardHeader}`}>
          <h2 className="mb-0 text-white">
            <i className="bi bi-person-fill me-2"> </i>
            Iniciar Sesión
          </h2>
        </div>
        
        <div className={styles.cardBody}>
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Usuario: </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3"><br />
              <label htmlFor="password" className="form-label">Contraseña: </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div><br />
            
            <button 
              type="submit" 
              className={`btn btn-primary w-100 py-2 ${styles.buttonCard}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Cargando...
                </>
              ) : ' Ingresar '}
            </button><br />
          </form>
        </div>
      </div>
    </div>
  );
}