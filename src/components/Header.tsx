"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/prestations", label: "Prestations" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 2000,
      background: scrolled ? "rgba(250,250,247,0.92)" : "rgba(0,0,0,0.28)",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
      transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
    }}>
      <div style={{
        maxWidth: "1140px",
        margin: "0 auto",
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "30px", height: "30px",
            background: "var(--green-dark)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Leaf size={16} color="white" strokeWidth={2} />
          </div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: scrolled ? "var(--black)" : "white",
            letterSpacing: "0.01em",
            transition: "color 0.3s ease",
          }}>
            Demo Paysagiste
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${pathname === link.href ? " active" : ""}`}
              style={{ color: scrolled ? undefined : "rgba(255,255,255,0.85)", transition: "color 0.3s ease" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/devis" className="btn btn-green hidden md:inline-flex" style={{ fontSize: "0.82rem", padding: "0.55rem 1.25rem" }}>
            Devis gratuit →
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: scrolled ? "var(--black)" : "white", display: "flex", transition: "color 0.3s ease" }}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`mobile-menu md:hidden ${menuOpen ? "open" : ""}`}
        style={{ background: "var(--cream)", borderTop: "1px solid var(--gray-100)" }}
      >
        <div style={{ padding: "1rem 2rem 1.5rem", display: "flex", flexDirection: "column", gap: "0" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                color: pathname === link.href ? "var(--black)" : "var(--text-soft)",
                textDecoration: "none",
                padding: "0.8rem 0",
                borderBottom: "1px solid var(--gray-100)",
                fontWeight: pathname === link.href ? 500 : 400,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/devis" className="btn btn-green" style={{ marginTop: "1.25rem", justifyContent: "center" }}>
            Devis gratuit →
          </Link>
        </div>
      </div>
    </header>
  );
}
