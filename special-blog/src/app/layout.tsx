import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '../app/components/Header';
import Footer from "../app/components/Footer";
import { AuthProvider } from "../app/lib/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "special blog - Share Your Stories",
  description: "A publishing platform for writers and readers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}