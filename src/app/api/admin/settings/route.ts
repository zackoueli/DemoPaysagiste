import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET() {
  const snapshot = await db.collection("settings").get();
  const map: Record<string, string> = {};
  snapshot.forEach((doc) => { map[doc.id] = doc.data().value; });
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, string>;
  const batch = db.batch();
  for (const [key, value] of Object.entries(body)) {
    batch.set(db.collection("settings").doc(key), { value });
  }
  await batch.commit();
  return NextResponse.json({ ok: true });
}
