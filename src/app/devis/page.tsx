"use client";

import { useState, useRef } from "react";
import { CheckCircle, ChevronDown, ChevronUp, Upload, X } from "lucide-react";

const SERVICES = [
  "Tonte de pelouse",
  "Élagage et taille de haies",
  "Débroussaillage",
  "Nettoyage de bâtiments (intérieur/extérieur)",
  "Nettoyage terrasses, murs, façades, toitures",
  "Entretien de jardins et espaces verts",
  "Évacuation de déchets verts",
  "Coupe de bois de chauffage",
];

const sections = [
  { id: "travaux",  emoji: "🌿", title: "Type de travaux",          subtitle: "Quels services souhaitez-vous ?" },
  { id: "terrain",  emoji: "📐", title: "Votre terrain",            subtitle: "Surface, accès, localisation" },
  { id: "photos",   emoji: "📷", title: "Photos & détails",         subtitle: "Aidez-nous à mieux préparer votre devis" },
  { id: "planning", emoji: "📅", title: "Planning souhaité",        subtitle: "Quand souhaitez-vous qu'on intervienne ?" },
];

type FormData = Record<string, string>;

export default function DevisPage() {
  const [form, setForm] = useState<FormData>({});
  const [open, setOpen] = useState<string>("travaux");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [services, setServices] = useState<string[]>([]);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleService(service: string) {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  }

  function handlePhotos(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 8 - photos.length);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removePhoto(i: number) {
    URL.revokeObjectURL(previews[i]);
    setPhotos((prev) => prev.filter((_, j) => j !== i));
    setPreviews((prev) => prev.filter((_, j) => j !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (!form["nom"]?.trim()) errs.push("Votre nom est obligatoire");
    if (!form["email"]?.trim()) errs.push("Votre email est obligatoire");
    if (!form["telephone"]?.trim()) errs.push("Votre téléphone est obligatoire");
    if (!form["adresse"]?.trim()) errs.push("L'adresse du chantier est obligatoire");
    if (services.length === 0) errs.push("Sélectionnez au moins un service");
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setSending(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("typesTravaux", JSON.stringify(services));
      photos.forEach((p) => fd.append("photos", p));
      const res = await fetch("/api/devis", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setErrors(["Une erreur est survenue. Veuillez réessayer ou nous appeler directement."]);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: "480px", textAlign: "center" }}>
          <CheckCircle size={56} color="var(--green)" style={{ marginBottom: "1.5rem" }} />
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2.5rem", fontWeight: 400, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            Demande envoyée !
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "var(--text-soft)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
            Nous vous répondrons sous <strong>48h</strong> à <strong>{form["email"]}</strong>.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "var(--text-xsoft)", marginBottom: "2rem" }}>
            En cas d'urgence, appelez le <a href="tel:+33600000000" style={{ color: "var(--green)" }}>06 00 00 00 00</a>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--cream)", padding: "100px 1rem 4rem" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "var(--text-xsoft)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Demo Paysagiste · Devis gratuit
          </p>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem, 6vw, 3.25rem)", fontWeight: 400, margin: "0 0 1rem", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Demande de devis{" "}
            <em style={{ fontStyle: "italic", color: "var(--green)" }}>en ligne</em>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "var(--text-soft)", lineHeight: 1.7, marginBottom: "1rem" }}>
            Remplissez ce formulaire — plus c&apos;est précis, plus le devis sera adapté. Réponse garantie sous 48h.
          </p>
          <div style={{ background: "var(--green-light)", borderRadius: "8px", padding: "0.75rem 1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "var(--green-dark)", fontWeight: 500 }}>
              ✅ Gratuit & sans engagement
            </span>
          </div>
        </div>

        {/* Coordonnées */}
        <div className="bcard" style={{ padding: "1.75rem", marginBottom: "0.5rem" }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--black)" }}>
            Vos coordonnées
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="coords-grid">
              <Field label="Prénom *" value={form["prenom"] ?? ""} onChange={(v) => set("prenom", v)} placeholder="Jean" />
              <Field label="Nom *" value={form["nom"] ?? ""} onChange={(v) => set("nom", v)} placeholder="Dupont" />
            </div>
            <Field label="Email *" type="email" value={form["email"] ?? ""} onChange={(v) => set("email", v)} placeholder="jean@exemple.fr" />
            <Field label="Téléphone *" type="tel" value={form["telephone"] ?? ""} onChange={(v) => set("telephone", v)} placeholder="06 00 00 00 00" />
            <Field label="Adresse du chantier *" value={form["adresse"] ?? ""} onChange={(v) => set("adresse", v)} placeholder="12 rue des Pins, 40600 Biscarrosse" />
          </div>
        </div>

        {/* Sections accordéon */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>

          {/* Travaux */}
          <SectionBlock section={sections[0]} open={open} setOpen={setOpen}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {SERVICES.map((service) => {
                const selected = services.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      background: selected ? "var(--green-light)" : "var(--gray-50)",
                      border: selected ? "2px solid var(--green-dark)" : "2px solid transparent",
                      cursor: "pointer", textAlign: "left", width: "100%",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.9rem",
                      color: selected ? "var(--green-dark)" : "var(--text-mid)",
                      fontWeight: selected ? 500 : 400,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{
                      width: "18px", height: "18px",
                      border: `2px solid ${selected ? "var(--green-dark)" : "var(--gray-200)"}`,
                      background: selected ? "var(--green-dark)" : "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {selected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </span>
                    {service}
                  </button>
                );
              })}
            </div>
          </SectionBlock>

          {/* Terrain */}
          <SectionBlock section={sections[1]} open={open} setOpen={setOpen}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Surface approximative</label>
                <div style={{ position: "relative", maxWidth: "220px" }}>
                  <input
                    type="number"
                    min="1"
                    placeholder="500"
                    value={form["surface"] ?? ""}
                    onChange={(e) => set("surface", e.target.value)}
                    className="input"
                    style={{ paddingRight: "3.5rem" }}
                  />
                  <span style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "var(--text-xsoft)", pointerEvents: "none" }}>m²</span>
                </div>
              </div>
              <RadioGroup
                label="Facilité d'accès au terrain"
                name="acces"
                options={["Facile (portail/allée)", "Moyen (chemin étroit)", "Difficile (terrain isolé)"]}
                value={form["acces"] ?? ""}
                onChange={(v) => set("acces", v)}
              />
              <RadioGroup
                label="État actuel"
                name="etat"
                options={["Bien entretenu", "Entretien moyen", "Laissé à l'abandon"]}
                value={form["etat"] ?? ""}
                onChange={(v) => set("etat", v)}
              />
            </div>
          </SectionBlock>

          {/* Photos */}
          <SectionBlock section={sections[2]} open={open} setOpen={setOpen}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handlePhotos(e.dataTransfer.files); }}
                style={{
                  border: "2px dashed var(--gray-200)",
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "var(--gray-50)",
                  transition: "border-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--green)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--gray-200)")}
              >
                <Upload size={24} color="var(--text-xsoft)" style={{ marginBottom: "0.5rem" }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 500, color: "var(--text-mid)", margin: "0 0 0.25rem" }}>
                  Glissez vos photos ou cliquez
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "var(--text-xsoft)", margin: 0 }}>
                  JPG, PNG — max 10 Mo — {photos.length}/8
                </p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handlePhotos(e.target.files)} />
              </div>
              {previews.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                  {previews.map((src, i) => (
                    <div key={i} style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button type="button" onClick={() => removePhoto(i)} style={{ position: "absolute", top: "3px", right: "3px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <label style={labelStyle}>Description complémentaire</label>
                <textarea
                  rows={4}
                  placeholder="Décrivez votre terrain, les contraintes particulières, vos attentes..."
                  value={form["description"] ?? ""}
                  onChange={(e) => set("description", e.target.value)}
                  className="input"
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </SectionBlock>

          {/* Planning */}
          <SectionBlock section={sections[3]} open={open} setOpen={setOpen}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <RadioGroup
                label="Urgence"
                name="urgence"
                options={["Dès que possible", "Dans les 2 semaines", "Dans le mois", "Pas de contrainte"]}
                value={form["urgence"] ?? ""}
                onChange={(v) => set("urgence", v)}
              />
              <div>
                <label style={labelStyle}>Date souhaitée (optionnel)</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form["dateSouhaitee"] ?? ""}
                  onChange={(e) => set("dateSouhaitee", e.target.value)}
                  className="input"
                  style={{ maxWidth: "220px" }}
                />
              </div>
            </div>
          </SectionBlock>

          {/* Erreurs */}
          {errors.length > 0 && (
            <div style={{ background: "#FFF1F0", border: "2px solid #FF4D4F", padding: "1rem 1.25rem" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.5rem", color: "#cf1322" }}>
                ⚠️ Veuillez corriger les points suivants :
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                {errors.map((e, i) => <li key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#cf1322" }}>{e}</li>)}
              </ul>
            </div>
          )}

          {/* Récap + Submit */}
          <div style={{ background: "var(--black)", padding: "2rem", marginTop: "0.5rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem" }}>
              Prêt à envoyer ?
            </p>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.75rem", fontWeight: 400, color: "white", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
              Envoyer ma demande
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Nous répondons sous 48h. Devis gratuit, sans engagement.
            </p>
            <button
              type="submit"
              disabled={sending}
              className="btn"
              style={{ background: "white", color: "var(--black)", fontWeight: 600, fontSize: "0.95rem", padding: "0.85rem 1.75rem", cursor: sending ? "wait" : "pointer", opacity: sending ? 0.7 : 1, borderRadius: "100px" }}
            >
              {sending ? "Envoi en cours..." : "Envoyer le formulaire →"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .coords-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

/* ── Composants utilitaires ── */

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "var(--text-mid)",
  marginBottom: "0.4rem",
  letterSpacing: "0.02em",
};

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
    </div>
  );
}

function RadioGroup({ label, name, options, value, onChange }: {
  label: string; name: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
        {options.map((opt) => (
          <label key={opt} style={{
            display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: value === opt ? "var(--black)" : "var(--text-soft)",
            fontWeight: value === opt ? 500 : 400,
          }}>
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              style={{ accentColor: "var(--green-dark)", width: "14px", height: "14px" }}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function SectionBlock({ section, open, setOpen, children }: {
  section: { id: string; emoji: string; title: string; subtitle: string };
  open: string; setOpen: (id: string) => void; children: React.ReactNode;
}) {
  const isOpen = open === section.id;
  return (
    <div className="bcard" style={{ overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen(isOpen ? "" : section.id)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "1rem",
          padding: "1.25rem 1.5rem", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{
          width: "40px", height: "40px", background: "var(--green-light)",
          border: "2px solid var(--black)", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "1.1rem", flexShrink: 0,
        }}>
          {section.emoji}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--black)", margin: 0, lineHeight: 1.2 }}>
            {section.title}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "var(--text-xsoft)", margin: 0 }}>
            {section.subtitle}
          </p>
        </div>
        {isOpen ? <ChevronUp size={18} color="var(--text-soft)" /> : <ChevronDown size={18} color="var(--text-soft)" />}
      </button>
      {isOpen && (
        <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "2px solid var(--black)" }}>
          <div style={{ paddingTop: "1.25rem" }}>{children}</div>
        </div>
      )}
    </div>
  );
}
