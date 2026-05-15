"use client";

import { useState } from "react";
import { CheckCircle, Clock, AlertCircle, Calendar, Save, Loader2 } from "lucide-react";

type DevisData = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  surface: number;
  services: string[];
  photos: string[];
  description: string | null;
  dateSouhaitee: string | null;
  statut: string;
  noteAdmin: string | null;
  dateIntervention: string | null;
  createdAt: string;
};

export default function DevisDetail({ devis }: { devis: DevisData }) {
  const [statut, setStatut] = useState(devis.statut);
  const [note, setNote] = useState(devis.noteAdmin || "");
  const [dateIntervention, setDateIntervention] = useState(
    devis.dateIntervention ? devis.dateIntervention.split("T")[0] : ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/devis/${devis.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut, noteAdmin: note, dateIntervention }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "var(--text-dark)", margin: 0 }}>
            Devis #{devis.id} — {devis.prenom} {devis.nom}
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
            Reçu le {new Date(devis.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
        {/* Main info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Client */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e8ede8", padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1rem" }}>
              Coordonnées du client
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                ["Nom", `${devis.prenom} ${devis.nom}`],
                ["Email", devis.email],
                ["Téléphone", devis.telephone],
                ["Adresse chantier", devis.adresse],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.2rem" }}>{label}</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-dark)" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Travaux */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e8ede8", padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1rem" }}>
              Détails des travaux
            </h3>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.5rem" }}>Surface</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--green-900)" }}>{devis.surface} m²</div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.5rem" }}>Services demandés</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {devis.services.map((s) => (
                  <span key={s} style={{ background: "var(--green-50)", border: "1px solid var(--green-100)", borderRadius: "4px", padding: "4px 10px", fontSize: "0.8rem", color: "var(--green-800)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {devis.dateSouhaitee && (
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.25rem" }}>Date souhaitée</div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-dark)" }}>
                  {new Date(devis.dateSouhaitee).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            )}
            {devis.description && (
              <div>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.25rem" }}>Description</div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-mid)", lineHeight: 1.65, background: "#f9fbf9", padding: "0.75rem", borderRadius: "6px", margin: 0 }}>
                  {devis.description}
                </p>
              </div>
            )}
          </div>

          {/* Photos */}
          {devis.photos.length > 0 && (
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e8ede8", padding: "1.5rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1rem" }}>
                Photos jointes ({devis.photos.length})
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                {devis.photos.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Photo ${i + 1}`}
                      style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "8px", border: "1px solid #e8ede8" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e8ede8", padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1.25rem" }}>
              Gestion du devis
            </h3>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Statut</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { value: "nouveau", label: "Nouveau", icon: AlertCircle, bg: "#fef3c7", color: "#92400e" },
                  { value: "en_cours", label: "En cours", icon: Clock, bg: "#dbeafe", color: "#1e40af" },
                  { value: "traite", label: "Traité", icon: CheckCircle, bg: "#d1fae5", color: "#065f46" },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const selected = statut === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatut(opt.value)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.6rem 0.75rem",
                        borderRadius: "8px",
                        border: `1.5px solid ${selected ? opt.color : "#e8ede8"}`,
                        background: selected ? opt.bg : "white",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontFamily: "'DM Sans', sans-serif",
                        color: selected ? opt.color : "var(--text-mid)",
                        fontWeight: selected ? 600 : 400,
                        textAlign: "left",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Icon size={14} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>
                <Calendar size={12} style={{ display: "inline", marginRight: "4px" }} />
                Date d&apos;intervention
              </label>
              <input
                type="date"
                value={dateIntervention}
                onChange={(e) => setDateIntervention(e.target.value)}
                style={inputStyle}
              />
              <p style={{ fontSize: "0.72rem", color: "var(--text-light)", marginTop: "0.3rem" }}>
                S&apos;ajoute automatiquement au calendrier des chantiers.
              </p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Note interne</label>
              <textarea
                rows={4}
                placeholder="Notes sur ce client, le chantier, le prix estimé..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{ border: "none", cursor: saving ? "wait" : "pointer", width: "100%", justifyContent: "center" }}
            >
              {saving ? (
                <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Enregistrement...</>
              ) : saved ? (
                <><CheckCircle size={14} /> Enregistré !</>
              ) : (
                <><Save size={14} /> Enregistrer les modifications</>
              )}
            </button>
          </div>

          <div style={{ background: "var(--green-50)", border: "1px solid var(--green-100)", borderRadius: "12px", padding: "1.25rem" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--text-mid)", lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "var(--green-900)" }}>Répondre au client :</strong>
              {" "}<a href={`mailto:${devis.email}?subject=Votre devis Demo Paysagiste`} style={{ color: "var(--green-800)" }}>Envoyer un email</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-light)",
  marginBottom: "0.45rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  border: "1.5px solid #e8ede8",
  borderRadius: "8px",
  fontSize: "0.875rem",
  color: "var(--text-dark)",
  fontFamily: "'DM Sans', sans-serif",
  background: "#f9fbf9",
  outline: "none",
  boxSizing: "border-box",
};
