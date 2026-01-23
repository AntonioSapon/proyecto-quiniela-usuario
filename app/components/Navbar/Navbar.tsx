"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/Redux/store';
import { logout } from '@/features/auth/authSlice';
import styles from "./Navbar.module.css";
import logo from "./WC-2026.png";
import { useEffect, useState } from "react";

export default function CustomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      setIsTop(window.scrollY < 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/'); // Redirige al inicio después de logout
  };

  return (
    <BootstrapNavbar 
      expand="lg" 
      fixed="top"
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${isTop ? styles.top : ''}`}
    >
      <Container fluid className={styles.navbarContainer}>
        <BootstrapNavbar.Brand>
          
            <img
              src={logo.src}
              alt="Logo Copa Oro"
              className={styles.logo}
            />
          
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="navbar-nav" className={styles.toggler} />

        <BootstrapNavbar.Collapse id="navbar-nav" className={styles.navbarCollapse}>
          <Nav className={styles.menuOptions}>
            <Nav.Link
              as={Link}
              href="/"
              className={`${styles.navLink} ${pathname === "/" ? styles.active : ''}`}
            >
              Inicio
            </Nav.Link>
            
            <Nav.Link
              as={Link}
              href="/Partidos"
              className={`${styles.navLink} ${pathname === "/partidos" ? styles.active : ''}`}
            >
              Partidos
            </Nav.Link>
            

            <Nav.Link
              as={Link}
              href="/predicciones"
              className={`${styles.navLink} ${pathname === "/predicciones" ? styles.active : ''}`}
            >
              Predicciones
            </Nav.Link>
            {user ? (

                  

              <Nav.Link
                as="button" // Usamos button para el logout
                onClick={handleLogout}
                className={styles.navLink}
              >
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link
                as={Link}
                href="/components/auth/login"
                className={`${styles.navLink} ${pathname === "/components/auth/login" ? styles.active : ''}`}
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