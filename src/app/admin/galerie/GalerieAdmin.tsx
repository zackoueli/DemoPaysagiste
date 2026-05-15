"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, Loader2, ImageIcon } from "lucide-react";

type Photo = {
  id: string;
  url: string;
  alt: string | null;
  ordre: number;
};

export default function GalerieAdmin({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [altInput, setAltInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("alt", altInput || file.name);

      const res = await fetch("/api/admin/galerie", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setPhotos((prev) => [...prev, data.photo]);
      }
    }

    setUploading(false);
    setAltInput("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette photo ?")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/galerie/${id}`, { method: "DELETE" });
    if (res.ok) setPhotos((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  return (
    <div>
      {/* Upload zone */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e8ede8", padding: "2rem", marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "1.25rem" }}>
          Ajouter des photos
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "end", marginBottom: "1rem" }}>
          <div>
            <label style={labelStyle}>Description / alt de l&apos;image (optionnel)</label>
            <input
              type="text"
              placeholder="Ex: Tonte pelouse Biscarrosse juillet 2024"
              value={altInput}
              onChange={(e) => setAltInput(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-primary"
            style={{ border: "none", cursor: uploading ? "wait" : "pointer", whiteSpace: "nowrap", height: "42px" }}
          >
            {uploading ? (
              <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Upload...</>
            ) : (
              <><Upload size={14} /> Ajouter des photos</>
            )}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files)}
        />
        <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: 0 }}>
          Formats acceptés : JPG, PNG, WEBP. Les photos apparaissent directement sur la page Réalisations.
        </p>
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "white", borderRadius: "12px", border: "1px dashed #e8ede8" }}>
          <ImageIcon size={32} color="var(--text-light)" strokeWidth={1.5} style={{ marginBottom: "1rem" }} />
          <p style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>Aucune photo dans la galerie.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{ background: "white", borderRadius: "10px", border: "1px solid #e8ede8", overflow: "hidden", position: "relative" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.alt || ""}
                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "0.75rem" }}>
                <p style={{ fontSize: "0.78rem", color: "var(--text-mid)", margin: 0, lineHeight: 1.4, maxHeight: "2.8em", overflow: "hidden" }}>
                  {photo.alt || "Sans description"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deleting === photo.id}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: "rgba(220,38,38,0.9)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {deleting === photo.id ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={12} />}
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-light)",
  marginBottom: "0.4rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  border: "1.5px solid #e8ede8",
  borderRadius: "8px",
  fontSize: "0.875rem",
  color: "var(--text-dark)",
  fontFamily: "'DM Sans', sans-serif",
  background: "#f9fbf9",
  outline: "none",
  height: "42px",
  boxSizing: "border-box",
};
