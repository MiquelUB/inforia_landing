import type { Metadata } from "next";
import { Lora, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Configuración de fuentes
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "INFORIA - Asistente Clínico con IA",
  description: "Recupera tu vocación. Nosotros nos encargamos del papeleo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          lora.variable,
          nunito.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
