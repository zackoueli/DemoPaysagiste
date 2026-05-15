import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
  const filename = `articles/cover-${Date.now()}.${ext}`;

  const fileRef = bucket.file(filename);
  await fileRef.save(buffer, { metadata: { contentType: file.type || "image/jpeg" } });
  await fileRef.makePublic();

  const url = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filename}`;
  return NextResponse.json({ success: true, url });
}
