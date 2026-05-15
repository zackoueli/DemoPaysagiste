import { NextRequest, NextResponse } from "next/server";
import { db, bucket } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("video") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "mp4";
  const filename = `hero/hero-video-${Date.now()}.${ext}`;

  const fileRef = bucket.file(filename);
  await fileRef.save(buffer, { metadata: { contentType: file.type || "video/mp4" } });
  await fileRef.makePublic();

  const url = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filename}`;

  await db.collection("settings").doc("hero_video_url").set({ value: url });

  return NextResponse.json({ success: true, url });
}
