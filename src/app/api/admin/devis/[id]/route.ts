import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { statut, noteAdmin, dateIntervention } = await req.json();

  const update: Record<string, unknown> = {};
  if (statut !== undefined) update.statut = statut;
  if (noteAdmin !== undefined) update.noteAdmin = noteAdmin;
  update.dateIntervention = dateIntervention || null;

  await db.collection("devis").doc(id).update(update);

  if (dateIntervention) {
    const devisDoc = await db.collection("devis").doc(id).get();
    const devis = devisDoc.data()!;
    const titre = `Chantier — ${devis.prenom} ${devis.nom}`;
    const description = `${devis.adresse} · ${devis.surface} m²`;

    // Chercher un chantier existant lié à ce devis
    const existing = await db.collection("chantiers").where("devisId", "==", id).limit(1).get();
    if (!existing.empty) {
      await existing.docs[0].ref.update({ titre, description, date: dateIntervention });
    } else {
      await db.collection("chantiers").add({
        titre,
        description,
        date: dateIntervention,
        devisId: id,
        couleur: "#3A6B35",
        createdAt: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({ success: true });
}
