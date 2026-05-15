import Link from "next/link";
import { Leaf, Phone, Mail, MapPin } from "lucide-react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/prestations", label: "Prestations" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/actualites", label: "Actualités" },
  { href: "/devis", label: "Demander un devis" },
  { href: "/contact", label: "Contact" },
];

const services = [
  "Tonte de pelouse",
  "Élagage et taille de haies",
  "Débroussaillage",
  "Nettoyage de bâtiments",
  "Entretien de jardins",
  "Coupe de bois de chauffage",
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "4rem 2rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: "28px", height: "28px", background: "rgba(255,255,255,0.12)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Leaf size={15} color="white" strokeWidth={2} />
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "white", letterSpacing: "0.01em" }}>
                Demo Paysagiste
              </span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1.25rem", maxWidth: "220px" }}>
              Paysagiste professionnel à Biscarrosse et alentours, Landes.
            </p>
            <a
              href="https://www.instagram.com/demopaysagiste/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s ease" }}
              className="footer-link"
            >
              <InstagramIcon size={14} />
              @demopaysagiste
            </a>
          </div>

          {/* Nav */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              Navigation
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              Nos services
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {services.map((s) => (
                <li key={s} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <MapPin size={14} color="rgba(255,255,255,0.4)" style={{ marginTop: "2px", flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", lineHeight: 1.5 }}>Biscarrosse, 40600 Landes</span>
              </div>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <Phone size={14} color="rgba(255,255,255,0.4)" />
                <a href="tel:+33600000000" className="footer-link">+33 6 00 00 00 00</a>
              </div>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <Mail size={14} color="rgba(255,255,255,0.4)" />
                <a href="mailto:contact@demopaysagiste.fr" className="footer-link">contact@demopaysagiste.fr</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", margin: 0 }}>
            © {new Date().getFullYear()} Demo Paysagiste — Biscarrosse. Tous droits réservés.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/mentions-legales" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>
              Mentions légales
            </Link>
            <Link href="/admin" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.15)", textDecoration: "none" }}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
