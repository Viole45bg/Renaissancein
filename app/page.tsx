import Image from "next/image";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import { Playfair_Display, Lato } from "next/font/google";
import Logo from "../components/Logo";
import ContactUs from "../components/ContactUs";
import ExperienceSelector from "../components/ExperienceSelector";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
});

const body = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-body",
});

const sql = neon(process.env.DATABASE_URL!);

async function getLinks() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS site_links (
        id INT PRIMARY KEY DEFAULT 1,
        whatsapp_url TEXT NOT NULL DEFAULT '',
        telegram_url TEXT NOT NULL DEFAULT '',
        livechat_url TEXT NOT NULL DEFAULT '',
        agent_name TEXT NOT NULL DEFAULT '',
        whatsapp_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        telegram_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        livechat_enabled BOOLEAN NOT NULL DEFAULT TRUE
      )
    `;

    await sql`ALTER TABLE site_links ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN NOT NULL DEFAULT TRUE`;
    await sql`ALTER TABLE site_links ADD COLUMN IF NOT EXISTS telegram_enabled BOOLEAN NOT NULL DEFAULT TRUE`;
    await sql`ALTER TABLE site_links ADD COLUMN IF NOT EXISTS livechat_enabled BOOLEAN NOT NULL DEFAULT TRUE`;

    const rows = await sql`
      SELECT
        whatsapp_url, telegram_url, livechat_url, agent_name,
        whatsapp_enabled, telegram_enabled, livechat_enabled
      FROM site_links WHERE id = 1
    `;
    
    const row = rows[0];
    return {
      whatsapp: row?.whatsapp_url ?? "",
      telegram: row?.telegram_url ?? "",
      livechat: row?.livechat_url ?? "",
      agentName: row?.agent_name ?? "",
      whatsappEnabled: row?.whatsapp_enabled ?? true,
      telegramEnabled: row?.telegram_enabled ?? true,
      livechatEnabled: row?.livechat_enabled ?? true,
    };
  } catch (err) {
    console.error("getLinks failed:", err);
    return {
      whatsapp: "", telegram: "", livechat: "", agentName: "",
      whatsappEnabled: true, telegramEnabled: true, livechatEnabled: true,
    };
  }
}

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
  title: "Renaissance Investors Club — Wisdom · Wealth · Legacy",
  description:
    "Invest with clarity and confidence. Renaissance Investors Club brings together community-driven market insights, curated education, and expert trading guidance to grow your wealth, generate passive income, and build a lasting legacy.",
};

export default async function Home() {
  const {
    whatsapp: WHATSAPP_URL,
    telegram: TELEGRAM_URL,
    whatsappEnabled,
    telegramEnabled,
  } = await getLinks();

  // Navbar CTA points to Telegram (respects the admin toggle)
  const ctaUrl = telegramEnabled && TELEGRAM_URL ? TELEGRAM_URL : null;

  return (
    <main className={`${display.variable} ${body.variable}`}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --paper:      #FBFAF5;
              --paper-deep: #F5F1E6;
              --card:       #FFFFFF;
              --ink:        #1C1710;
              --ink-soft:   rgba(28,23,16,0.80);
              --muted:      rgba(28,23,16,0.55);
              --gold:       #C9A227;
              --gold-deep:  #8F6F14;
              --gold-bright:#DDB94C;
              --gold-light: #F3E3A6;
              --line:       rgba(143,111,20,0.22);
              --whatsapp:   #25D366;
              --telegram:   #229ED9;
            }

            *, *::before, *::after { box-sizing: border-box; }
            html { scroll-behavior: smooth; }
            html, body { margin: 0; padding: 0; background: var(--paper); color: var(--ink); overflow-x: hidden; }

            body {
              font-family: system-ui, sans-serif;
              -webkit-font-smoothing: antialiased;
              position: relative;
            }

            /* Body text font — vars live on <main>, so scope to main */
            main { font-family: var(--font-body), system-ui, sans-serif; }

            /* ══════════════════════════════════════════
               BACKGROUND: golden globe & latitude lines
            ══════════════════════════════════════════ */

            body::before {
              content: "";
              position: fixed;
              inset: 0;
              z-index: 0;
              pointer-events: none;
              background-image:
                radial-gradient(circle 1.5px at 18% 72%, rgba(201,162,39,0.50) 0%, transparent 100%),
                radial-gradient(circle 1px   at 31% 85%, rgba(201,162,39,0.38) 0%, transparent 100%),
                radial-gradient(circle 2px   at 47% 78%, rgba(201,162,39,0.55) 0%, transparent 100%),
                radial-gradient(circle 1px   at 62% 91%, rgba(201,162,39,0.35) 0%, transparent 100%),
                radial-gradient(circle 1.5px at 74% 68%, rgba(201,162,39,0.48) 0%, transparent 100%),
                radial-gradient(circle 1px   at 83% 80%, rgba(201,162,39,0.38) 0%, transparent 100%),
                radial-gradient(circle 2px   at 9%  80%, rgba(201,162,39,0.42) 0%, transparent 100%),
                radial-gradient(circle 1px   at 55% 62%, rgba(201,162,39,0.30) 0%, transparent 100%),
                radial-gradient(circle 1.5px at 92% 75%, rgba(201,162,39,0.42) 0%, transparent 100%),
                radial-gradient(circle 1px   at 38% 95%, rgba(201,162,39,0.30) 0%, transparent 100%),
                radial-gradient(ellipse 80% 55% at 50% 38%, rgba(201,162,39,0.10) 0%, rgba(201,162,39,0.03) 45%, transparent 70%),
                radial-gradient(rgba(201,162,39,0.12) 1px, transparent 1.4px);
              background-size:
                100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%,
                100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%,
                100% 100%,
                34px 34px;
            }

            .bg-globe {
              position: fixed;
              inset: 0;
              z-index: 0;
              pointer-events: none;
              background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900' viewBox='0 0 900 900'><g fill='none' stroke='%23C9A227'><circle cx='450' cy='450' r='430' stroke-opacity='0.5' stroke-width='1.4'/><ellipse cx='450' cy='450' rx='145' ry='430' stroke-opacity='0.28' stroke-width='1.1'/><ellipse cx='450' cy='450' rx='288' ry='430' stroke-opacity='0.24' stroke-width='1.1'/><ellipse cx='450' cy='450' rx='398' ry='430' stroke-opacity='0.2' stroke-width='1.1'/><ellipse cx='450' cy='450' rx='430' ry='130' stroke-opacity='0.32' stroke-width='1.1'/><ellipse cx='450' cy='312' rx='366' ry='80' stroke-opacity='0.22' stroke-width='1'/><ellipse cx='450' cy='566' rx='400' ry='96' stroke-opacity='0.22' stroke-width='1'/><ellipse cx='450' cy='198' rx='238' ry='42' stroke-opacity='0.16' stroke-width='1'/><ellipse cx='450' cy='656' rx='288' ry='50' stroke-opacity='0.16' stroke-width='1'/></g><path d='M360 310q50 -40 110 -22q64 18 72 66q8 44 -36 66q-60 30 -114 6q-48 -22 -40 -64q6 -34 8 -52z' fill='%23C9A227' fill-opacity='0.09'/><path d='M520 520q44 -20 90 0q42 18 38 60q-4 42 -46 56q-48 16 -86 -6q-34 -20 -26 -56q6 -34 30 -54z' fill='%23C9A227' fill-opacity='0.08'/><path d='M96 640C240 470 660 470 804 640' fill='none' stroke='%23C9A227' stroke-opacity='0.22' stroke-width='1.2'/><g fill='%23C9A227'><circle cx='450' cy='450' r='4' fill-opacity='0.55'/><circle cx='216' cy='322' r='3.5' fill-opacity='0.5'/><circle cx='668' cy='536' r='3.5' fill-opacity='0.5'/><circle cx='552' cy='236' r='3' fill-opacity='0.45'/><circle cx='300' cy='636' r='3' fill-opacity='0.45'/><circle cx='752' cy='330' r='2.5' fill-opacity='0.4'/><circle cx='170' cy='510' r='2.5' fill-opacity='0.4'/></g></svg>");
              background-repeat: no-repeat;
              background-position: 50% 12%;
              background-size: min(92vmin, 800px);
            }

            body::after {
              content: "";
              position: fixed;
              left: 0; right: 0; bottom: 0;
              height: 68vh;
              z-index: 0;
              pointer-events: none;
              background-image:
                repeating-radial-gradient(circle at 50% 128%, transparent 0 20%, rgba(201,162,39,0.18) 20% 20.7%, transparent 20.7% 26%),
                linear-gradient(90deg, rgba(201,162,39,0.09) 1px, transparent 1px);
              background-size: 100% 100%, 78px 78px;
              -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.8) 100%);
              mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.8) 100%);
            }

            header, main > div, section, footer, .ticker {
              position: relative;
              z-index: 1;
            }

            a { color: inherit; text-decoration: none; }
            a:focus-visible, button:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
            section[id] { scroll-margin-top: 90px; }
            #contact { scroll-margin-top: 90px; }

            /* ── Ticker ── */
            .ticker {
              overflow: hidden;
              background: linear-gradient(90deg, #B18A22 0%, #D4AF37 50%, #B18A22 100%);
              padding: 10px 0;
              margin: 88px calc(50% - 50vw) 64px;
            }
            .ticker-track { display: flex; width: max-content; animation: tickerScroll 55s linear infinite; }
            .ticker-group { display: flex; align-items: center; white-space: nowrap; }
            .ticker-item {
              display: inline-flex; align-items: center; gap: 24px; padding-right: 24px;
              font-size: 10px; font-weight: 700; letter-spacing: 2.8px; text-transform: uppercase; color: #241B06;
            }
            .ticker-item::after { content: "✦"; font-size: 8px; opacity: 0.55; }
            @keyframes tickerScroll { from { transform: translateX(-50%); } to { transform: translateX(0); } }
            @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }

            /* ── Nav ── */
            .brand-bar {
              position: sticky; top: 0; z-index: 20;
              background: rgba(251,250,245,0.9);
              backdrop-filter: blur(14px);
              border-bottom: 1px solid rgba(201,162,39,0.25);
              padding: 14px 24px;
            }
            .brand-bar-inner {
              width: min(100%, 860px); margin: 0 auto;
              display: flex; align-items: center; justify-content: space-between; gap: 16px;
            }
            .brand { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; text-decoration: none; }
            .brand-sub { font-size: 9px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: var(--gold-deep); }

            .nav-cta {
              font-size: 11px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase;
              color: var(--ink-soft); background: transparent; border-radius: 0; padding: 4px 0;
              transition: color 0.2s; white-space: nowrap; cursor: pointer;
              border: none; text-decoration: none; box-shadow: none;
              display: inline-flex; align-items: center;
            }
            .nav-cta:hover { color: var(--gold-deep); transform: none; }

            /* ── Hero ── */
            .hero-market-insights {
              position: relative; padding: 110px 24px 80px;
              text-align: left; z-index: 1;
            }
            .hero-inner { max-width: 900px; margin: 0 auto; }
            .hero-title {
              font-size: 44px; font-weight: 800;
              margin: 0 0 18px; line-height: 1.08; letter-spacing: 0.01em;
              color: var(--ink);
            }
            .hero-title-gold {
              display: inline-block;
              color: var(--gold-deep);
              background: linear-gradient(92deg, #8F6F14 0%, #C9A227 28%, #F0DA8A 50%, #C9A227 72%, #8F6F14 100%);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .hero-text {
              font-size: 15.5px; line-height: 1.8;
              color: var(--ink-soft);
              max-width: 760px; margin: 0 auto 40px;
            }
            .hero-contact { display: flex; justify-content: left; }

            /* ── Banner ── */
            .hero { position: relative; width: 100%; line-height: 0; background: var(--paper); }
            .hero-image { display: block; width: 100%; height: auto; object-fit: cover; }
            .hero-fade {
              position: absolute; bottom: 0; left: 0; right: 0; height: 140px;
              background: linear-gradient(to bottom, transparent 0%, var(--paper) 100%);
              pointer-events: none; z-index: 2;
            }

            /* ── Body section ── */
            .body-section {
              padding: 64px 24px 96px;
              background: transparent; position: relative; overflow: visible; z-index: 2;
            }
            .body-inner {
              position: relative; z-index: 1;
              width: min(720px, 100%); margin: 0 auto; text-align: center;
            }
            .eyebrow {
              font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
              color: var(--gold-deep); margin-bottom: 22px;
            }
            .body-text {
              font-size: 17px; font-weight: 500; line-height: 1.9;
              color: var(--ink-soft);
              max-width: 660px; margin: 0 auto 48px;
            }

            /* ── Feature cards ── */
            .features { display: grid; gap: 16px; margin: 0 0 52px; }
            .features-grid-2 { grid-template-columns: repeat(2, 1fr); max-width: 800px; margin: 0 auto; }
            .feature {
              background: var(--card);
              border: 1px solid rgba(201,162,39,0.35);
              border-radius: 18px; padding: 28px 22px; text-align: left;
              box-shadow: 0 12px 32px rgba(143,111,20,0.08);
            }
            .feature-icon {
              width: 36px; height: 36px; border-radius: 10px;
              background: rgba(201,162,39,0.16);
              display: grid; place-items: center;
              margin-bottom: 16px;
            }
            .feature-icon svg { width: 18px; height: 18px; fill: #A8851F; }
            .feature h3 { margin: 0 0 10px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: var(--ink); }
            .feature p { margin: 0; font-size: 13.5px; font-weight: 500; line-height: 1.75; color: rgba(28,23,16,0.72); }
            
            /* ── "Why us" highlights card ── */
            .feature-wide {
  grid-column: 1 / -1;
  margin-bottom: 16px;   /* use 20px / 24px if you want more air */
}
            .feature-points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
            .feature-points li { font-size: 13.5px; font-weight: 500; line-height: 1.75; color: rgba(28,23,16,0.72); }
            .feature-points li::before { content: "✦"; color: var(--gold); margin-right: 10px; font-size: 11px; }

            /* ════════════════════════════════════════
               Path selector — selectable pick list
            ════════════════════════════════════════ */
            .experience-selector {
              display: flex; flex-direction: column; align-items: center; gap: 10px;
            }
            .path-field {
              width: min(100%, 640px);
              background: var(--card);
              border: 1.5px solid rgba(201,162,39,0.45);
              border-radius: 18px;
              padding: 7px;
              box-shadow: 0 12px 30px rgba(143,111,20,0.10);
            }
            .path-choice {
              display: flex;
              align-items: center;
              gap: 14px;
              width: 100%;
              padding: 13px 14px;
              border: none;
              border-radius: 13px;
              background: transparent;
              cursor: pointer;
              font-family: inherit;
              text-align: left;
              transition: background 0.15s, box-shadow 0.15s;
            }
            .path-choice + .path-choice { border-top: 1px solid rgba(201,162,39,0.18); }
            .path-choice:hover { background: rgba(201,162,39,0.08); }
            .path-choice.selected {
              background: rgba(201,162,39,0.15);
              box-shadow: inset 0 0 0 1.5px var(--gold);
            }
            .path-radio {
              width: 22px; height: 22px; flex-shrink: 0;
              border-radius: 50%;
              border: 2px solid rgba(28,23,16,0.25);
              display: grid; place-items: center;
              transition: border-color 0.15s;
            }
            .path-choice:hover .path-radio { border-color: rgba(201,162,39,0.7); }
            .path-choice.selected .path-radio { border-color: var(--gold); }
            .path-radio-dot {
              width: 10px; height: 10px; border-radius: 50%;
              background: var(--gold);
              transform: scale(0);
              transition: transform 0.18s cubic-bezier(.22,1,.36,1);
            }
            .path-choice.selected .path-radio-dot { transform: scale(1); }
            .path-choice-text { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
            .path-choice-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
            .path-name { font-family: var(--font-display), Georgia, serif; font-size: 16px; font-weight: 700; color: var(--ink); line-height: 1.1; }
            .path-tagline { font-size: 9.5px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; color: var(--gold-deep); }
            .path-desc { font-size: 12.5px; line-height: 1.55; color: var(--muted); }
            .path-glyph {
              width: 38px; height: 38px; flex-shrink: 0;
              border-radius: 10px;
              background: rgba(201,162,39,0.16);
              color: #A8851F;
              display: grid; place-items: center;
            }
            .path-glyph svg { width: 19px; height: 19px; }
            .path-hint { font-size: 12px; font-weight: 500; color: var(--muted); }

            .path-result {
              margin-top: 18px;
              width: min(100%, 640px);
              background: var(--card);
              border: 1px solid rgba(201,162,39,0.4);
              border-radius: 18px;
              padding: 26px 24px;
              text-align: center;
              box-shadow: 0 14px 34px rgba(143,111,20,0.12);
            }
            .path-result-title {
              display: block;
              font-family: var(--font-display), Georgia, serif;
              font-size: 15px; font-weight: 700;
              color: var(--gold-deep);
              letter-spacing: 0.4px; text-transform: uppercase;
              margin-bottom: 14px;
            }
            .path-perks { list-style: none; margin: 0 0 20px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
            .path-perks li { font-size: 13.5px; font-weight: 500; color: var(--ink-soft); }
            .path-perks li::before { content: "✦"; color: var(--gold); margin-right: 10px; font-size: 11px; }
            .path-cta { display: flex; flex-direction: column; align-items: center; gap: 10px; }
            .path-alt { font-size: 12.5px; font-weight: 600; color: var(--muted); }
            .path-alt:hover { color: #128C7E; }
            .path-soon { font-size: 12.5px; font-weight: 500; color: var(--muted); }

            /* ════════════════════════════════════════
               ContactUs component styles
            ════════════════════════════════════════ */

            .contact-flow { display: flex; justify-content: center; margin-top: 8px; }

            /* Primary CTA — dark ink with cream text (gold only as a hover halo) */
            .contact-us-btn {
              display: inline-flex; align-items: center; gap: 10px;
              padding: 16px 36px;
              border: none; border-radius: 100px;
              background: #1C1710;
              color: #FBFAF5;
              font-family: var(--font-display), serif;
              font-size: 15px; font-weight: 700; letter-spacing: 0.3px;
              cursor: pointer;
              box-shadow: 0 10px 30px rgba(28,23,16,0.28);
              transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
            }
            .contact-us-btn:hover {
              transform: translateY(-2px);
              background: #2B2317;
              box-shadow: 0 14px 36px rgba(28,23,16,0.35), 0 0 0 1.5px rgba(201,162,39,0.55);
            }

            /* Channel variants — used by the path selector's continue button */
            .contact-us-btn.telegram {
              background: var(--telegram);
              box-shadow: 0 10px 30px rgba(34,158,217,0.35);
            }
            .contact-us-btn.telegram:hover {
              background: #1B8FC4;
              box-shadow: 0 14px 36px rgba(34,158,217,0.45);
            }
            .contact-us-btn.whatsapp {
              background: var(--whatsapp);
              box-shadow: 0 10px 30px rgba(37,211,102,0.35);
            }
            .contact-us-btn.whatsapp:hover {
              background: #1FB457;
              box-shadow: 0 14px 36px rgba(37,211,102,0.45);
            }

            .contact-panel { display: flex; flex-direction: column; align-items: center; gap: 22px; width: 100%; }
            .selector-title {
              font-size: 11px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;
              color: var(--muted);
            }
            .selector-title strong { color: var(--ink); }

            /* Channels / pills — solid app colors */
            .channels { display: flex; flex-direction: column; align-items: center; gap: 14px; }
            .flow-summary { font-size: 13px; font-weight: 600; color: var(--muted); }
            .flow-summary b { color: var(--ink); }
            .contact-pills { display: flex; justify-content: center; align-items: center; flex-wrap: nowrap; gap: 12px; }
            .contact-pill {
              display: inline-flex; align-items: center; gap: 12px;
              padding: 13px 22px 13px 12px;
              border-radius: 23px;
              color: #fff;
              text-decoration: none;
              font-size: 15px; font-weight: 700; letter-spacing: 0.2px;
              transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
            }
            .contact-pill:hover { transform: translateY(-2px); filter: brightness(1.06); }
            .contact-pill.whatsapp { background: var(--whatsapp); box-shadow: 0 8px 24px rgba(37,211,102,0.30); }
            .contact-pill.telegram { background: var(--telegram); box-shadow: 0 8px 24px rgba(34,158,217,0.30); }
            .pill-icon-wrap {
              width: 34px; height: 34px; flex-shrink: 0;
              border-radius: 10px;
              background: rgba(255,255,255,0.20);
              display: grid; place-items: center;
            }
            .pill-glyph { width: 18px; height: 18px; fill: #fff; display: block; }
            .pill-arrow { width: 15px; height: 15px; flex-shrink: 0; opacity: 0.85; }
            .pill-label { white-space: nowrap; }
            .contact-close {
              align-self: center; margin-top: 4px;
              width: 34px; height: 34px;
              border-radius: 50%;
              border: 1px solid rgba(201,162,39,0.5);
              background: #FFFFFF;
              color: var(--muted);
              font-size: 17px; line-height: 1;
              cursor: pointer;
              transition: transform 0.25s, color 0.2s, background 0.2s;
            }
            .contact-close:hover { transform: rotate(90deg); color: var(--ink); background: rgba(201,162,39,0.12); }

            /* ── Footer ── */
            footer { padding: 36px 24px; background: var(--paper-deep); border-top: 1px solid var(--line); text-align: center; }
            .footer-name { font-size: 11px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: var(--gold-deep); margin-bottom: 8px; }
            .footer-copy { font-size: 11px; font-weight: 500; color: var(--muted); line-height: 1.6; margin: 0 auto; max-width: 560px; }

            /* ── Responsive ── */
            @media (max-width: 640px) {
              .brand-bar { padding: 12px 16px; }
              .brand-sub { display: none; }
              .body-section { padding: 48px 18px 72px; }
              .body-text { font-size: 15px; }
              .features { gap: 12px; }
              .features-grid-2 { grid-template-columns: 1fr; }
              .contact-pill { padding: 11px 14px 11px 10px; font-size: 14px; }
              .pill-arrow { display: none; }
              .contact-pills { gap: 10px; }
              .hero-market-insights { padding: 72px 18px 48px; }
              .hero-title { font-size: 28px; }
              .hero-text { font-size: 15.5px; margin-bottom: 32px; }
              .ticker { margin: 64px calc(50% - 50vw) 48px; }
              .path-field { width: 100%; }
              .path-choice { padding: 12px 12px; gap: 12px; }
              .path-glyph { display: none; }
            }

            /* ── Animations ── */
            @media (prefers-reduced-motion: no-preference) {
              .contact-panel.revealed,
              .channels.revealed {
                animation: pillIn 0.35s cubic-bezier(.22,1,.36,1) both;
              }
              @keyframes pillIn {
                from { opacity: 0; transform: translateY(10px) scale(.97); }
                to   { opacity: 1; transform: none; }
              }
              .path-result.revealed { animation: pathIn 0.35s cubic-bezier(.22,1,.36,1) both; }
              @keyframes pathIn {
                from { opacity: 0; transform: translateY(10px) scale(.97); }
                to   { opacity: 1; transform: none; }
              }
              .fade-up { animation: fadeUp 0.75s cubic-bezier(.22,1,.36,1) both; }
              @keyframes fadeUp {
                from { opacity: 0; transform: translateY(18px); }
                to   { opacity: 1; transform: none; }
              }
            }
          `,
        }}
      />

      <div>
        {/* ── Golden globe watermark (background pattern) ── */}
        <div className="bg-globe" aria-hidden="true" />

        {/* ── Nav ── */}
        <header className="brand-bar">
          <div className="brand-bar-inner">
            <Link href="/" className="brand">
              <Logo width={160} color="#1C1710" />
              <span className="brand-sub">Wisdom · Wealth · Legacy</span>
            </Link>

            {/* Navbar CTA → Telegram */}
            {ctaUrl && (
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="nav-cta">
                Connect with Us
              </a>
            )}
          </div>
        </header>

        {/* ── Hero: Market Insights ── */}
        <section className="hero-market-insights" id="contact">
          <div className="hero-inner fade-up">
            <h1 className="hero-title">
              <span className="hero-title-gold">RENAISSANCE</span>
              <br />
              <span style={{ whiteSpace: "nowrap" }}>INVESTORS CLUB</span>
            </h1>
            <p className="hero-text">
              Renaissance Investors and Retirement Club assist members during the accumulation phase of their finances as we focus on transformative investment strategies, different asset classes and opportunities characterized by creativity, originality, and forward-thinking tips to help members in their journey.
            </p>

            <div className="hero-contact">
              <ContactUs
                whatsappUrl={WHATSAPP_URL}
                telegramUrl={TELEGRAM_URL}
                whatsappEnabled={whatsappEnabled}
                telegramEnabled={telegramEnabled}
              />
            </div>
          </div>
        </section>

        {/* ── Original Hero (Banner) ── */}
        <section className="hero">
          <Image
            src="/banner.jpg"
            alt="Renaissance Investors Club — golden globe emblem"
            width={1536}
            height={802}
            priority
            sizes="100vw"
            className="hero-image"
          />
          <div className="hero-fade" aria-hidden="true" />
        </section>

        {/* ── Features & Experience ── */}
        <section className="body-section">
          <div className="body-inner fade-up">
            <div className="eyebrow">Why us?</div>
            <div className="feature feature-wide">
              <ul className="feature-points">
                <li>Proven Track records</li>
                <li>Expert team with cutting-edge insights</li>
                <li>Tailored investment plan just for you</li>
                <li>Smarter investing with innovative tools</li>
                <li>Our commitment to transparency, trust & </li>
                <li>Building a supportive syndicate.</li>
              </ul>
            </div>
            <div className="features features-grid-2">
              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a5 5 0 110 10A5 5 0 0112 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z" />
                  </svg>
                </div>
                <h3>Mentorship</h3>
                <p>We are a community of personal finance and FIRE enthusiasts dedicated to sharing knowledge about building wealth, long-term investing, and all things related to money</p>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                </div>
                <h3>Guidance</h3>
                <p>No matter where you are in your financial journey, this is a space for supporting each other and fostering discussions that will help you achieve your goals.</p>
              </div>
            </div>
          </div>

          {/* ── Ticker (full width) ── */}
          <div className="ticker" role="status" aria-label="Now accepting new members">
            <div className="ticker-track">
              {[0, 1].map((copy) => (
                <div className="ticker-group" key={copy} aria-hidden={copy === 1}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span className="ticker-item" key={i}>
                      Now accepting new members
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="body-inner fade-up">
            <div className="eyebrow">Choose Your Path</div>
            <ExperienceSelector
              telegramUrl={TELEGRAM_URL}
              whatsappUrl={WHATSAPP_URL}
              telegramEnabled={telegramEnabled}
              whatsappEnabled={whatsappEnabled}
            />
          </div>
        </section>

        {/* ── Footer ── */}
        <footer>
          <div className="footer-name">Renaissance Investors Club</div>
          <p className="footer-copy">
            © {new Date().getFullYear()} Renaissance Investors Club. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
