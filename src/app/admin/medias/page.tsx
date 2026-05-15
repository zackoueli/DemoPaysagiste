import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/firebase";
import MediasAdmin from "./MediasAdmin";

export const dynamic = "force-dynamic";

export default async function AdminMediasPage() {
  await requireAdmin();

  const [settingsSnap, photosSnap] = await Promise.all([
    db.collection("settings").get(),
    db.collection("photos").orderBy("ordre", "asc").get(),
  ]);

  const settings: Record<string, string> = {};
  settingsSnap.forEach((doc) => { settings[doc.id] = doc.data().value; });

  const photos = photosSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as {
    id: string; url: string; alt: string | null; ordre: number;
  }[];

  return <MediasAdmin initialSettings={settings} initialPhotos={photos} />;
}
