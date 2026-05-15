"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const contactInfo = [
  { icon: Phone, label: "Téléphone", value: "+33 6 00 00 00 00", href: "tel:+33600000000" },
  { icon: Mail, label: "Email", value: "contact@demopaysagiste.fr", href: "mailto:contact@demopaysagiste.fr" },
  { icon: MapPin, label: "Zone d'intervention", value: "Biscarrosse & alentours, Landes (40)", href: null },
  { icon: Clock, label: "Horaires", value: "Lun – Sam : 8h00 – 18h00", href: null },
];

export default function ContactClient({ videoUrl }: { videoUrl: string }) {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
  };

  return (
    <>
      {/* ── HERO vidéo ── */}
      <section style={{ position: "relative", minHeight: "480px", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {videoUrl ? (
          <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} src={videoUrl} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "var(--green-dark)", zIndex: 0 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1140px", margin: "0 auto", width: "100%", padding: "8rem 2rem 5rem" }}>
          <span style={{ display: "inline-block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
            Demo Paysagiste
          </span>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 400, color: "white", margin: "0 0 1.25rem", letterSpacing: "-0.02em", lineHeight: 1.05, maxWidth: "600px" }}>
            Parlons de<br /><em style={{ fontStyle: "italic" }}>votre projet</em>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "440px", margin: 0 }}>
            Une question ou un projet ? Réponse garantie sous 48h.
          </p>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <section style={{ background: "#f7f9f7" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "5rem 2rem 7rem", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "5rem", alignItems: "start" }} className="contact-grid">

          {/* Colonne gauche */}
          <div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.5rem", fontWeight: 400, color: "#1a2e19", margin: "0 0 0.75rem", letterSpacing: "-0.01em" }}>
              Coordonnées
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#7a9e76", lineHeight: 1.7, marginBottom: "2rem" }}>
              Du lundi au samedi, de 8h à 18h.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start" }}>
                    <div style={{ width: "38px", height: "38px", background: "#e8f5e6", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={15} color="#3a7a34" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8aab86", marginBottom: "0.15rem" }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#1a2e19", textDecoration: "none" }}>
                          {item.value}
                        </a>
                      ) : (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#5a7a57" }}>{item.value}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <a href="https://www.instagram.com/demopaysagiste/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#5a7a57", textDecoration: "none", border: "1.5px solid #ddeedd", borderRadius: "100px", padding: "0.5rem 1rem", marginBottom: "1.5rem", transition: "all 0.15s ease" }}>
              <InstagramIcon size={14} />
              @demopaysagiste
            </a>

            <div style={{ background: "#1e4d1a", borderRadius: "16px", padding: "1.75rem" }}>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.2rem", fontWeight: 400, color: "white", marginBottom: "0.5rem" }}>
                Besoin d&apos;un devis ?
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                Notre formulaire en ligne est rapide et gratuit.
              </p>
              <Link href="/devis" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "white", color: "#1e4d1a", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem", padding: "0.6rem 1.25rem", borderRadius: "100px", textDecoration: "none" }}>
                Demander un devis →
              </Link>
            </div>
          </div>

          {/* Colonne droite */}
          <div>
            <div style={{ background: "white", border: "1px solid #eaf0ea", borderRadius: "20px", padding: "2.5rem", marginBottom: "1.5rem", boxShadow: "0 4px 32px rgba(30,77,26,0.06)" }}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.5rem", fontWeight: 400, color: "#1a2e19", margin: "0 0 1.75rem", letterSpacing: "-0.01em" }}>
                Envoyer un message
              </h2>

              {sent ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ width: "52px", height: "52px", background: "#e8f5e6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M1 8L7 14L19 1" stroke="#3a7a34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#1a2e19", marginBottom: "0.4rem" }}>Message envoyé !</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#7a9e76" }}>Nous vous répondrons dans les 48h.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="form-cols">
                    <div>
                      <label style={labelStyle}>Nom *</label>
                      <input type="text" required placeholder="Martin Dupont" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#3a7a34")} onBlur={(e) => (e.target.style.borderColor = "#ddeedd")} />
                    </div>
                    <div>
                      <label style={labelStyle}>Téléphone</label>
                      <input type="tel" placeholder="06 00 00 00 00" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#3a7a34")} onBlur={(e) => (e.target.style.borderColor = "#ddeedd")} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" required placeholder="votre@email.fr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#3a7a34")} onBlur={(e) => (e.target.style.borderColor = "#ddeedd")} />
                  </div>
                  <div>
                    <label style={labelStyle}>Message *</label>
                    <textarea required rows={5} placeholder="Décrivez votre demande..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => (e.target.style.borderColor = "#3a7a34")} onBlur={(e) => (e.target.style.borderColor = "#ddeedd")} />
                  </div>
                  <button type="submit" disabled={sending} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8rem 1.5rem", background: "#1e4d1a", color: "white", border: "none", borderRadius: "12px", cursor: sending ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 500, opacity: sending ? 0.7 : 1, transition: "opacity 0.15s ease" }}>
                    {sending ? "Envoi en cours…" : <><Send size={14} /> Envoyer le message</>}
                  </button>
                </form>
              )}
            </div>

            <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #eaf0ea", height: "240px" }}>
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-1.2647%2C44.3539%2C-1.0647%2C44.4339&layer=mapnik&marker=44.3939%2C-1.1647"
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Demo Paysagiste — Biscarrosse"
              />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .form-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.7rem",
  fontWeight: 700,
  color: "#8aab86",
  marginBottom: "0.35rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  border: "1.5px solid #ddeedd",
  borderRadius: "12px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "#1a2e19",
  background: "#fafcfa",
  outline: "none",
  transition: "border-color 0.15s ease",
  boxSizing: "border-box",
};
