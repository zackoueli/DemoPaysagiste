import { NextRequest, NextResponse } from "next/server";
import { db, bucket } from "@/lib/firebase";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const doc = await db.collection("photos").doc(id).get();
  if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = doc.data()!;

  // Supprimer le fichier dans Storage
  try {
    const url: string = data.url;
    const storagePath = url.split(`${process.env.FIREBASE_STORAGE_BUCKET}/`)[1];
    if (storagePath) await bucket.file(storagePath).delete();
  } catch {
    // fichier déjà supprimé ou inexistant
  }

  await db.collection("photos").doc(id).delete();

  return NextResponse.json({ success: true });
}
