import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { FileText, Image, Newspaper, Clock, CheckCircle, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();

  const [devisSnap, photosSnap, articlesSnap, recentSnap] = await Promise.all([
    db.collection("devis").get(),
    db.collection("photos").get(),
    db.collection("articles").get(),
    db.collection("devis").orderBy("createdAt", "desc").limit(5).get(),
  ]);

  const totalDevis = devisSnap.size;
  const nouveauxDevis = devisSnap.docs.filter((d) => d.data().statut === "nouveau").length;
  const totalPhotos = photosSnap.size;
  const totalArticles = articlesSnap.size;
  const recentDevis = recentSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown> & { id: string }));

  const cards = [
    { href: "/admin/devis", icon: FileText, label: "Devis reçus", value: totalDevis, badge: nouveauxDevis > 0 ? `${nouveauxDevis} nouveau${nouveauxDevis > 1 ? "x" : ""}` : null, color: "var(--green-dark)" },
    { href: "/admin/medias", icon: Image, label: "Photos en galerie", value: totalPhotos, badge: null, color: "var(--green)" },
    { href: "/admin/actualites", icon: Newspaper, label: "Articles publiés", value: totalArticles, badge: null, color: "var(--green-mid)" },
  ];

  return (
    <div style={{ padding: "2.5rem", maxWidth: "1000px" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontFamily: "'DM Sans', serif", fontSize: "1.75rem", fontWeight: 700, color: "var(--black)", marginBottom: "0.25rem" }}>
          Tableau de bord
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-xsoft)" }}>
          Bienvenue dans l&apos;interface d&apos;administration de Demo Paysagiste.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
              <div className="card-lift" style={{ background: "white", borderRadius: "12px", padding: "1.75rem", border: "1px solid #e8ede8", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ width: "44px", height: "44px", background: card.color, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color="white" strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "'DM Sans', serif", color: "var(--black)", lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-xsoft)", marginTop: "0.25rem" }}>{card.label}</div>
                  {card.badge && (
                    <div style={{ display: "inline-block", marginTop: "0.5rem", background: "#fef3c7", color: "#92400e", fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: "100px" }}>
                      {card.badge}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e8ede8", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e8ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'DM Sans', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--black)", margin: 0 }}>Derniers devis reçus</h2>
          <Link href="/admin/devis" style={{ fontSize: "0.8rem", color: "var(--green)", textDecoration: "none", fontWeight: 500 }}>Voir tous →</Link>
        </div>
        {recentDevis.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-xsoft)", fontSize: "0.9rem" }}>Aucun devis reçu pour l&apos;instant.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fbf9" }}>
                {["Client", "Adresse", "Surface", "Services", "Date", "Statut"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-xsoft)", borderBottom: "1px solid #e8ede8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentDevis.map((d) => {
                const services = JSON.parse((d.typesTravaux as string) || "[]") as string[];
                return (
                  <tr key={d.id} style={{ borderBottom: "1px solid #f0f4f0" }}>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <Link href={`/admin/devis/${d.id}`} style={{ textDecoration: "none" }}>
                        <div style={{ fontWeight: 500, color: "var(--black)", fontSize: "0.875rem" }}>{d.prenom as string} {d.nom as string}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-xsoft)" }}>{d.email as string}</div>
                      </Link>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.85rem", color: "var(--text-soft)", maxWidth: "160px" }}>
                      <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.adresse as string}</div>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.85rem", color: "var(--text-soft)", whiteSpace: "nowrap" }}>{d.surface as number} m²</td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-soft)" }}>{services.slice(0, 2).join(", ")}{services.length > 2 ? ` +${services.length - 2}` : ""}</div>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "var(--text-xsoft)", whiteSpace: "nowrap" }}>
                      {new Date(d.createdAt as string).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}><StatusBadge statut={d.statut as string} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ statut }: { statut: string }) {
  const config = {
    nouveau: { label: "Nouveau", bg: "#fef3c7", color: "#92400e", icon: AlertCircle },
    en_cours: { label: "En cours", bg: "#dbeafe", color: "#1e40af", icon: Clock },
    traite: { label: "Traité", bg: "#d1fae5", color: "#065f46", icon: CheckCircle },
  }[statut] || { label: statut, bg: "#f3f4f6", color: "#374151", icon: Clock };
  const Icon = config.icon;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: config.bg, color: config.color, padding: "3px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 500 }}>
      <Icon size={11} />{config.label}
    </div>
  );
}
