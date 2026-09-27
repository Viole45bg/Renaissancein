import React from "react";

interface LogoProps {
  width?: number;
  /** Main wordmark colour (defaults to ink — suits the light theme) */
  color?: string;
  /** Secondary line colour (defaults to deep gold) */
  accent?: string;
}

export default function Logo({
  width = 200,
  color = "#1C1710",
  accent = "#8F6F14",
}: LogoProps) {
  const scale = width / 360;
  const height = Math.round(70 * scale);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 360 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Renaissance Investors Club"
    >
      <defs>
        <linearGradient id="ric-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8F6F14" />
          <stop offset="0.42" stopColor="#C9A227" />
          <stop offset="0.62" stopColor="#E3C866" />
          <stop offset="1" stopColor="#8F6F14" />
        </linearGradient>
      </defs>

      {/* Faint continents beneath the wireframe, like the banner mark */}
      <path d="M24 24q8-7 17-4t8 8q-1 5-8 7q-9 2-14-3q-4-4-3-8z" fill="#C9A227" fillOpacity="0.22" />
      <path d="M37 44q7-3 12 1q5 4 3 9q-3 6-10 5q-6-1-7-7q-1-5 2-8z" fill="#C9A227" fillOpacity="0.18" />

      {/* ── Golden globe emblem ── */}
      <g stroke="url(#ric-gold)" fill="none" strokeLinecap="round">
        {/* sphere */}
        <circle cx="35" cy="35" r="30" strokeWidth="2.6" />
        {/* meridians */}
        <line x1="35" y1="5" x2="35" y2="65" strokeWidth="1.6" />
        <ellipse cx="35" cy="35" rx="11" ry="30" strokeWidth="1.6" />
        <ellipse cx="35" cy="35" rx="22" ry="30" strokeWidth="1.6" />
        {/* latitudes */}
        <ellipse cx="35" cy="35" rx="30" ry="10" strokeWidth="1.6" />
        <ellipse cx="35" cy="21" rx="26.4" ry="7" strokeWidth="1.4" />
        <ellipse cx="35" cy="49" rx="26.4" ry="7" strokeWidth="1.4" />
        <ellipse cx="35" cy="12" rx="18.7" ry="4.2" strokeWidth="1.2" />
        <ellipse cx="35" cy="58" rx="18.7" ry="4.2" strokeWidth="1.2" />
      </g>

      {/* Gold nodes at the poles and equator */}
      <g fill="#C9A227">
        <circle cx="35" cy="5" r="2.8" />
        <circle cx="35" cy="65" r="2.8" />
        <circle cx="5" cy="35" r="2.8" />
        <circle cx="65" cy="35" r="2.8" />
      </g>

      {/* ── Wordmark ── */}
      <text
        x="82"
        y="32"
        textLength="238"
        lengthAdjust="spacing"
        style={{ fontFamily: "var(--font-body, 'Arial'), 'Helvetica Neue', Arial, sans-serif" }}
        fontWeight="900"
        fontSize="27"
        fill={color}
      >
        RENAISSANCE
      </text>
      <text
        x="82"
        y="54"
        textLength="238"
        lengthAdjust="spacing"
        style={{ fontFamily: "var(--font-body, 'Arial'), 'Helvetica Neue', Arial, sans-serif" }}
        fontWeight="700"
        fontSize="11"
        fill={accent}
      >
        INVESTORS CLUB
      </text>
    </svg>
  );
}
