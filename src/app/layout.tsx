import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Demo Paysagiste — Paysagiste à Biscarrosse",
    template: "%s | Demo Paysagiste",
  },
  description:
    "Demo Paysagiste, votre paysagiste professionnel à Biscarrosse et alentours. Tonte, élagage, débroussaillage, entretien de jardins, nettoyage de terrasses. Devis gratuit en ligne.",
  keywords: [
    "paysagiste Biscarrosse",
    "entretien jardin Biscarrosse",
    "tonte pelouse Biscarrosse",
    "élagage Biscarrosse",
    "débroussaillage Landes",
    "nettoyage terrasse Biscarrosse",
    "Demo Paysagiste",
    "jardinage Biscarrosse",
  ],
  authors: [{ name: "Demo Paysagiste" }],
  creator: "Demo Paysagiste",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Demo Paysagiste",
    title: "Demo Paysagiste — Paysagiste à Biscarrosse",
    description:
      "Votre paysagiste professionnel à Biscarrosse et alentours. Tonte, élagage, débroussaillage, entretien de jardins. Devis gratuit en ligne.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
