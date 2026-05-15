import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const updatedAt = new Date().toISOString();

  const update: Record<string, unknown> = { updatedAt };
  if (data.titre !== undefined) update.titre = data.titre;
  if (data.slug !== undefined) update.slug = data.slug;
  if (data.contenu !== undefined) update.contenu = data.contenu;
  if (data.extrait !== undefined) update.extrait = data.extrait || null;
  if (data.imageUrl !== undefined) update.imageUrl = data.imageUrl || null;
  if (data.publie !== undefined) update.publie = data.publie;

  await db.collection("articles").doc(id).update(update);

  const doc = await db.collection("articles").doc(id).get();
  const article = { id, ...doc.data() };

  return NextResponse.json({ success: true, article });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.collection("articles").doc(id).delete();
  return NextResponse.json({ success: true });
}
