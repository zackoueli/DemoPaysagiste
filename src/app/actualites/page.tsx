export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { Newspaper, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Actualités et conseils jardinage de Demo Paysagiste, paysagiste à Biscarrosse.",
};

export default async function ActualitesPage() {
  const [articlesSnap, settingsSnap] = await Promise.all([
    db.collection("articles").orderBy("createdAt", "desc").get(),
    db.collection("settings").doc("hero_video_url").get(),
  ]);

  const articles = articlesSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((d) => (d as Record<string, unknown>).publie === true) as {
      id: string; slug: string; imageUrl: string | null; titre: string; extrait: string | null; createdAt: string;
    }[];

  const videoUrl = settingsSnap.exists ? (settingsSnap.data()?.value as string) : "";

  return (
    <>
      {/* ── HERO avec vidéo ── */}
      <section style={{ position: "relative", minHeight: "520px", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {/* Vidéo ou fallback */}
        {videoUrl ? (
          <video
            autoPlay muted loop playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
            src={videoUrl}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "var(--green-dark)", zIndex: 0 }} />
        )}
        {/* Overlay dégradé */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)", zIndex: 1 }} />

        {/* Contenu */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1140px", margin: "0 auto", width: "100%", padding: "8rem 2rem 5rem" }}>
          <span style={{ display: "inline-block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
            Conseils & actualités
          </span>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 400, color: "white", margin: "0 0 1.25rem", letterSpacing: "-0.02em", lineHeight: 1.05, maxWidth: "680px" }}>
            Le blog<br /><em style={{ fontStyle: "italic" }}>Demo Paysagiste</em>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "440px", margin: 0 }}>
            Conseils jardin, actualités locales et informations sur nos services.
          </p>
        </div>
      </section>

      {/* ── GRILLE ARTICLES ── */}
      <section style={{ padding: "5rem 2rem 7rem", background: "#f7f9f7" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          {articles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 2rem", background: "white", border: "1px dashed #ddeedd", borderRadius: "20px" }}>
              <div style={{ width: "60px", height: "60px", background: "#f0f9ef", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <Newspaper size={26} color="#3a7a34" strokeWidth={1.6} />
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.75rem", fontWeight: 400, color: "#1a2e19", marginBottom: "0.75rem" }}>
                Les articles arrivent bientôt
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#7a9e76", lineHeight: 1.7, maxWidth: "380px", margin: "0 auto 2rem" }}>
                Nous publierons prochainement des conseils sur l&apos;entretien de vos espaces verts.
              </p>
              <Link href="/contact" className="btn btn-green">Nous contacter</Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
              {articles.map((article) => (
                <Link key={article.id} href={`/actualites/${article.slug}`} style={{ textDecoration: "none" }} className="article-card-link">
                  <article style={{
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid #eaf0ea",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  }} className="article-card">

                    {/* Image */}
                    <div style={{ position: "relative", height: "220px", overflow: "hidden", background: "#1e4d1a", flexShrink: 0 }}>
                      {article.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.imageUrl}
                          alt={article.titre}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", display: "block" }}
                          className="article-card-img"
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Newspaper size={36} color="rgba(255,255,255,0.15)" strokeWidth={1.4} />
                        </div>
                      )}
                      {/* Overlay sombre au survol */}
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.3s ease" }} className="article-card-overlay" />
                    </div>

                    {/* Contenu */}
                    <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#8aab86", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                        {new Date(article.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.25rem", fontWeight: 400, color: "#1a2e19", marginBottom: "0.65rem", lineHeight: 1.3, letterSpacing: "-0.01em", flex: 1 }}>
                        {article.titre}
                      </h3>
                      {article.extrait && (
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.84rem", color: "#7a9e76", lineHeight: 1.65, margin: "0 0 1.25rem" }}>
                          {article.extrait}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500, color: "#3a7a34", marginTop: "auto" }}>
                        Lire l&apos;article <ArrowRight size={13} />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .article-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(30,77,26,0.12);
        }
        .article-card:hover .article-card-img {
          transform: scale(1.04);
        }
        .article-card:hover .article-card-overlay {
          background: rgba(0,0,0,0.18) !important;
        }
      `}</style>
    </>
  );
}
