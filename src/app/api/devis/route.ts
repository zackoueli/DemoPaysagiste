import { NextRequest, NextResponse } from "next/server";
import { db, bucket } from "@/lib/firebase";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nom = formData.get("nom") as string;
    const prenom = formData.get("prenom") as string;
    const email = formData.get("email") as string;
    const telephone = formData.get("telephone") as string;
    const adresse = formData.get("adresse") as string;
    const surface = parseFloat(formData.get("surface") as string);
    const typesTravaux = formData.get("typesTravaux") as string;
    const description = (formData.get("description") as string) || "";
    const dateSouhaitee = (formData.get("dateSouhaitee") as string) || "";

    // Upload photos vers Firebase Storage
    const photoFiles = formData.getAll("photos") as File[];
    const photoUrls: string[] = [];

    for (const file of photoFiles) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
        const filename = `devis/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const fileRef = bucket.file(filename);
        await fileRef.save(buffer, { metadata: { contentType: file.type || "image/jpeg" } });
        await fileRef.makePublic();
        photoUrls.push(`https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filename}`);
      }
    }

    // Sauvegarder dans Firestore
    const docRef = await db.collection("devis").add({
      nom,
      prenom,
      email,
      telephone,
      adresse,
      surface,
      typesTravaux,
      description,
      dateSouhaitee,
      photos: JSON.stringify(photoUrls),
      statut: "nouveau",
      noteAdmin: null,
      dateIntervention: null,
      createdAt: new Date().toISOString(),
    });

    await sendEmailNotification({ id: docRef.id, nom, prenom, email, telephone, adresse, surface, description, dateSouhaitee, photoUrls, typesTravaux });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Devis API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function sendEmailNotification({
  id, nom, prenom, email, telephone, adresse, surface, description, dateSouhaitee, photoUrls, typesTravaux,
}: {
  id: string; nom: string; prenom: string; email: string; telephone: string;
  adresse: string; surface: number; description: string; dateSouhaitee: string;
  photoUrls: string[]; typesTravaux: string;
}) {
  const services = JSON.parse(typesTravaux || "[]");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: { user: process.env.SMTP_USER || "", pass: process.env.SMTP_PASS || "" },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a4a1a; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 1.4rem;">Nouvelle demande de devis</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 0.85rem;">Demo Paysagiste — Devis #${id}</p>
      </div>
      <div style="background: white; padding: 24px; border: 1px solid #e0f0d8; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1a4a1a; font-size: 1rem; margin-top: 0;">Coordonnées du client</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <tr><td style="padding: 6px 0; color: #6b8f6b; width: 140px;">Nom</td><td><strong>${prenom} ${nom}</strong></td></tr>
          <tr><td style="padding: 6px 0; color: #6b8f6b;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6b8f6b;">Téléphone</td><td><a href="tel:${telephone}">${telephone}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6b8f6b;">Adresse</td><td>${adresse}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e0f0d8; margin: 20px 0;" />
        <h2 style="color: #1a4a1a; font-size: 1rem;">Détails des travaux</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <tr><td style="padding: 6px 0; color: #6b8f6b; width: 140px;">Surface</td><td><strong>${surface} m²</strong></td></tr>
          <tr><td style="padding: 6px 0; color: #6b8f6b;">Services</td><td>${services.map((s: string) => `<span style="background:#f2f9ee;border:1px solid #b8dba0;border-radius:4px;padding:2px 8px;margin:2px;font-size:0.82rem;display:inline-block;">${s}</span>`).join(" ")}</td></tr>
          ${dateSouhaitee ? `<tr><td style="padding: 6px 0; color: #6b8f6b;">Date souhaitée</td><td>${new Date(dateSouhaitee).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</td></tr>` : ""}
          ${description ? `<tr><td style="padding: 6px 0; color: #6b8f6b; vertical-align: top;">Description</td><td>${description}</td></tr>` : ""}
        </table>
        ${photoUrls.length > 0 ? `<hr style="border: none; border-top: 1px solid #e0f0d8; margin: 20px 0;" /><p style="color: #6b8f6b; font-size: 0.85rem; margin: 0;">📸 ${photoUrls.length} photo${photoUrls.length > 1 ? "s" : ""} jointe${photoUrls.length > 1 ? "s" : ""}</p>` : ""}
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Demo Paysagiste" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || "enzo.omnes@gmail.com",
    replyTo: email,
    subject: `Nouvelle demande de devis — ${prenom} ${nom}`,
    html,
  });
}
