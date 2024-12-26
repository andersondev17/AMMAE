
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer } from '../components/Layout/Footer';
import { Navbar } from '../components/Layout/Navbar/Navbar';
import { Cart } from "../components/cart/Cart";
import { Providers } from './Providers';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AMMAE",
  description: "AMMAE is a platform for fashion and accessories.",
  icons: {
    icon: "/logo.jpeg",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <Providers>{children}</Providers>
        <Cart />
        <Footer />
      </body>
    </html>
  );
}