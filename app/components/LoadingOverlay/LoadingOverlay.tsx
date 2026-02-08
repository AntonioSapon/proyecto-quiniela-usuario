import styles from './loading.module.css';

const LoadingOverlay = ({ text = 'Cargando...' }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
