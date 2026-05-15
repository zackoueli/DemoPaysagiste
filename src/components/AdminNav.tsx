"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, FileText, Images, Newspaper, ExternalLink, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/devis", label: "Devis", icon: FileText, exact: false },
  { href: "/admin/medias", label: "Médias", icon: Images, exact: false },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper, exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  return (
    <aside style={{
      width: "220px",
      background: "white",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      height: "100vh",
      borderRight: "1px solid #eaf0ea",
    }}>

      {/* Logo */}
      <div style={{ padding: "1.5rem 1.25rem 1.25rem" }}>
        <Link href="/admin" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #2d6a27 0%, #4a9e42 100%)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(45,106,39,0.25)",
          }}>
            <Leaf size={17} color="white" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#1a2e19", letterSpacing: "0.03em", lineHeight: 1.2 }}>
              Demo Paysagiste
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", color: "#8aab86", letterSpacing: "0.05em" }}>
              Administration
            </div>
          </div>
        </Link>
      </div>

      {/* Séparateur */}
      <div style={{ height: "1px", background: "#f0f5f0", margin: "0 1.25rem 0.75rem" }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 0.75rem" }}>
        <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8ccb6", padding: "0 0.625rem", marginBottom: "0.5rem" }}>
          Navigation
        </div>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : (pathname === href || pathname.startsWith(href + "/"));
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.6rem 0.75rem",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "0.855rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#1e4d1a" : "#5a7a57",
              background: isActive ? "#e8f5e6" : "transparent",
              marginBottom: "2px",
              transition: "all 0.15s ease",
              position: "relative",
            }}>
              <div style={{
                width: "30px", height: "30px",
                background: isActive ? "#1e4d1a" : "#f2f7f1",
                borderRadius: "9px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.15s ease",
              }}>
                <Icon size={15} color={isActive ? "white" : "#6a9566"} strokeWidth={2} />
              </div>
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={13} color="#3a7a34" strokeWidth={2.5} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid #f0f5f0", margin: "0 0" }}>
        <Link href="/" target="_blank" style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.6rem 0.75rem",
          borderRadius: "12px",
          textDecoration: "none",
          fontSize: "0.82rem",
          fontFamily: "'DM Sans', sans-serif",
          color: "#8aab86",
          transition: "all 0.15s ease",
        }}>
          <div style={{ width: "30px", height: "30px", background: "#f2f7f1", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ExternalLink size={14} color="#8aab86" strokeWidth={2} />
          </div>
          Voir le site
        </Link>
      </div>
    </aside>
  );
}
