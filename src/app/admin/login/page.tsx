"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Identifiants incorrects.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1.5px solid var(--gray-200)",
    borderRadius: "8px",
    fontSize: "0.9rem",
    color: "var(--black)",
    fontFamily: "'DM Sans', sans-serif",
    background: "var(--gray-50)",
    outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--green-dark)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "3rem 2.5rem",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "48px", height: "48px",
            background: "var(--green-dark)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
          }}>
            <Leaf size={24} color="white" strokeWidth={2} />
          </div>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--black)", marginBottom: "0.25rem" }}>
            Administration
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "var(--text-xsoft)" }}>Demo Paysagiste</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@exemple.fr" style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--gray-200)")}
            />
          </div>
          <div>
            <label style={labelStyle}>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"} required value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: "3rem" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--gray-200)")}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-xsoft)", display: "flex" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: "0.75rem 1rem", background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#c53030" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-green" style={{ border: "none", cursor: loading ? "wait" : "pointer", justifyContent: "center", marginTop: "0.5rem", padding: "0.8rem" }}>
            {loading ? (
              <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />Connexion...</>
            ) : "Se connecter"}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "var(--text-soft)",
  marginBottom: "0.35rem",
};
