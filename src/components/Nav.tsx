"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/stock", label: "Mon stock" },
  { href: "/profil", label: "Mon profil" },
  { href: "/historique", label: "Historique" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white shadow-md backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight"
        >
          🍽️ Mange Malin
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm font-medium">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-3 py-1.5 transition-colors ${
                  active ? "text-orange-600" : "text-white/90 hover:bg-white/15"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
