import type { Metadata } from "next";
import AdminNav from "@/components/AdminNav";

export const metadata: Metadata = {
  title: { default: "Admin — Demo Paysagiste", template: "%s | Admin Demo Paysagiste" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Neutralise le Header/Footer du root layout pour toutes les pages admin */}
      <style>{`
        body > header, body > footer { display: none !important; }
        body > main { padding-top: 0 !important; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#f4f6f4", display: "flex" }}>
        <AdminNav />
        <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
      </div>
    </>
  );
}
