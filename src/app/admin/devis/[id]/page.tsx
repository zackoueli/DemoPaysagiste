import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import Link from "next/link";
import DevisDetail from "./DevisDetail";

export const dynamic = "force-dynamic";

export default async function DevisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const doc = await db.collection("devis").doc(id).get();
  if (!doc.exists) notFound();

  const data = doc.data()!;
  const services = JSON.parse((data.typesTravaux as string) || "[]") as string[];
  const photos = JSON.parse((data.photos as string) || "[]") as string[];

  return (
    <div style={{ padding: "2.5rem", maxWidth: "900px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/devis" style={{ fontSize: "0.85rem", color: "var(--green)", textDecoration: "none" }}>← Retour aux devis</Link>
      </div>
      <DevisDetail devis={{
        id,
        nom: data.nom as string,
        prenom: data.prenom as string,
        email: data.email as string,
        telephone: data.telephone as string,
        adresse: data.adresse as string,
        surface: data.surface as number,
        services,
        photos,
        description: (data.description as string) || null,
        dateSouhaitee: (data.dateSouhaitee as string) || null,
        statut: data.statut as string,
        noteAdmin: (data.noteAdmin as string) || null,
        dateIntervention: (data.dateIntervention as string) || null,
        createdAt: data.createdAt as string,
      }} />
    </div>
  );
}
