import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const now = new Date().toISOString();

  const docRef = await db.collection("articles").add({
    titre: data.titre,
    slug: data.slug,
    contenu: data.contenu,
    extrait: data.extrait || null,
    imageUrl: data.imageUrl || null,
    publie: data.publie || false,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ success: true, article: { id: docRef.id, ...data, createdAt: now, updatedAt: now } });
}
