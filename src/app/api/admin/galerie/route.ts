import { NextRequest, NextResponse } from "next/server";
import { db, bucket } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("photo") as File;
  const alt = (formData.get("alt") as string) || "";

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `galerie/${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg"}`;

  const fileRef = bucket.file(filename);
  await fileRef.save(buffer, { metadata: { contentType: file.type || "image/jpeg" } });
  await fileRef.makePublic();

  const url = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filename}`;

  const docRef = await db.collection("photos").add({
    url,
    alt,
    ordre: Date.now(),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, photo: { id: docRef.id, url, alt } });
}
