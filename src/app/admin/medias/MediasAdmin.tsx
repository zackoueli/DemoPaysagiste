"use client";

import { useState, useRef, useCallback } from "react";
import { Video, ImageIcon, Images, Upload, Trash2, Loader2, X, Save, CheckCircle, Play } from "lucide-react";

const PRESTATIONS = [
  { key: "tonte",           label: "Tonte de pelouse" },
  { key: "elagage",         label: "Élagage & haies" },
  { key: "debroussaillage", label: "Débroussaillage" },
  { key: "nettoyage",       label: "Nettoyage façades" },
  { key: "entretien",       label: "Entretien jardins" },
  { key: "bois",            label: "Bois de chauffage" },
];

type Photo = { id: string; url: string; alt: string | null; ordre: number };

type Tab = "video" | "prestations" | "galerie";

export default function MediasAdmin({
  initialSettings,
  initialPhotos,
}: {
  initialSettings: Record<string, string>;
  initialPhotos: Photo[];
}) {
  const [tab, setTab] = useState<Tab>("video");

  // ── Video state ──
  const [heroVideoUrl, setHeroVideoUrl] = useState(initialSettings.hero_video_url ?? "");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [dragOverVideo, setDragOverVideo] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const [savedVideo, setSavedVideo] = useState(false);

  // ── Prestations state ──
  const [prestationImgs, setPrestationImgs] = useState<Record<string, string>>(() => {
    const imgs: Record<string, string> = {};
    PRESTATIONS.forEach(({ key }) => {
      if (initialSettings[`prestation_img_${key}`]) imgs[key] = initialSettings[`prestation_img_${key}`];
    });
    return imgs;
  });
  const [uploadingPrestation, setUploadingPrestation] = useState<string | null>(null);
  const [dragOverPrestation, setDragOverPrestation] = useState<string | null>(null);

  // ── Galerie state ──
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [altInput, setAltInput] = useState("");
  const [uploadingGalerie, setUploadingGalerie] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState<string | null>(null);
  const [dragOverGalerie, setDragOverGalerie] = useState(false);
  const galerieFileRef = useRef<HTMLInputElement>(null);

  // ── Video handlers ──
  async function handleUploadVideo(file: File) {
    setUploadingVideo(true);
    const fd = new FormData();
    fd.append("video", file);
    const res = await fetch("/api/admin/hero-video", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json() as { url: string };
      setHeroVideoUrl(data.url);
      setSavedVideo(true);
      setTimeout(() => setSavedVideo(false), 3000);
    }
    setUploadingVideo(false);
    setDragOverVideo(false);
  }

  async function handleSaveVideoUrl() {
    setSavingVideo(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hero_video_url: heroVideoUrl }),
    });
    setSavingVideo(false);
    setSavedVideo(true);
    setTimeout(() => setSavedVideo(false), 3000);
  }

  const onDropVideo = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUploadVideo(file);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Prestation handlers ──
  async function handleUploadPrestation(key: string, file: File) {
    if (!file.type.startsWith("image/")) return;
    setUploadingPrestation(key);
    const fd = new FormData();
    fd.append("photo", file);
    fd.append("serviceKey", key);
    const res = await fetch("/api/admin/prestations-images", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json() as { url: string };
      setPrestationImgs((prev) => ({ ...prev, [key]: data.url }));
    }
    setUploadingPrestation(null);
    setDragOverPrestation(null);
  }

  const onDropPrestation = useCallback((key: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUploadPrestation(key, file);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Galerie handlers ──
  async function handleUploadGalerie(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingGalerie(true);
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
    setUploadingGalerie(false);
    setAltInput("");
    if (galerieFileRef.current) galerieFileRef.current.value = "";
    setDragOverGalerie(false);
  }

  async function handleDeletePhoto(id: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    setDeletingPhoto(id);
    const res = await fetch(`/api/admin/galerie/${id}`, { method: "DELETE" });
    if (res.ok) setPhotos((prev) => prev.filter((p) => p.id !== id));
    setDeletingPhoto(null);
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "video", label: "Vidéo hero", icon: Video },
    { id: "prestations", label: "Images prestations", icon: ImageIcon },
    { id: "galerie", label: "Galerie", icon: Images, count: photos.length },
  ];

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "960px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.85rem", fontWeight: 400, color: "#1a2e19", marginBottom: "0.3rem" }}>
          Médias
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#7a9e76" }}>
          Gérez toutes les photos et vidéos du site depuis un seul endroit.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", background: "white", padding: "0.375rem", borderRadius: "16px", border: "1px solid #eaf0ea", width: "fit-content" }}>
        {tabs.map(({ id, label, icon: Icon, count }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.55rem 1.1rem",
                borderRadius: "12px",
                border: "none",
                background: active ? "#1e4d1a" : "transparent",
                color: active ? "white" : "#5a7a57",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
              {count !== undefined && (
                <span style={{
                  background: active ? "rgba(255,255,255,0.2)" : "#e8f5e6",
                  color: active ? "white" : "#3a7a34",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "1px 6px",
                  borderRadius: "100px",
                  minWidth: "20px",
                  textAlign: "center",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB : Vidéo hero ── */}
      {tab === "video" && (
        <div style={{ background: "white", borderRadius: "20px", border: "1px solid #eaf0ea", padding: "2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#1a2e19", marginBottom: "0.25rem" }}>
              Vidéo de fond — Hero
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#8aab86" }}>
              Arrière-plan animé de la section principale de la page d&apos;accueil
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOverVideo(true); }}
            onDragLeave={() => setDragOverVideo(false)}
            onDrop={onDropVideo}
            style={{
              border: `2px dashed ${dragOverVideo ? "#3a7a34" : "#ddeedd"}`,
              borderRadius: "16px",
              padding: "2rem",
              background: dragOverVideo ? "#f0f9ef" : "#fafcfa",
              transition: "all 0.2s ease",
              marginBottom: "1.25rem",
            }}
          >
            {uploadingVideo ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "1rem 0" }}>
                <Loader2 size={28} color="#3a7a34" style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#5a7a57" }}>Upload en cours…</span>
              </div>
            ) : heroVideoUrl ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <video src={heroVideoUrl} style={{ width: "140px", height: "80px", objectFit: "cover", borderRadius: "10px", display: "block" }} muted />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", borderRadius: "10px" }}>
                    <Play size={20} color="white" fill="white" />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#1a2e19", marginBottom: "0.3rem" }}>Vidéo active</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#8aab86", wordBreak: "break-all", lineHeight: 1.5 }}>{heroVideoUrl}</div>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "0.6rem", cursor: "pointer", fontSize: "0.78rem", color: "#3a7a34", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                    <input type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadVideo(f); }} />
                    <Upload size={13} /> Remplacer
                  </label>
                </div>
                <button onClick={() => setHeroVideoUrl("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#b0c4b0", padding: "0.25rem" }}>
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "1rem 0" }}>
                <input type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadVideo(f); }} />
                <div style={{ width: "52px", height: "52px", background: "#f0f9ef", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Video size={24} color="#3a7a34" strokeWidth={1.8} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 500, color: dragOverVideo ? "#1e4d1a" : "#3a7a57" }}>
                    Glissez votre vidéo ici ou <span style={{ color: "#3a7a34", textDecoration: "underline" }}>parcourir</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#a0bca0", marginTop: "0.25rem" }}>MP4, WEBM — max 100 Mo</div>
                </div>
              </label>
            )}
          </div>

          {/* URL manuelle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ flex: 1, height: "1px", background: "#eaf0ea" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#b0c4b0", whiteSpace: "nowrap" }}>ou saisir une URL</span>
            <div style={{ flex: 1, height: "1px", background: "#eaf0ea" }} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="url"
              value={heroVideoUrl}
              onChange={(e) => setHeroVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              style={inputStyle}
            />
            <button
              onClick={handleSaveVideoUrl}
              disabled={savingVideo}
              style={savedVideo ? btnSavedStyle : btnPrimaryStyle}
            >
              {savedVideo ? <><CheckCircle size={14} /> Enregistré</> : <><Save size={14} /> {savingVideo ? "…" : "Enregistrer"}</>}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB : Images prestations ── */}
      {tab === "prestations" && (
        <div style={{ background: "white", borderRadius: "20px", border: "1px solid #eaf0ea", padding: "2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#1a2e19", marginBottom: "0.25rem" }}>
              Images des prestations
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#8aab86" }}>
              Glissez une photo sur chaque prestation ou cliquez pour parcourir
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {PRESTATIONS.map(({ key, label }) => {
              const img = prestationImgs[key];
              const isUploading = uploadingPrestation === key;
              const isDrag = dragOverPrestation === key;

              return (
                <label
                  key={key}
                  onDragOver={(e) => { e.preventDefault(); setDragOverPrestation(key); }}
                  onDragLeave={() => setDragOverPrestation(null)}
                  onDrop={(e) => onDropPrestation(key, e)}
                  style={{
                    display: "block", cursor: "pointer",
                    border: `2px dashed ${isDrag ? "#3a7a34" : img ? "transparent" : "#ddeedd"}`,
                    borderRadius: "14px", overflow: "hidden",
                    position: "relative", aspectRatio: "4/3",
                    background: isDrag ? "#f0f9ef" : img ? "transparent" : "#fafcfa",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadPrestation(key, f); e.target.value = ""; }} />

                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  )}

                  {/* Overlay contenu */}
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.35rem",
                    background: isUploading || !img ? "transparent" : isDrag ? "rgba(30,77,26,0.6)" : "transparent",
                    transition: "background 0.2s ease",
                  }}
                    className="prestation-overlay"
                  >
                    {isUploading ? (
                      <Loader2 size={22} color={img ? "white" : "#3a7a34"} style={{ animation: "spin 1s linear infinite" }} />
                    ) : !img && (
                      <>
                        <Upload size={18} color={isDrag ? "#1e4d1a" : "#b0c4b0"} />
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: isDrag ? "#1e4d1a" : "#b0c4b0" }}>
                          {isDrag ? "Déposer ici" : "Glisser ou cliquer"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Label bas */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.5rem 0.65rem",
                    background: img ? "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: img ? "rgba(255,255,255,0.9)" : "#8aab86", letterSpacing: "0.04em" }}>
                      {label}
                    </span>
                    {img && !isUploading && (
                      <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.6)", background: "rgba(0,0,0,0.35)", padding: "1px 6px", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif" }}>
                        Changer
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#b0c4b0", marginTop: "1.25rem" }}>
            Images stockées sur Firebase Storage — URL publique permanente. Formats : JPG, PNG, WEBP.
          </p>
        </div>
      )}

      {/* ── TAB : Galerie ── */}
      {tab === "galerie" && (
        <div>
          {/* Drop zone upload */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOverGalerie(true); }}
            onDragLeave={() => setDragOverGalerie(false)}
            onDrop={(e) => { e.preventDefault(); handleUploadGalerie(e.dataTransfer.files); }}
            style={{
              background: dragOverGalerie ? "#f0f9ef" : "white",
              borderRadius: "20px",
              border: `2px dashed ${dragOverGalerie ? "#3a7a34" : "#ddeedd"}`,
              padding: "1.75rem",
              marginBottom: "1.5rem",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8aab86", display: "block", marginBottom: "0.4rem" }}>
                  Description (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Tonte pelouse Biscarrosse juillet 2024"
                  value={altInput}
                  onChange={(e) => setAltInput(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <label style={{ cursor: uploadingGalerie ? "wait" : "pointer", flexShrink: 0 }}>
                <input ref={galerieFileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handleUploadGalerie(e.target.files)} />
                <div style={{
                  ...btnPrimaryStyle,
                  pointerEvents: uploadingGalerie ? "none" : "auto",
                  opacity: uploadingGalerie ? 0.7 : 1,
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  {uploadingGalerie ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Upload…</> : <><Upload size={14} /> Ajouter des photos</>}
                </div>
              </label>
            </div>
            {dragOverGalerie && (
              <div style={{ textAlign: "center", marginTop: "1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#3a7a34", fontWeight: 500 }}>
                Relâchez pour uploader
              </div>
            )}
          </div>

          {/* Grille photos */}
          {photos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", background: "white", borderRadius: "20px", border: "2px dashed #ddeedd" }}>
              <Images size={36} color="#c8dcc8" strokeWidth={1.5} style={{ marginBottom: "1rem" }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#b0c4b0", fontSize: "0.9rem", margin: 0 }}>Aucune photo dans la galerie.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "0.875rem" }}>
              {photos.map((photo) => (
                <div key={photo.id} style={{ background: "white", borderRadius: "14px", border: "1px solid #eaf0ea", overflow: "hidden", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.alt || ""} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "0.625rem 0.75rem" }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#7a9e76", margin: 0, lineHeight: 1.4, maxHeight: "2.8em", overflow: "hidden" }}>
                      {photo.alt || "Sans description"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    disabled={deletingPhoto === photo.id}
                    style={{ position: "absolute", top: "8px", right: "8px", width: "28px", height: "28px", borderRadius: "8px", background: "rgba(220,38,38,0.88)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}
                  >
                    {deletingPhoto === photo.id ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={12} />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        label:hover .prestation-overlay { background: rgba(30,77,26,0.45) !important; }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 1rem",
  border: "1.5px solid #ddeedd",
  borderRadius: "12px",
  fontSize: "0.875rem",
  color: "#1a2e19",
  fontFamily: "'DM Sans', sans-serif",
  background: "#fafcfa",
  outline: "none",
  height: "44px",
  boxSizing: "border-box",
};

const btnPrimaryStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "0.5rem",
  padding: "0 1.25rem",
  background: "#1e4d1a",
  color: "white",
  border: "none",
  borderRadius: "12px",
  height: "44px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.875rem",
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap",
  flexShrink: 0,
  transition: "background 0.15s ease",
};

const btnSavedStyle: React.CSSProperties = {
  ...btnPrimaryStyle,
  background: "#3a7a34",
};
