"use client";

import { useEffect, useState } from "react";
import styles from "./IntroAnimation.module.css";

export default function IntroAnimation() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  if (hide) return null;

  return (
    <div className={styles.intro}>
      {/* Fondo oscuro */}
      <div className={styles.background}></div>

      {/* Copa */}
      <div className={styles.logoWrapper}>
        <img
          src="/worldcup-outline.png"
          alt="World Cup"
          className={styles.logo}
        />
      </div>

      {/* Glow dorado */}
      <div className={styles.glow}></div>
    </div>
  );
}