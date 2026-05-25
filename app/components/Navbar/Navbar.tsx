"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
} from "react-bootstrap";

import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/Redux/store";
import { logout } from "@/features/auth/authSlice";

import styles from "./Navbar.module.css";
import logo from "./WC-2026.png";

import { useEffect, useState } from "react";

export default function CustomNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  /* ===================================================== */
  /* ===== STATES ======================================== */
  /* ===================================================== */

  const [scrolled, setScrolled] = useState(false);

  // 👇 NUEVO: ocultar navbar al bajar
  const [hidden, setHidden] = useState(false);

  /* ===================================================== */
  /* ===== SCROLL EFFECT ================================= */
  /* ===================================================== */

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Navbar compacta
      setScrolled(currentScrollY > 40);

      // Ocultar al bajar
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ===================================================== */
  /* ===== LOGOUT ======================================== */
  /* ===================================================== */

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <BootstrapNavbar
      expand="lg"
      fixed="top"
      className={`
        ${styles.navbar}
        ${scrolled ? styles.scrolled : ""}
        ${hidden ? styles.hidden : ""}
      `}
    >
      <Container fluid className={styles.navbarContainer}>
        
        {/* ===================================================== */}
        {/* ===== LOGO ========================================== */}
        {/* ===================================================== */}

        <BootstrapNavbar.Brand>
          <img
            src={logo.src}
            alt="Logo Copa Oro"
            className={styles.logo}
          />
        </BootstrapNavbar.Brand>

        {/* ===================================================== */}
        {/* ===== TOGGLER MOBILE ================================ */}
        {/* ===================================================== */}

        <BootstrapNavbar.Toggle
          aria-controls="navbar-nav"
          className={styles.toggler}
        />

        {/* ===================================================== */}
        {/* ===== NAV LINKS ===================================== */}
        {/* ===================================================== */}

        <BootstrapNavbar.Collapse
          id="navbar-nav"
          className={styles.navbarCollapse}
        >
          <Nav className={styles.menuOptions}>
            
            {/* INICIO */}
            <Nav.Link
              as={Link}
              href="/"
              className={`${styles.navLink} ${
                pathname === "/" ? styles.active : ""
              }`}
            >
              Inicio
            </Nav.Link>

            {/* PARTIDOS */}
            <Nav.Link
              as={Link}
              href="/Partidos"
              className={`${styles.navLink} ${
                pathname === "/partidos" ? styles.active : ""
              }`}
            >
              Partidos
            </Nav.Link>

            {/* PREDICCIONES */}
            <Nav.Link
              as={Link}
              href="/predicciones"
              className={`${styles.navLink} ${
                pathname === "/predicciones"
                  ? styles.active
                  : ""
              }`}
            >
              Predicciones
            </Nav.Link>

            {/* LOGIN / LOGOUT */}
            {user ? (
              <Nav.Link
                as="button"
                onClick={handleLogout}
                className={styles.navLink}
              >
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link
                as={Link}
                href="/components/auth/login"
                className={`${styles.navLink} ${
                  pathname === "/components/auth/login"
                    ? styles.active
                    : ""
                }`}
              >
                Login
              </Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}