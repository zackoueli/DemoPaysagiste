import { NextRequest, NextResponse } from "next/server";
import { db, bucket } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("photo") as File;
  const serviceKey = (formData.get("serviceKey") as string) || "";

  if (!file || !serviceKey) {
    return NextResponse.json({ error: "Missing file or serviceKey" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
  const filename = `prestations/${serviceKey}-${Date.now()}.${ext}`;

  const fileRef = bucket.file(filename);
  await fileRef.save(buffer, { metadata: { contentType: file.type || "image/jpeg" } });
  await fileRef.makePublic();

  const url = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filename}`;

  await db.collection("settings").doc(`prestation_img_${serviceKey}`).set({ value: url });

  return NextResponse.json({ success: true, url });
}
