export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Scissors, Flame, Droplets, Wind, Trees, Trash2, Home } from "lucide-react";
import { db } from "@/lib/firebase";

export const metadata: Metadata = {
  title: "Prestations",
  description:
    "Découvrez toutes les prestations de Demo Paysagiste : tonte, élagage, débroussaillage, nettoyage à Biscarrosse.",
};

const SERVICES = [
  {
    key: "tonte",
    icon: Leaf,
    title: "Tonte de pelouse",
    accroche: "Un gazon impeccable, sans effort.",
    desc: "Tonte régulière ou ponctuelle avec ramassage inclus. Finitions bords et bordures soignées. Adapté à toutes surfaces.",
    details: ["Tonte régulière ou ponctuelle", "Ramassage des tontes inclus", "Finitions bords et bordures", "Conseils entretien pelouse"],
    defaultImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    key: "elagage",
    icon: Scissors,
    title: "Élagage & taille de haies",
    accroche: "Vos haies, toujours dans leur forme.",
    desc: "Taille précise de haies, arbustes et arbres. Respect des périodes de taille pour favoriser la repousse.",
    details: ["Taille toutes hauteurs", "Élagage et branches dangereuses", "Rognage de souches", "Traitement après taille"],
    defaultImg: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
  {
    key: "debroussaillage",
    icon: Wind,
    title: "Débroussaillage",
    accroche: "Votre terrain retrouve son potentiel.",
    desc: "Remise en état de terrains envahis. Intervention sur zones difficiles d'accès et zones à risque incendie (DFCI).",
    details: ["Terrains laissés à l'abandon", "Zones difficiles d'accès", "Zones DFCI", "Évacuation des végétaux"],
    defaultImg: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80",
  },
  {
    key: "nettoyage",
    icon: Home,
    title: "Nettoyage de bâtiments",
    accroche: "Bâtiments propres et valorisés.",
    desc: "Nettoyage professionnel intérieur et extérieur. Haute pression, démoussage toiture, traitement anti-mousse.",
    details: ["Façades et murs extérieurs", "Nettoyage intérieur après chantier", "Démoussage de toitures", "Traitement anti-mousse"],
    defaultImg: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
  },
  {
    key: "entretien",
    icon: Droplets,
    title: "Entretien de jardins",
    accroche: "Votre jardin, entre de bonnes mains.",
    desc: "Entretien complet tout au long de l'année. Contrats annuels disponibles, désherbage, plantation, massifs.",
    details: ["Contrats annuels", "Désherbage et traitement", "Plantation et massifs", "Arrosage et fertilisation"],
    defaultImg: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
  {
    key: "bois",
    icon: Flame,
    title: "Bois de chauffage",
    accroche: "Préparez vos hivers en avance.",
    desc: "Coupe, fendage et livraison. Bois locaux et secs, bûches calibrées 33 ou 50 cm.",
    details: ["Feuillus et résineux", "Bûches 33 ou 50 cm", "Livraison et rangement possible", "Bois secs garantis"],
    defaultImg: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
  },
  {
    key: "evacuation",
    icon: Trash2,
    title: "Évacuation déchets verts",
    accroche: "Plus de déchets qui traînent.",
    desc: "Collecte et évacuation complète. Transport en déchetterie ou plateforme de compostage agréée.",
    details: ["Branches, tontes, feuilles", "Chargement inclus", "Transport en filière agréée", "Intervention rapide"],
    defaultImg: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
  {
    key: "terrasses",
    icon: Trees,
    title: "Terrasses & façades",
    accroche: "L'éclat retrouvé de vos extérieurs.",
    desc: "Nettoyage haute pression carrelage, bois, béton. Élimination mousses, lichens et salissures tenaces.",
    details: ["Nettoyage haute pression", "Carrelage, bois, béton", "Murs et murets", "Traitement anti-mousse durable"],
    defaultImg: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
  },
];

export default async function PrestationsPage() {
  const snap = await db.collection("settings").get();
  const settingsMap: Record<string, string> = {};
  snap.forEach((doc) => { settingsMap[doc.id] = doc.data().value; });

  const services = SERVICES.map((s) => ({
    ...s,
    img: settingsMap[`prestation_img_${s.key}`] || s.defaultImg,
  }));

  const videoUrl = settingsMap["hero_video_url"] || "";

  return (
    <>
      {/* ── HERO avec vidéo ── */}
      <section style={{ position: "relative", minHeight: "520px", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {videoUrl ? (
          <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} src={videoUrl} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "var(--green-dark)", zIndex: 0 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1140px", margin: "0 auto", width: "100%", padding: "8rem 2rem 5rem" }}>
          <span style={{ display: "inline-block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
            Biscarrosse & Landes
          </span>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 400, color: "white", margin: "0 0 1.25rem", letterSpacing: "-0.02em", lineHeight: 1.05, maxWidth: "700px" }}>
            Toutes nos<br /><em style={{ fontStyle: "italic" }}>prestations</em>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "480px", marginBottom: "2rem" }}>
            Du jardin au bâtiment, nous intervenons sur tous vos espaces extérieurs à Biscarrosse et alentours.
          </p>
          <Link href="/#devis" className="btn" style={{ background: "white", color: "var(--green-dark)", fontWeight: 600, borderRadius: "100px" }}>
            Demander un devis gratuit →
          </Link>
        </div>
      </section>

      {/* Services */}
      <section style={{ background: "var(--cream)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
          {services.map((service, i) => {
            const Icon = service.icon;
            const imgLeft = i % 2 === 0;
            return (
              <div key={service.title} style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "380px 1fr",
                minHeight: "280px",
                border: "1px solid var(--gray-100)",
              }} className="service-card">

                {/* Photo */}
                {imgLeft && (
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.img}
                      alt={service.title}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}

                {/* Contenu */}
                <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", background: "var(--green-light)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={19} color="var(--green-dark)" strokeWidth={1.7} />
                    </div>
                    <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.55rem", fontWeight: 400, color: "var(--black)", margin: 0, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                      {service.title}
                    </h2>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "var(--green)", fontStyle: "italic", margin: "0 0 0.65rem" }}>
                    {service.accroche}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--text-soft)", lineHeight: 1.8, marginBottom: "1.1rem" }}>
                    {service.desc}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "0.4rem 1.25rem" }}>
                    {service.details.map((detail: string) => (
                      <li key={detail} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "var(--text-mid)" }}>
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--green-mid)", flexShrink: 0 }} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Photo côté droit */}
                {!imgLeft && (
                  <div style={{ position: "relative", overflow: "hidden", order: 1 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.img}
                      alt={service.title}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--green-dark)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, color: "white", margin: "0 0 1rem", letterSpacing: "-0.02em" }}>
            Une demande spécifique ?
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Nous étudions toutes les demandes. Contactez-nous directement.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn" style={{ background: "white", color: "var(--green-dark)", fontWeight: 600, borderRadius: "100px" }}>
              Nous contacter
            </Link>
            <Link href="/#devis" className="btn" style={{ background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: "100px" }}>
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 820px) {
          .service-card {
            grid-template-columns: 1fr !important;
          }
          .service-card > div[style*="order: 1"] {
            order: -1 !important;
            min-height: 200px;
          }
          .service-card > div:first-child {
            min-height: 200px;
          }
        }
      `}</style>
    </>
  );
}
