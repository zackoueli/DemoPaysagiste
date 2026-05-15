export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { ArrowLeft, Calendar } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const snap = await db.collection("articles").where("slug", "==", slug).limit(1).get();
  if (snap.empty) return { title: "Article introuvable" };
  const article = snap.docs[0].data();
  return {
    title: article.titre,
    description: article.extrait || undefined,
    openGraph: article.imageUrl ? { images: [article.imageUrl] } : undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const snap = await db.collection("articles").where("slug", "==", slug).limit(1).get();

  if (snap.empty) notFound();

  const article = { id: snap.docs[0].id, ...snap.docs[0].data() } as {
    id: string; titre: string; slug: string; contenu: string;
    extrait: string | null; imageUrl: string | null; publie: boolean; createdAt: string;
  };

  if (!article.publie) notFound();

  const paragraphs = article.contenu.split("\n").filter((l) => l.trim() !== "");

  return (
    <>
      {/* Hero image ou bannière verte */}
      {article.imageUrl ? (
        <div style={{ height: "420px", background: `url(${article.imageUrl}) center/cover no-repeat`, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.55))" }} />
        </div>
      ) : (
        <div style={{ height: "220px", background: "var(--green-dark)" }} />
      )}

      <main style={{ maxWidth: "780px", margin: "0 auto", padding: "0 2rem 6rem" }}>
        {/* Back */}
        <div style={{ paddingTop: "2.5rem", marginBottom: "2rem" }}>
          <Link href="/actualites" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "var(--text-soft)", textDecoration: "none" }}>
            <ArrowLeft size={14} /> Retour aux actualités
          </Link>
        </div>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <Calendar size={13} color="var(--text-xsoft)" />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "var(--text-xsoft)" }}>
            {new Date(article.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Titre */}
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 400, color: "var(--black)", margin: "0 0 1.25rem", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          {article.titre}
        </h1>

        {/* Extrait */}
        {article.extrait && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "var(--text-soft)", lineHeight: 1.7, margin: "0 0 2.5rem", borderLeft: "3px solid var(--green)", paddingLeft: "1.25rem" }}>
            {article.extrait}
          </p>
        )}

        {/* Séparateur */}
        <div style={{ height: "1px", background: "var(--gray-100)", marginBottom: "2.5rem" }} />

        {/* Contenu */}
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "var(--text-soft)", lineHeight: 1.8 }}>
          {paragraphs.map((para, i) => {
            if (para.startsWith("**") && para.endsWith("**")) {
              return (
                <h2 key={i} style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--black)", margin: "2rem 0 0.75rem", letterSpacing: "-0.01em" }}>
                  {para.replace(/\*\*/g, "")}
                </h2>
              );
            }
            return <p key={i} style={{ margin: "0 0 1.25rem" }}>{para}</p>;
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: "3rem", padding: "2rem", background: "var(--green-light)", borderRadius: "16px", border: "1px solid var(--gray-100)" }}>
          <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.25rem", color: "var(--black)", margin: "0 0 1rem" }}>
            Besoin d&apos;un devis gratuit ?
          </p>
          <Link href="/devis" className="btn btn-green">Demander un devis →</Link>
        </div>
      </main>
    </>
  );
}
