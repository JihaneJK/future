import React, { useState } from "react";
import { Link } from "react-router-dom";

// Styles (comme dans ton code)
const C = {
  primary: "#6C63FF",
  primaryLight: "#EDE9FE",
  white: "#fff",
  dark: "#1a1a2e",
  gray: "#f8f9ff",
  muted: "#888"
};

const card = (styles = {}) => ({
  background: "#fff",
  borderRadius: 18,
  border: "1px solid #eee",
  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  ...styles
});

const btnStyle = (variant = "primary") => {
  const styles = {
    primary: { background: C.primary, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: C.primary, border: `1px solid ${C.primary}` },
    outline: { background: "transparent", color: C.primary, border: `1px solid ${C.primary}` }
  };
  return {
    ...styles[variant],
    borderRadius: 50,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center"
  };
};

export default function MapPage() {
  const [selected, setSelected] = useState(null);

  const villes = [
    { n: "Casablanca", x: 120, y: 200, count: 45, ecoles: ["ENCG Casa", "ISCAE", "HEM", "FSJES", "ESCA", "ESITH"] },
    { n: "Rabat", x: 100, y: 155, count: 38, ecoles: ["ENSIAS", "INSEA", "UM5", "ENSSUP", "INPT", "UIR"] },
    { n: "Fès", x: 230, y: 145, count: 32, ecoles: ["ENSA Fès", "FST Fès", "SIDI Mohamed", "OFPPT", "ENCG Fès"] },
    { n: "Marrakech", x: 165, y: 295, count: 28, ecoles: ["ESAV", "ENCG Marrakech", "UCA", "OFPPT", "Cadi Ayyad"] },
    { n: "Tanger", x: 120, y: 55, count: 25, ecoles: ["ENSA Tanger", "UAE", "IFT", "OFPPT", "ENCG Tanger"] },
    { n: "Agadir", x: 98, y: 360, count: 20, ecoles: ["ENCG Agadir", "ENSA Agadir", "IBN Zohr", "ISIAM"] },
    { n: "Meknès", x: 193, y: 152, count: 18, ecoles: ["ENA Meknès", "ISCAE Meknès", "OFPPT", "Moulay Ismail"] },
    { n: "Oujda", x: 320, y: 120, count: 15, ecoles: ["ENSA Oujda", "Mohamed Premier", "OFPPT"] },
    { n: "Kénitra", x: 85, y: 130, count: 14, ecoles: ["ENSA Kénitra", "Ibn Tofail", "OFPPT"] },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.gray, paddingTop: 64 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0f0c29,#302b63)", padding: "28px 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>🗺️ Carte Interactive du Maroc</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 6 }}>Cliquez sur une ville pour découvrir ses établissements post-bac</p>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 1.5rem", display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Map Area */}
        <div style={{ ...card({ padding: 18, minHeight: 520 }), position: "relative" }}>
          <svg viewBox="0 0 400 440" style={{ width: "100%", height: "100%", minHeight: 480 }}>
            {/* Morocco simplified shape */}
            <path
              d="M85,25 L100,15 L135,12 L170,15 L205,20 L235,18 L265,26 L282,42 L290,65 L285,95 L298,125 L310,158 L305,190 L290,220 L272,248 L255,275 L238,300 L225,322 L212,340 L200,352 L188,340 L172,325 L155,308 L138,292 L118,278 L102,262 L88,245 L75,228 L65,205 L60,178 L62,150 L68,120 L72,90 L68,62 L72,45 L78,32 Z"
              fill="#EDE9FE"
              stroke={C.primary}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* City markers */}
            {villes.map((v, i) => (
              <g 
                key={i} 
                onClick={() => setSelected(selected?.n === v.n ? null : v)} 
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={selected?.n === v.n ? 14 : 9}
                  fill={selected?.n === v.n ? C.primary : C.white}
                  stroke={C.primary}
                  strokeWidth="2.5"
                  style={{
                    transition: "all 0.2s",
                    filter: selected?.n === v.n ? `drop-shadow(0 0 10px ${C.primary}88)` : "none",
                  }}
                />
                <text x={v.x} y={v.y + 22} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.dark}>{v.n}</text>
                <text x={v.x} y={v.y + 33} textAnchor="middle" fontSize="9" fill={C.muted}>{v.count} éts</text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div style={{ position: "absolute", bottom: 14, left: 14, background: "rgba(255,255,255,0.95)", padding: "10px 14px", borderRadius: 10, border: "1px solid #eee", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.primary }} />
              <span style={{ fontSize: 11, color: C.muted }}>Sélectionnée</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.white, border: `2px solid ${C.primary}` }} />
              <span style={{ fontSize: 11, color: C.muted }}>Disponible</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ ...card({ padding: 20, height: "fit-content" }) }}>
          {selected ? (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontWeight: 900, color: C.dark, fontSize: 18 }}>📍 {selected.n}</div>
                <span style={{ background: C.primaryLight, color: C.primary, fontWeight: 700, fontSize: 12, padding: "4px 12px", borderRadius: 50 }}>{selected.count} établissements</span>
              </div>
              <div style={{ marginBottom: 14 }}>
                {selected.ecoles.map((e, i) => (
                  <Link
                    key={i}
                    to="/schools"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: i < selected.ecoles.length - 1 ? "1px solid #f5f5f5" : "none",
                      cursor: "pointer",
                      color: C.dark,
                      textDecoration: "none"
                    }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🏫</div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{e}</span>
                  </Link>
                ))}
              </div>
              <Link to="/schools" style={{ textDecoration: "none" }}>
                <button style={{ ...btnStyle("primary"), width: "100%", padding: "11px", fontSize: 13, marginBottom: 10 }}>
                  🔍 Voir les formations →
                </button>
              </Link>
              <button 
                onClick={() => setSelected(null)} 
                style={{ ...btnStyle("ghost"), width: "100%", padding: "10px", fontSize: 13 }}
              >
                ← Retour à la carte
              </button>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 800, color: C.dark, fontSize: 15, marginBottom: 16 }}>📍 Villes disponibles</div>
              {villes.map((v, i) => (
                <div
                  key={i}
                  onClick={() => setSelected(v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderBottom: i < villes.length - 1 ? "1px solid #f5f5f5" : "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{v.n}</span>
                  </div>
                  <span style={{ background: C.primaryLight, color: C.primary, fontSize: 12, padding: "3px 10px", borderRadius: 50, fontWeight: 700 }}>{v.count}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: 14, background: C.primaryLight, borderRadius: 12, border: "1px solid #e4dfff" }}>
                <div style={{ fontSize: 13, color: C.primary, fontWeight: 600 }}>💡 Cliquez sur une ville de la carte ou de cette liste pour voir ses écoles et formations.</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}