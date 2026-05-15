import type { Metadata } from "next";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Réalisations",
  description: "Découvrez les réalisations de Demo Paysagiste : photos de nos chantiers d'entretien de jardins, élagage, débroussaillage à Biscarrosse.",
};

export default function RealisationsPage() {
  return (
    <>
      <section style={{ maxWidth: "1140px", margin: "0 auto", padding: "120px 2rem 60px" }}>
        <span className="badge-green" style={{ marginBottom: "1rem", display: "inline-block" }}>Photos & chantiers</span>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 400, margin: "0 0 1.5rem", letterSpacing: "-0.02em", lineHeight: 1.05, maxWidth: "600px" }}>
          Nos<br /><em style={{ fontStyle: "italic" }}>réalisations</em>
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "var(--text-soft)", lineHeight: 1.7, maxWidth: "440px" }}>
          Avant/après, chantiers terminés, réalisations locales — découvrez notre travail en images.
        </p>
      </section>

      <section style={{ borderTop: "1px solid var(--gray-100)", padding: "5rem 2rem 6rem" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <div style={{
            textAlign: "center", padding: "5rem 2rem",
            background: "white", border: "1px dashed var(--gray-200)", borderRadius: "16px",
          }}>
            <div style={{
              width: "60px", height: "60px", background: "var(--green-light)",
              borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}>
              <ImageIcon size={26} color="var(--green-dark)" strokeWidth={1.6} />
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.75rem", fontWeight: 400, color: "var(--black)", marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
              La galerie arrive bientôt
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--text-soft)", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 2rem" }}>
              Nous alimentons régulièrement notre galerie. En attendant, suivez-nous sur Instagram pour voir nos réalisations.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://www.instagram.com/lmgreenservices/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)", color: "white", fontSize: "0.875rem", borderRadius: "100px" }}
              >
                Voir sur Instagram
              </a>
              <Link href="/devis" className="btn btn-outline" style={{ fontSize: "0.875rem" }}>
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
