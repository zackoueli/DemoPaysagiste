"use client";

import { useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, Loader2, X, Upload, ImageIcon } from "lucide-react";

type Article = {
  id: string;
  titre: string;
  slug: string;
  contenu: string;
  extrait: string | null;
  imageUrl: string | null;
  publie: boolean;
  createdAt: string;
  updatedAt: string;
};

const emptyForm = { titre: "", slug: "", contenu: "", extrait: "", imageUrl: "", publie: false };

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ActualitesAdmin({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOverImage, setDragOverImage] = useState(false);

  const openNew = () => { setEditing({ ...emptyForm }); setSaveError(null); };
  const openEdit = (a: Article) => { setEditing({ ...a }); setSaveError(null); };
  const closeEdit = () => { setEditing(null); setSaveError(null); };

  const handleUploadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/admin/articles-image", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json() as { url: string };
      setEditing((prev) => prev ? { ...prev, imageUrl: data.url } : prev);
    }
    setUploadingImage(false);
    setDragOverImage(false);
  }, []);

  const onDropImage = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUploadImage(file);
  }, [handleUploadImage]);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.titre?.trim()) { setSaveError("Le titre est obligatoire."); return; }
    if (!editing.contenu?.trim()) { setSaveError("Le contenu est obligatoire."); return; }

    setSaving(true);
    setSaveError(null);

    const isNew = !editing.id;
    const url = isNew ? "/api/admin/articles" : `/api/admin/articles/${editing.id}`;
    const method = isNew ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        setSaveError(err.error || `Erreur serveur (${res.status})`);
        setSaving(false);
        return;
      }

      const data = await res.json();
      if (isNew) {
        setArticles((prev) => [data.article, ...prev]);
      } else {
        setArticles((prev) => prev.map((a) => (a.id === data.article.id ? data.article : a)));
      }
      closeEdit();
    } catch {
      setSaveError("Impossible de joindre le serveur. Vérifiez votre connexion.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    if (res.ok) setArticles((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  };

  const togglePublie = async (article: Article) => {
    const res = await fetch(`/api/admin/articles/${article.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publie: !article.publie }),
    });
    if (res.ok) {
      const data = await res.json();
      setArticles((prev) => prev.map((a) => (a.id === data.article.id ? data.article : a)));
    }
  };

  return (
    <div>
      <button onClick={openNew} className="btn-primary" style={{ border: "none", cursor: "pointer", marginBottom: "2rem" }}>
        <Plus size={15} /> Nouvel article
      </button>

      {/* Modal */}
      {editing !== null && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2rem", overflowY: "auto" }}
          onClick={(e) => e.target === e.currentTarget && closeEdit()}
        >
          <div style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "820px", padding: "2rem", boxShadow: "0 25px 60px rgba(0,0,0,0.25)", marginBottom: "2rem" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.35rem", fontWeight: 400, color: "#1a2e19", margin: 0 }}>
                {editing.id ? "Modifier l'article" : "Nouvel article"}
              </h2>
              <button onClick={closeEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "#8aab86", padding: "0.25rem" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Titre */}
              <div>
                <label style={labelStyle}>Titre *</label>
                <input
                  type="text"
                  placeholder="Titre de l'article"
                  value={editing.titre || ""}
                  onChange={(e) => setEditing({ ...editing, titre: e.target.value, slug: slugify(e.target.value) })}
                  style={inputStyle}
                />
              </div>

              {/* Slug */}
              <div>
                <label style={labelStyle}>Slug (URL)</label>
                <input
                  type="text"
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  style={inputStyle}
                  placeholder="mon-article-url"
                />
              </div>

              {/* Extrait */}
              <div>
                <label style={labelStyle}>Extrait</label>
                <input
                  type="text"
                  placeholder="Courte description affichée dans la liste"
                  value={editing.extrait || ""}
                  onChange={(e) => setEditing({ ...editing, extrait: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Image de couverture — drag & drop */}
              <div>
                <label style={labelStyle}>Image de couverture</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOverImage(true); }}
                  onDragLeave={() => setDragOverImage(false)}
                  onDrop={onDropImage}
                  style={{
                    border: `2px dashed ${dragOverImage ? "#3a7a34" : "#ddeedd"}`,
                    borderRadius: "12px",
                    background: dragOverImage ? "#f0f9ef" : "#fafcfa",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    position: "relative",
                    minHeight: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {uploadingImage ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "2rem" }}>
                      <Loader2 size={24} color="#3a7a34" style={{ animation: "spin 1s linear infinite" }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#5a7a57" }}>Upload en cours…</span>
                    </div>
                  ) : editing.imageUrl ? (
                    <div style={{ width: "100%", position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editing.imageUrl} alt="" style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", transition: "background 0.2s ease" }} className="img-hover-overlay">
                        <label style={{ cursor: "pointer", background: "rgba(0,0,0,0.6)", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadImage(f); e.target.value = ""; }} />
                          <Upload size={13} /> Changer
                        </label>
                        <button onClick={() => setEditing({ ...editing, imageUrl: "" })} style={{ background: "rgba(220,38,38,0.8)", color: "white", border: "none", padding: "0.5rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", padding: "2rem", width: "100%", textAlign: "center" }}>
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadImage(f); e.target.value = ""; }} />
                      <div style={{ width: "44px", height: "44px", background: "#f0f9ef", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ImageIcon size={20} color="#3a7a34" strokeWidth={1.8} />
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#5a7a57" }}>
                        Glissez une image ici ou <span style={{ color: "#3a7a34", textDecoration: "underline" }}>parcourir</span>
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#b0c4b0" }}>JPG, PNG, WEBP</div>
                    </label>
                  )}
                </div>
              </div>

              {/* Contenu */}
              <div>
                <label style={labelStyle}>Contenu *</label>
                <textarea
                  rows={12}
                  placeholder="Contenu de l'article…"
                  value={editing.contenu || ""}
                  onChange={(e) => setEditing({ ...editing, contenu: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical", height: "auto" }}
                />
              </div>

              {/* Publier */}
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={editing.publie || false}
                  onChange={(e) => setEditing({ ...editing, publie: e.target.checked })}
                  style={{ width: "16px", height: "16px", accentColor: "#3a7a34" }}
                />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#1a2e19" }}>
                  Publier cet article (visible sur le site)
                </span>
              </label>

              {/* Erreur */}
              {saveError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "0.75rem 1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#c53030" }}>
                  {saveError}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.25rem" }}>
                <button onClick={closeEdit} style={{ padding: "0.65rem 1.25rem", border: "1.5px solid #ddeedd", borderRadius: "12px", background: "white", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#5a7a57" }}>
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.5rem", background: "#1e4d1a", color: "white", border: "none", borderRadius: "12px", cursor: saving ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500, opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Enregistrement…</> : <><Save size={14} /> Enregistrer</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste */}
      {articles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "white", borderRadius: "16px", border: "2px dashed #ddeedd", color: "#8aab86", fontFamily: "'DM Sans', sans-serif" }}>
          Aucun article. Créez le premier !
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {articles.map((article) => (
            <div key={article.id} style={{ background: "white", borderRadius: "14px", border: "1px solid #eaf0ea", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", opacity: article.publie ? 1 : 0.7 }}>
              {article.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.imageUrl} alt="" style={{ width: "56px", height: "40px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a2e19", fontFamily: "'DM Sans', sans-serif" }}>{article.titre}</span>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 600, background: article.publie ? "#d1fae5" : "#f3f4f6", color: article.publie ? "#065f46" : "#6b7280" }}>
                    {article.publie ? "Publié" : "Brouillon"}
                  </span>
                </div>
                {article.extrait && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#8aab86", margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "500px" }}>
                    {article.extrait}
                  </p>
                )}
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#b0c4b0", marginTop: "0.2rem" }}>
                  {new Date(article.createdAt).toLocaleDateString("fr-FR")} · /actualites/{article.slug}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button onClick={() => togglePublie(article)} title={article.publie ? "Dépublier" : "Publier"} style={{ padding: "0.4rem", border: "1px solid #eaf0ea", borderRadius: "8px", background: "white", cursor: "pointer", color: article.publie ? "#3a7a34" : "#b0c4b0" }}>
                  {article.publie ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => openEdit(article)} title="Modifier" style={{ padding: "0.4rem", border: "1px solid #eaf0ea", borderRadius: "8px", background: "white", cursor: "pointer", color: "#5a7a57" }}>
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(article.id)} disabled={deleting === article.id} title="Supprimer" style={{ padding: "0.4rem", border: "1px solid #fecaca", borderRadius: "8px", background: "white", cursor: "pointer", color: "#c53030" }}>
                  {deleting === article.id ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .img-hover-overlay:hover { background: rgba(0,0,0,0.35) !important; }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#8aab86",
  marginBottom: "0.4rem",
  fontFamily: "'DM Sans', sans-serif",
};

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
  boxSizing: "border-box",
};
