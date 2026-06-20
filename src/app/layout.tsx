import type { Metadata } from "next";
import { Fredoka, Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mange Malin",
  description: "Quoi manger ce soir ? Mange Malin te le dit en 3 questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-warmscape text-stone-800">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="blob-drift absolute -top-32 -left-24 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="blob-drift absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-rose-300/30 blur-3xl"
            style={{ animationDelay: "-5s" }}
          />
          <div
            className="blob-drift absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl"
            style={{ animationDelay: "-10s" }}
          />
        </div>
        <Nav />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-3xl px-4 py-4 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Riadh Mnasri — Mange Malin
        </footer>
      </body>
    </html>
  );
}
