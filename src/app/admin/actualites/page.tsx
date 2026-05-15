import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/firebase";
import ActualitesAdmin from "./ActualitesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminActualitesPage() {
  await requireAdmin();
  const snap = await db.collection("articles").orderBy("createdAt", "desc").get();
  const articles = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as {
    id: string; titre: string; slug: string; contenu: string;
    extrait: string | null; imageUrl: string | null; publie: boolean;
    createdAt: string; updatedAt: string;
  }[];

  return (
    <div style={{ padding: "2.5rem" }}>
      <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.75rem", fontWeight: 400, color: "var(--black)", marginBottom: "0.25rem" }}>
        Actualités & blog
      </h1>
      <p style={{ fontSize: "0.875rem", color: "var(--text-xsoft)", marginBottom: "2rem" }}>
        Créez et gérez vos articles. Les articles publiés apparaissent sur la page Actualités.
      </p>
      <ActualitesAdmin initialArticles={articles} />
    </div>
  );
}
