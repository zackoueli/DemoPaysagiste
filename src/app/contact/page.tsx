export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { db } from "@/lib/firebase";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Demo Paysagiste à Biscarrosse — devis gratuit, réponse sous 48h.",
};

export default async function ContactPage() {
  const doc = await db.collection("settings").doc("hero_video_url").get();
  const videoUrl = doc.exists ? (doc.data()?.value as string) : "";
  return <ContactClient videoUrl={videoUrl} />;
}
