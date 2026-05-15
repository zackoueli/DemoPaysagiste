import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Clock, CheckCircle, AlertCircle, Eye, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDevisPage() {
  await requireAdmin();

  const [devisSnap, chantiersSnap] = await Promise.all([
    db.collection("devis").orderBy("createdAt", "desc").get(),
    db.collection("chantiers").orderBy("date", "asc").get(),
  ]);

  const devis = devisSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown> & { id: string }));
  const now = new Date().toISOString();
  const chantiers = chantiersSnap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown> & { id: string }))
    .filter((c) => (c.date as string) >= now);

  return (
    <div style={{ padding: "2.5rem" }}>
      <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.75rem", fontWeight: 400, color: "var(--black)", marginBottom: "0.25rem" }}>Devis & Chantiers</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-xsoft)" }}>
            {devis.filter((d) => d.statut === "nouveau").length} nouveau(x) devis en attente
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }} className="admin-devis-grid">
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e8ede8", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e8ede8" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", fontWeight: 400, color: "var(--black)", margin: 0 }}>Tous les devis ({devis.length})</h2>
          </div>
          {devis.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-xsoft)", fontSize: "0.9rem" }}>Aucun devis reçu pour l&apos;instant.</div>
          ) : (
            <div>
              {devis.map((d) => {
                const services = JSON.parse((d.typesTravaux as string) || "[]") as string[];
                const photos = JSON.parse((d.photos as string) || "[]") as string[];
                return (
                  <div key={d.id} style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0f4f0", display: "flex", gap: "1rem", alignItems: "flex-start", background: d.statut === "nouveau" ? "#fffef0" : "white" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--black)" }}>{d.prenom as string} {d.nom as string}</span>
                        <StatusBadge statut={d.statut as string} />
                        {photos.length > 0 && <span style={{ fontSize: "0.72rem", color: "var(--text-xsoft)" }}>📸 {photos.length} photo{photos.length > 1 ? "s" : ""}</span>}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-xsoft)", marginBottom: "0.4rem" }}>{d.email as string} · {d.telephone as string}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-soft)", marginBottom: "0.5rem" }}>📍 {d.adresse as string} · {d.surface as number} m²</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {services.slice(0, 3).map((s: string) => (
                          <span key={s} style={{ background: "var(--green-light)", border: "1px solid var(--gray-100)", borderRadius: "4px", padding: "2px 8px", fontSize: "0.75rem", color: "var(--green-dark)" }}>{s}</span>
                        ))}
                        {services.length > 3 && <span style={{ fontSize: "0.75rem", color: "var(--text-xsoft)" }}>+{services.length - 3}</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end", flexShrink: 0 }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-xsoft)", whiteSpace: "nowrap" }}>{new Date(d.createdAt as string).toLocaleDateString("fr-FR")}</div>
                      <Link href={`/admin/devis/${d.id}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "var(--green-dark)", color: "white", padding: "0.4rem 0.75rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.78rem", fontWeight: 500, whiteSpace: "nowrap" }}>
                        <Eye size={12} />Voir
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e8ede8", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e8ede8", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={16} color="var(--green-dark)" />
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", fontWeight: 400, color: "var(--black)", margin: 0 }}>Chantiers à venir</h2>
          </div>
          <div style={{ padding: "1rem" }}>
            {chantiers.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "var(--text-xsoft)", textAlign: "center", padding: "1.5rem 0" }}>Aucun chantier planifié.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {chantiers.map((c) => (
                  <div key={c.id} style={{ padding: "0.875rem 1rem", borderRadius: "8px", border: "1px solid #e8ede8", borderLeft: `3px solid ${c.couleur as string || "#3A6B35"}`, background: "#fafafa" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--black)", marginBottom: "0.25rem" }}>{c.titre as string}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-xsoft)" }}>📅 {new Date(c.date as string).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</div>
                    {c.description ? <div style={{ fontSize: "0.78rem", color: "var(--text-soft)", marginTop: "0.25rem" }}>{String(c.description)}</div> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .admin-devis-grid { grid-template-columns: 1fr !important; } }`}</style>
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
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: config.bg, color: config.color, padding: "2px 8px", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 500 }}>
      <Icon size={10} />{config.label}
    </span>
  );
}
