"use client";

import { useEffect, useRef } from "react";

export default function ZoneMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    // Charger Leaflet CSS
    if (!document.querySelector("#leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Charger Leaflet JS puis initialiser la carte
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L;
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [44.3939, -1.1647],
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      mapRef.current = map;

      // Tuiles CartoDB Positron — fond clair épuré, libre et sans clé API
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        }
      ).addTo(map);

      // Marqueur custom Biscarrosse
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width: 36px; height: 36px;
          background: #1E3B1A;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        ">
          <div style="
            width: 10px; height: 10px;
            background: white; border-radius: 50%;
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
          "></div>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -40],
      });

      L.marker([44.3939, -1.1647], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:600;color:#1E3B1A;padding:2px 4px">
            Demo Paysagiste<br/>
            <span style="font-weight:400;color:#6B6760;font-size:0.78rem">Biscarrosse, Landes</span>
          </div>`,
          { offset: [0, -8] }
        )
        .openPopup();

      // Cercle zone d'intervention ~30 km
      L.circle([44.3939, -1.1647], {
        radius: 30000,
        color: "#3A6B35",
        fillColor: "#3A6B35",
        fillOpacity: 0.07,
        weight: 1.5,
        dashArray: "6 5",
      }).addTo(map);

      // Marqueurs communes secondaires
      const smallIcon = L.divIcon({
        className: "",
        html: `<div style="
          width: 10px; height: 10px;
          background: #5A9A52;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        "></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      const communes = [
        { name: "Parentis-en-Born", coords: [44.3517, -1.0747] as [number, number] },
        { name: "Sanguinet", coords: [44.4806, -1.0814] as [number, number] },
        { name: "Gastes", coords: [44.3214, -1.1097] as [number, number] },
        { name: "Cazaux", coords: [44.5317, -1.1564] as [number, number] },
        { name: "Pissos", coords: [44.3083, -0.7783] as [number, number] },
        { name: "Ychoux", coords: [44.3233, -0.9647] as [number, number] },
      ];

      communes.forEach(({ name, coords }) => {
        L.marker(coords, { icon: smallIcon })
          .addTo(map)
          .bindTooltip(name, {
            permanent: false,
            direction: "top",
            className: "zone-tooltip",
            offset: [0, -6],
          });
      });

      // Style tooltip
      if (!document.querySelector("#leaflet-custom")) {
        const style = document.createElement("style");
        style.id = "leaflet-custom";
        style.textContent = `
          .zone-tooltip {
            background: #1E3B1A !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            font-family: 'DM Sans', sans-serif !important;
            font-size: 0.78rem !important;
            font-weight: 500 !important;
            padding: 4px 10px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          }
          .zone-tooltip::before { border-top-color: #1E3B1A !important; }
          .leaflet-popup-content-wrapper {
            border-radius: 12px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
            border: 1px solid #E8E5DF !important;
          }
          .leaflet-popup-tip { display: none; }
          .leaflet-control-zoom {
            border: 1px solid #E8E5DF !important;
            border-radius: 10px !important;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
          }
          .leaflet-control-zoom a {
            font-family: 'DM Sans', sans-serif !important;
            color: #2D2B27 !important;
            border-bottom-color: #E8E5DF !important;
          }
          .leaflet-control-attribution {
            font-family: 'DM Sans', sans-serif !important;
            font-size: 0.65rem !important;
            background: rgba(255,255,255,0.8) !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    document.head.appendChild(script);

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
    />
  );
}
