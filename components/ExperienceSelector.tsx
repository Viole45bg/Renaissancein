"use client";

import { useEffect, useState, type ReactNode } from "react";

type Path = {
  id: string;
  label: string;
  level: string;
  tagline: string;
  desc: string;
  perks: string[];
  icon: ReactNode;
};

const STORAGE_KEY = "ric-selected-path";

const PATHS: Path[] = [
  {
    id: "foundations",
    label: "Foundations",
    level: "Beginner",
    tagline: "New to markets",
    desc: "Build core knowledge and invest with confidence from day one.",
    perks: [
      "Structured starter curriculum, plain-English only",
      "Guided market briefings twice a week",
      "Step-by-step onboarding — your first trade, done right",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4h6a4 4 0 014 4v13a3 3 0 00-3-3H2z" />
        <path d="M22 4h-6a4 4 0 00-4 4v13a3 3 0 013-3h7z" />
      </svg>
    ),
  },
  {
    id: "growth",
    label: "Growth",
    level: "Intermediate",
    tagline: "Know the basics",
    desc: "Sharpen strategy, manage risk, and compound steady returns.",
    perks: [
      "Intermediate strategy playbooks with live examples",
      "Weekly market breakdowns and trade reviews",
      "Portfolio construction & risk-management frameworks",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 7l-8.5 8.5-5-5L2 17" />
        <path d="M16 7h6v6" />
      </svg>
    ),
  },
  {
    id: "mastery",
    label: "Mastery",
    level: "Experienced",
    tagline: "Seasoned investor",
    desc: "Trade alongside senior members with advanced, timely insights.",
    perks: [
      "Advanced trade setups with entry, exit & thesis",
      "Macro and sentiment deep dives",
      "Direct access to senior mentors of the club",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5.5" />
        <path d="M8.8 12.8L7 22l5-3 5 3-1.8-9.2" />
      </svg>
    ),
  },
];

/** Pre-fill a WhatsApp message with the chosen path (wa.me / whatsapp.com links). */
function withPrefill(url: string, path: Path): string {
  try {
    const u = new URL(url);
    const isWhatsApp = /(^|\.)wa\.me$/.test(u.hostname) || /(^|\.)whatsapp\.com$/.test(u.hostname);
    if (!isWhatsApp || u.searchParams.has("text")) return url; // never clobber an existing prefill
    u.searchParams.set(
      "text",
      `Hi! I'd like to join Renaissance Investors Club — I'm starting on the ${path.label} path (${path.level}).`
    );
    return u.toString();
  } catch {
    return url; // not a valid absolute URL — use as-is
  }
}

export default function ExperienceSelector({
  telegramUrl = "",
  whatsappUrl = "",
  telegramEnabled = true,
  whatsappEnabled = true,
}: {
  telegramUrl?: string;
  whatsappUrl?: string;
  telegramEnabled?: boolean;
  whatsappEnabled?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  // Restore a returning visitor's previous choice
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && PATHS.some((p) => p.id === saved)) setSelected(saved);
  }, []);

  const choose = (id: string) => {
    setSelected(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* private mode — non-critical */
    }
  };

  const telegramReady = telegramEnabled && !!telegramUrl;
  const whatsappReady = whatsappEnabled && !!whatsappUrl;
  const path = PATHS.find((p) => p.id === selected) ?? null;

  const primary = path
    ? telegramReady
      ? { label: "Continue on Telegram", href: telegramUrl }
      : whatsappReady
        ? { label: "Continue on WhatsApp", href: withPrefill(whatsappUrl, path) }
        : null
    : null;
  const secondary =
    primary && path && telegramReady && whatsappReady
      ? { href: withPrefill(whatsappUrl, path) }
      : null;

  return (
    <div className="experience-selector">
      <span className="selector-title">Select the path that fits you</span>

      <div className="path-field" role="radiogroup" aria-label="Choose your experience path">
        {PATHS.map((p) => {
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`path-choice ${isSelected ? "selected" : ""}`}
              onClick={() => choose(p.id)}
            >
              <span className="path-radio" aria-hidden="true">
                <span className="path-radio-dot" />
              </span>
              <span className="path-choice-text">
                <span className="path-choice-head">
                  <span className="path-name">{p.label}</span>
                  <span className="path-tagline">{p.tagline}</span>
                </span>
                <span className="path-desc">{p.desc}</span>
              </span>
              <span className="path-glyph" aria-hidden="true">{p.icon}</span>
            </button>
          );
        })}
      </div>

      {!path && (
        <span className="path-hint">Pick a path to see what&apos;s included and continue →</span>
      )}

      {path && (
        <div className="path-result revealed" aria-live="polite">
          <span className="path-result-title">Your path — {path.label}</span>
          <ul className="path-perks">
            {path.perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>

          {primary ? (
            <div className="path-cta">
              <a className="contact-us-btn" href={primary.href} target="_blank" rel="noopener noreferrer">
                {primary.label}
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              {secondary && (
                <a className="path-alt" href={secondary.href} target="_blank" rel="noopener noreferrer">
                  or continue on WhatsApp — your path is pre-filled →
                </a>
              )}
            </div>
          ) : (
            <span className="path-soon">
              Onboarding opens shortly — your path is saved for when you return.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
