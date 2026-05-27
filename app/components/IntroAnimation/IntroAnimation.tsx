"use client";

import { useEffect, useState } from "react";
import styles from "./IntroAnimation.module.css";

export default function IntroAnimation() {
  const [showIntro, setShowIntro] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("introShown");
    const timer = setTimeout(() => {
      setHide(true);
    }, 2600);

    if (!alreadyShown) {

      // Mostrar intro
      setShowIntro(true);

      // Guardar que ya se mostró
      sessionStorage.setItem("introShown", "true");

      // Ocultarla después de la animación
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 2400);

      return () => clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, []);

  if (!showIntro) return null;

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