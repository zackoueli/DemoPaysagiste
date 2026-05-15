"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, ChevronUp, Upload, X, CheckCircle } from "lucide-react";

const SERVICES_DEVIS = [
  "Tonte de pelouse",
  "Élagage et taille de haies",
  "Débroussaillage",
  "Nettoyage de bâtiments (intérieur/extérieur)",
  "Nettoyage terrasses, murs, façades, toitures",
  "Entretien de jardins et espaces verts",
  "Évacuation de déchets verts",
  "Coupe de bois de chauffage",
];

const SECTIONS_DEVIS = [
  { id: "travaux",  emoji: "🌿", title: "Type de travaux",   subtitle: "Quels services souhaitez-vous ?" },
  { id: "terrain",  emoji: "📐", title: "Votre terrain",     subtitle: "Surface, accès, localisation" },
  { id: "photos",   emoji: "📷", title: "Photos & détails",  subtitle: "Aidez-nous à mieux évaluer" },
  { id: "planning", emoji: "📅", title: "Planning souhaité", subtitle: "Quand intervenir ?" },
];

type ServiceCard = { title: string; desc: string; img: string };
type FormData = Record<string, string>;

export default function HomeClient({
  heroVideoUrl,
  services,
}: {
  heroVideoUrl: string;
  services: ServiceCard[];
}) {
  // ── Devis form state ──
  const [form, setForm] = useState<FormData>({});
  const [openSection, setOpenSection] = useState<string>("travaux");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [autresService, setAutresService] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  }

  function handlePhotos(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 8 - photos.length);
    setPhotos((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
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
    if (selectedServices.length === 0) errs.push("Sélectionnez au moins un service");
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setSending(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const allServices = autresService.trim()
        ? [...selectedServices, `Autres : ${autresService.trim()}`]
        : selectedServices;
      fd.append("typesTravaux", JSON.stringify(allServices));
      photos.forEach((p) => fd.append("photos", p));
      const res = await fetch("/api/devis", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setErrors(["Erreur serveur. Veuillez réessayer ou nous appeler."]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* ── HERO avec vidéo ── */}
      <section style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--green-dark)",
      }}>
        {/* Vidéo ou fallback fond */}
        {heroVideoUrl ? (
          <video
            autoPlay muted loop playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            background: "linear-gradient(135deg, #1E3B1A 0%, #2d5a27 50%, #1E3B1A 100%)",
          }} />
        )}
        {/* Overlay sombre */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1 }} />

        {/* Contenu */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1140px", margin: "0 auto", padding: "120px 2rem 80px", width: "100%" }}>
          <div className="fade-up">
            <span style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.4rem 1rem",
              borderRadius: "100px",
              marginBottom: "1.5rem",
            }}>
              Paysagiste professionnel — Biscarrosse
            </span>
          </div>
          <h1 className="fade-up delay-1" style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            color: "white",
            margin: "0 0 1.75rem",
            maxWidth: "820px",
            letterSpacing: "-0.02em",
          }}>
            Votre jardin,<br />
            <em style={{ fontStyle: "italic" }}>entre de bonnes mains.</em>
          </h1>
          <p className="fade-up delay-2" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.7,
            maxWidth: "460px",
            marginBottom: "2.5rem",
          }}>
            Tonte, élagage, débroussaillage, nettoyage — Demo Paysagiste intervient à Biscarrosse et dans les Landes.
          </p>
          <div className="fade-up delay-3" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a href="#devis" className="btn" style={{ background: "white", color: "var(--green-dark)", fontWeight: 600, fontSize: "0.95rem", padding: "0.85rem 1.75rem", borderRadius: "100px" }}>
              Demander un devis gratuit →
            </a>
            <Link href="/prestations" className="btn" style={{ background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.4)", fontSize: "0.95rem", padding: "0.85rem 1.75rem", borderRadius: "100px" }}>
              Nos prestations
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
        </div>
      </section>

      {/* ── NOS PRESTATIONS — bento layout ── */}
      <section style={{ background: "var(--green-dark)", padding: "5rem 2rem 6rem", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="label" style={{ marginBottom: "0.6rem", display: "block", color: "rgba(255,255,255,0.4)" }}>Ce que nous faisons</span>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem, 4vw, 2.75rem)", fontWeight: 400, margin: 0, letterSpacing: "-0.02em", color: "white" }}>
                Nos prestations
              </h2>
            </div>
            <Link href="/prestations" className="btn" style={{ fontSize: "0.85rem", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.15)" }}>
              Toutes les prestations <ChevronRight size={14} />
            </Link>
          </div>

          {/* Bento grid — grande image gauche + 2×2 droite */}
          <div className="prestations-bento">

            {/* Grande image gauche — toute la hauteur */}
            {services[0] && (
              <Link href="/prestations" className="pcard pcard--tall" style={{ textDecoration: "none" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={services[0].img} alt={services[0].title} className="pcard__img" />
                <div className="pcard__hover-overlay">
                  <span className="pcard__hover-title">{services[0].title}</span>
                </div>
              </Link>
            )}

            {/* Colonne du milieu — 2 images empilées */}
            <div className="pcard-col">
              {services.slice(1, 3).map((s) => (
                <Link key={s.title} href="/prestations" className="pcard" style={{ textDecoration: "none" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.title} className="pcard__img" />
                  <div className="pcard__hover-overlay">
                    <span className="pcard__hover-title">{s.title}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Colonne de droite — 2 images empilées */}
            <div className="pcard-col">
              {services.slice(3, 5).map((s) => (
                <Link key={s.title} href="/prestations" className="pcard" style={{ textDecoration: "none" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.title} className="pcard__img" />
                  <div className="pcard__hover-overlay">
                    <span className="pcard__hover-title">{s.title}</span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* ── FORMULAIRE DEVIS intégré ── */}
      <section id="devis" style={{ background: "var(--cream)", padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          {/* Header section */}
          <div style={{ marginBottom: "3rem" }}>
            <span className="label" style={{ marginBottom: "0.75rem", display: "block" }}>Devis gratuit · Sans engagement</span>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 400, margin: "0 0 1rem",
              letterSpacing: "-0.02em", lineHeight: 1.1,
            }}>
              Demandez votre devis<br /><em style={{ fontStyle: "italic" }}>en ligne</em>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "var(--text-soft)", lineHeight: 1.7 }}>
              Remplissez ce formulaire — plus c&apos;est précis, plus le devis sera adapté. Réponse sous 48h.
            </p>
          </div>

          {sent ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "white", border: "1px solid var(--gray-100)", borderRadius: "16px" }}>
              <CheckCircle size={48} color="var(--green)" style={{ marginBottom: "1.25rem" }} />
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", fontWeight: 400, marginBottom: "0.75rem" }}>
                Demande envoyée !
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "var(--text-soft)", lineHeight: 1.7 }}>
                Nous vous répondrons sous <strong>48h</strong> à <strong>{form["email"]}</strong>.
              </p>
            </div>
          ) : (
            <>
              {/* Coordonnées */}
              <div style={{ background: "white", border: "2px solid var(--black)", boxShadow: "4px 4px 0 var(--black)", padding: "2rem", marginBottom: "0.75rem" }}>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--black)" }}>
                  Vos coordonnées
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="coords-grid">
                    <DevisField label="Prénom *" value={form["prenom"] ?? ""} onChange={(v) => setField("prenom", v)} placeholder="Jean" />
                    <DevisField label="Nom *" value={form["nom"] ?? ""} onChange={(v) => setField("nom", v)} placeholder="Dupont" />
                  </div>
                  <DevisField label="Email *" type="email" value={form["email"] ?? ""} onChange={(v) => setField("email", v)} placeholder="jean@exemple.fr" />
                  <DevisField label="Téléphone *" type="tel" value={form["telephone"] ?? ""} onChange={(v) => setField("telephone", v)} placeholder="06 00 00 00 00" />
                  <DevisField label="Adresse du chantier *" value={form["adresse"] ?? ""} onChange={(v) => setField("adresse", v)} placeholder="12 rue des Pins, 40600 Biscarrosse" />
                </div>
              </div>

              {/* Sections accordéon */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Travaux */}
                <DevisSection section={SECTIONS_DEVIS[0]} open={openSection} setOpen={setOpenSection}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {SERVICES_DEVIS.map((service) => {
                      const selected = selectedServices.includes(service);
                      return (
                        <button key={service} type="button" onClick={() => toggleService(service)}
                          style={{
                            display: "flex", alignItems: "center", gap: "0.75rem",
                            padding: "0.7rem 1rem", textAlign: "left", width: "100%",
                            background: selected ? "var(--green-light)" : "var(--gray-50)",
                            border: selected ? "2px solid var(--green-dark)" : "2px solid transparent",
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
                            color: selected ? "var(--green-dark)" : "var(--text-mid)",
                            fontWeight: selected ? 500 : 400,
                            transition: "all 0.15s ease",
                          }}
                        >
                          <span style={{
                            width: "16px", height: "16px", flexShrink: 0,
                            border: `2px solid ${selected ? "var(--green-dark)" : "var(--gray-200)"}`,
                            background: selected ? "var(--green-dark)" : "white",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {selected && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </span>
                          {service}
                        </button>
                      );
                    })}
                    {/* Autres */}
                    <div style={{
                      background: autresService ? "var(--green-light)" : "var(--gray-50)",
                      border: autresService ? "2px solid var(--green-dark)" : "2px solid transparent",
                      padding: "0.7rem 1rem",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: autresService ? "0.6rem" : 0 }}>
                        <span style={{
                          width: "16px", height: "16px", flexShrink: 0,
                          border: `2px solid ${autresService ? "var(--green-dark)" : "var(--gray-200)"}`,
                          background: autresService ? "var(--green-dark)" : "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {autresService && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: autresService ? "var(--green-dark)" : "var(--text-mid)", fontWeight: autresService ? 500 : 400 }}>
                          Autres
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Décrivez votre besoin..."
                        value={autresService}
                        onChange={(e) => setAutresService(e.target.value)}
                        className="input"
                        style={{ fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>
                </DevisSection>

                {/* Terrain */}
                <DevisSection section={SECTIONS_DEVIS[1]} open={openSection} setOpen={setOpenSection}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Surface approximative</label>
                      <div style={{ position: "relative", maxWidth: "200px" }}>
                        <input type="number" min="1" placeholder="500"
                          value={form["surface"] ?? ""}
                          onChange={(e) => setField("surface", e.target.value)}
                          className="input" style={{ paddingRight: "3rem" }}
                        />
                        <span style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "var(--text-xsoft)", pointerEvents: "none" }}>m²</span>
                      </div>
                    </div>
                    <DevisRadio label="État actuel" name="etat"
                      options={["Bien entretenu", "Entretien moyen", "Laissé à l'abandon"]}
                      value={form["etat"] ?? ""} onChange={(v) => setField("etat", v)}
                    />
                    <DevisRadio label="Accès au terrain" name="acces"
                      options={["Facile", "Chemin étroit", "Difficile"]}
                      value={form["acces"] ?? ""} onChange={(v) => setField("acces", v)}
                    />
                  </div>
                </DevisSection>

                {/* Photos */}
                <DevisSection section={SECTIONS_DEVIS[2]} open={openSection} setOpen={setOpenSection}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); handlePhotos(e.dataTransfer.files); }}
                      style={{
                        border: "2px dashed var(--gray-200)", padding: "1.75rem",
                        textAlign: "center", cursor: "pointer", background: "var(--gray-50)",
                        transition: "border-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--green)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--gray-200)")}
                    >
                      <Upload size={22} color="var(--text-xsoft)" style={{ marginBottom: "0.5rem" }} />
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 500, color: "var(--text-mid)", margin: "0 0 0.2rem" }}>
                        Glissez vos photos ou cliquez
                      </p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "var(--text-xsoft)", margin: 0 }}>
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
                            <button type="button" onClick={() => removePhoto(i)} style={{ position: "absolute", top: "3px", right: "3px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <X size={10} color="white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      <label style={labelStyle}>Description complémentaire</label>
                      <textarea rows={3} placeholder="Contraintes d'accès, souhaits particuliers..."
                        value={form["description"] ?? ""}
                        onChange={(e) => setField("description", e.target.value)}
                        className="input" style={{ resize: "vertical" }}
                      />
                    </div>
                  </div>
                </DevisSection>

                {/* Planning */}
                <DevisSection section={SECTIONS_DEVIS[3]} open={openSection} setOpen={setOpenSection}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <DevisRadio label="Type de prestation" name="typePrestation"
                      options={["Intervention unique", "Entretien régulier"]}
                      value={form["typePrestation"] ?? ""} onChange={(v) => setField("typePrestation", v)}
                    />
                    {form["typePrestation"] === "Entretien régulier" && (
                      <DevisRadio label="Fréquence souhaitée" name="frequence"
                        options={["Toutes les 2 semaines", "1 fois par mois", "1 fois tous les 2 mois", "À définir ensemble"]}
                        value={form["frequence"] ?? ""} onChange={(v) => setField("frequence", v)}
                      />
                    )}
                    <DevisRadio label="Quand souhaitez-vous qu'on intervienne ?" name="urgence"
                      options={["Dès que possible", "Dans les 2 semaines", "Dans le mois", "Pas de contrainte"]}
                      value={form["urgence"] ?? ""} onChange={(v) => setField("urgence", v)}
                    />
                    <div>
                      <label style={labelStyle}>Date souhaitée (optionnel)</label>
                      <input type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={form["dateSouhaitee"] ?? ""}
                        onChange={(e) => setField("dateSouhaitee", e.target.value)}
                        className="input" style={{ maxWidth: "200px" }}
                      />
                    </div>
                  </div>
                </DevisSection>

                {/* Erreurs */}
                {errors.length > 0 && (
                  <div style={{ background: "#FFF1F0", border: "2px solid #FF4D4F", padding: "1rem 1.25rem" }}>
                    {errors.map((e, i) => (
                      <p key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#cf1322", margin: i > 0 ? "0.25rem 0 0" : 0 }}>
                        ⚠ {e}
                      </p>
                    ))}
                  </div>
                )}

                {/* Submit */}
                <div style={{ background: "var(--black)", padding: "2rem", border: "2px solid var(--black)", boxShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.4rem" }}>
                    Prêt à envoyer ?
                  </p>
                  <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.6rem", fontWeight: 400, color: "white", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
                    Envoyer ma demande
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    Devis gratuit · Réponse sous 48h · Sans engagement
                  </p>
                  <button type="submit" disabled={sending}
                    style={{
                      background: "white", color: "var(--black)", fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem",
                      padding: "0.8rem 1.75rem", borderRadius: "100px",
                      border: "none", cursor: sending ? "wait" : "pointer",
                      opacity: sending ? 0.7 : 1,
                      display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    }}
                  >
                    {sending ? "Envoi en cours..." : "Envoyer le formulaire →"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ── AVIS CLIENTS ── */}
      <section style={{ background: "#111", padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 400, color: "white", margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>
              Les avis de nos clients
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
              Découvrez ce que nos clients pensent de nos services.
            </p>
          </div>

          {/* Grille */}
          <div className="avis-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>

            {/* Carte Google — grande */}
            <div style={{ background: "#1e1e1e", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
              <svg width="40" height="40" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.58-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              <div style={{ display: "flex", gap: "3px" }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#FBBC05", fontSize: "1.2rem" }}>★</span>)}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "white" }}>5/5</div>
              <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>
                Lire nos avis
              </a>
            </div>

            {/* Avis 1 */}
            <div style={{ background: "#1e1e1e", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#c0392b", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "white", fontSize: "0.9rem", flexShrink: 0 }}>D</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "white" }}>Daniel Delmeulle</div>
                  <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: "#FBBC05", fontSize: "0.8rem" }}>★</span>)}</div>
                </div>
                <div style={{ marginLeft: "auto", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>il y a 2 mois</div>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
                Une entreprise sérieuse, efficace… un travail bien fait (arrachage de haie morte, pose de clôture, réfection du sol en parking, dépose…
              </p>
            </div>

            {/* Avis 2 */}
            <div style={{ background: "#1e1e1e", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#555", overflow: "hidden", flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://ui-avatars.com/api/?name=Catherine+Prieto&background=7a8a7a&color=fff&size=36" alt="Catherine Prieto" width={36} height={36} />
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "white" }}>Catherine Prieto</div>
                  <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: "#FBBC05", fontSize: "0.8rem" }}>★</span>)}</div>
                </div>
                <div style={{ marginLeft: "auto", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>il y a 2 mois</div>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
                Un travail très soigné et des intervenants au top ! Ils ont transformé mon petit terrain en petit jardin dont je peux maintenant profiter.
              </p>
            </div>

            {/* Avis 3 */}
            <div style={{ background: "#1e1e1e", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#2e7d52", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "white", fontSize: "0.9rem", flexShrink: 0 }}>M</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "white" }}>Maëva</div>
                  <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: "#FBBC05", fontSize: "0.8rem" }}>★</span>)}</div>
                </div>
                <div style={{ marginLeft: "auto", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>il y a 2 mois</div>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
                Nous avons confié la création complète de notre jardin à l&apos;équipe, et nous en sommes ravis. Notre terrain en pe…
              </p>
            </div>

            {/* Avis 4 */}
            <div style={{ background: "#1e1e1e", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1a6b8a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "white", fontSize: "0.9rem", flexShrink: 0 }}>V</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "white" }}>Victoria Escaut</div>
                  <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: "#FBBC05", fontSize: "0.8rem" }}>★</span>)}</div>
                </div>
                <div style={{ marginLeft: "auto", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>il y a 3 mois</div>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
                Un grand merci pour ce superbe travail ! Notre extérieur est transformé. Très professionnel, à l&apos;écoute, disponible et passionné par s…
              </p>
            </div>

            {/* Avis 5 */}
            <div style={{ background: "#1e1e1e", borderRadius: "16px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#5a3d8a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "white", fontSize: "0.9rem", flexShrink: 0 }}>T</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "white" }}>Titi loupiac</div>
                  <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: "#FBBC05", fontSize: "0.8rem" }}>★</span>)}</div>
                </div>
                <div style={{ marginLeft: "auto", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>il y a 5 mois</div>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
                J&apos;ai fait appel à l&apos;équipe pour l&apos;élagage d&apos;un pin parasol. Rien à dire, travail sérieux et propre. Je recommande. Merc…
              </p>
            </div>

          </div>

          {/* Bouton */}
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <a href="#" style={{ display: "inline-block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 500, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px", padding: "0.65rem 1.75rem", textDecoration: "none", transition: "all 0.2s ease" }}>
              Déposer un avis
            </a>
          </div>

        </div>

        <style>{`
          @media (max-width: 900px) {
            .avis-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 580px) {
            .avis-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ background: "var(--green-dark)", padding: "5rem 2rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 400, color: "white", margin: "0 0 1rem", letterSpacing: "-0.02em" }}>
            Une question ?<br /><em style={{ fontStyle: "italic" }}>Appelez-nous.</em>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Du lundi au samedi, 8h–18h.
          </p>
          <Link href="/contact" className="btn" style={{ background: "white", color: "var(--green-dark)", fontWeight: 600, fontSize: "0.95rem", padding: "0.85rem 1.75rem", borderRadius: "100px" }}>
            Nous contacter →
          </Link>
        </div>
      </section>

      <style>{`
        /* ── Prestations bento ── */
        .prestations-bento {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          height: 580px;
        }

        /* Colonnes du milieu et droite : empilent 2 images */
        .pcard-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pcard-col .pcard {
          flex: 1;
        }

        /* Grande image gauche — toute la hauteur */
        .pcard--tall {
          height: 100%;
        }

        /* Base card */
        .pcard {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          display: block;
          background: rgba(255,255,255,0.04);
        }

        .pcard__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: block;
        }

        .pcard:hover .pcard__img {
          transform: scale(1.05);
        }

        /* Overlay — invisible au repos, apparaît au hover */
        .pcard__hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 24, 8, 0);
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
          transition: background 0.35s ease;
        }

        .pcard:hover .pcard__hover-overlay {
          background: rgba(10, 24, 8, 0.62);
        }

        /* Titre — caché au repos, apparaît au hover */
        .pcard__hover-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.25rem;
          font-weight: 400;
          color: white;
          letter-spacing: -0.01em;
          line-height: 1.2;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .pcard:hover .pcard__hover-title {
          opacity: 1;
          transform: translateY(0);
        }

        .pcard--tall .pcard__hover-title {
          font-size: 1.5rem;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .prestations-bento {
            grid-template-columns: 1fr 1fr;
            height: auto;
          }
          .pcard--tall { height: 320px; grid-column: 1 / 3; }
          .pcard-col { flex-direction: row; }
          .pcard-col .pcard { height: 220px; }
          .zone-grid { grid-template-columns: 1fr !important; }
          .zone-info-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 580px) {
          .prestations-bento { grid-template-columns: 1fr 1fr; gap: 8px; }
          .pcard--tall { height: 240px; grid-column: 1 / 3; }
          .pcard-col { flex-direction: row; }
          .pcard-col .pcard { height: 160px; }
          .coords-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

/* ── Composants utilitaires form ── */

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.76rem",
  fontWeight: 600,
  color: "var(--text-mid)",
  marginBottom: "0.4rem",
};

function DevisField({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} className="input" />
    </div>
  );
}

function DevisRadio({ label, name, options, value, onChange }: {
  label: string; name: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
        {options.map((opt) => (
          <label key={opt} style={{
            display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.86rem",
            color: value === opt ? "var(--black)" : "var(--text-soft)",
            fontWeight: value === opt ? 500 : 400,
          }}>
            <input type="radio" name={name} value={opt} checked={value === opt}
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

function DevisSection({ section, open, setOpen, children }: {
  section: { id: string; emoji: string; title: string; subtitle: string };
  open: string; setOpen: (id: string) => void; children: React.ReactNode;
}) {
  const isOpen = open === section.id;
  return (
    <div style={{ background: "white", border: "2px solid var(--black)", boxShadow: "4px 4px 0 var(--black)", overflow: "hidden" }}>
      <button type="button" onClick={() => setOpen(isOpen ? "" : section.id)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "1rem",
          padding: "1.1rem 1.5rem", background: isOpen ? "var(--gray-50)" : "white",
          border: "none", cursor: "pointer", textAlign: "left",
          borderBottom: isOpen ? "2px solid var(--black)" : "none",
        }}
      >
        <span style={{
          width: "38px", height: "38px",
          background: "var(--green-light)",
          border: "2px solid var(--black)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem", flexShrink: 0,
        }}>
          {section.emoji}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "var(--black)", margin: 0, lineHeight: 1.2 }}>
            {section.title}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "var(--text-xsoft)", margin: 0 }}>
            {section.subtitle}
          </p>
        </div>
        {isOpen ? <ChevronUp size={18} color="var(--text-soft)" /> : <ChevronDown size={18} color="var(--text-soft)" />}
      </button>
      {isOpen && (
        <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
          {children}
        </div>
      )}
    </div>
  );
}
