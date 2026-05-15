export const dynamic = "force-dynamic";

import { db } from "@/lib/firebase";
import HomeClient from "./HomeClient";

const SERVICES_BASE = [
  { key: "tonte",           title: "Tonte de pelouse",   desc: "Tonte régulière ou ponctuelle, finitions bords inclus.",        defaultImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { key: "elagage",         title: "Élagage & haies",    desc: "Taille précise pour haies, arbustes et arbres.",                defaultImg: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" },
  { key: "debroussaillage", title: "Débroussaillage",    desc: "Remise en état de terrains envahis, zones DFCI.",              defaultImg: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&q=80" },
  { key: "nettoyage",       title: "Nettoyage façades",  desc: "Haute pression, démoussage toitures et façades.",              defaultImg: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80" },
  { key: "entretien",       title: "Entretien jardins",  desc: "Contrats annuels, désherbage, plantation, massifs.",           defaultImg: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" },
  { key: "bois",            title: "Bois de chauffage",  desc: "Coupe, fendage, bûches 33 ou 50 cm, livraison.",              defaultImg: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" },
];

export default async function HomePage() {
  const snap = await db.collection("settings").get();
  const settingsMap: Record<string, string> = {};
  snap.forEach((doc) => { settingsMap[doc.id] = doc.data().value; });

  const heroVideoUrl = settingsMap["hero_video_url"] ?? "";

  const services = SERVICES_BASE.map(({ key, title, desc, defaultImg }) => ({
    title,
    desc,
    img: settingsMap[`prestation_img_${key}`] || defaultImg,
  }));

  return <HomeClient heroVideoUrl={heroVideoUrl} services={services} />;
}
