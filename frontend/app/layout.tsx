
import { WebVitalsTracker } from "@/components/analytics/WebVitalsTracker";
import type { Metadata } from "next";
import dynamic from 'next/dynamic';
import localFont from "next/font/local";
import { ReactNode, Suspense } from "react";
import Providers from './Providers';
import "./globals.css";

const Cart = dynamic(() =>
  import('@/components/cart/Cart').then(mod => mod.Cart),
  {
    ssr: false,
    loading: () => null
  }
);
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  preload: true,
  display: "swap"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  preload: true,
  display: "swap"
});

export const metadata: Metadata = {
  title: "AMMAE | Moda Femenina",
  description: "AMMAE is a platform for fashion and accessories.",
  keywords: ["moda femenina", "blusas", "jeans", "ropa de mujer", "accesorios de moda"],
  icons: {
    icon: "/logo.jpeg",
  }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Suspense >
            {children}
            <Cart />
            <WebVitalsTracker />

          </Suspense>

        </Providers>
      </body>
    </html>
  );
}

export default RootLayout