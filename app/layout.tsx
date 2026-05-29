import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import CustomNavbar from "./components/Navbar/Navbar";
import "bootstrap-icons/font/bootstrap-icons.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiniela Mundial 2026",
  description: "Aplicación de quiniela para el Mundial 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreProvider>
          <CustomNavbar />

          {/* Contenido principal */}
          <div className="flex-1">
            {children}
          </div>

          {/* Footer */}
          <footer className="footer">
            <small>© Todos los derechos reservados</small>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
