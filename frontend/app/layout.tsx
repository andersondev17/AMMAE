
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode, Suspense } from "react";
import { Cart } from "../components/cart/Cart";
import Providers from './Providers';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  preload: true

});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  preload: true
});

export const metadata: Metadata = {
  title: "AMMAE",
  description: "AMMAE is a platform for fashion and accessories.",
  icons: {
    icon: "/logo.jpeg",
  }
};

const RootLayout = ({ children }: { children: ReactNode }) => {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Suspense >
            {children}
            <Cart />
          </Suspense>

        </Providers>
      </body>
    </html>
  );
}

export default RootLayout