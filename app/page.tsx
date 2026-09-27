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
  weight: ["300", "400", "700"],
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

    // Backfill columns if the table already existed
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

  // Navbar CTA + Bottom CTA both point to Telegram (respects the admin toggle)
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
              font-family: var(--font-body), system-ui, sans-serif;
              -webkit-font-smoothing: antialiased;
              position: relative;
            }

            /* ══════════════════════════════════════════
               BACKGROUND: golden globe & latitude lines
            ══════════════════════════════════════════ */

            /* Gold star-specks, soft halo, fine dot lattice */
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

            /* The golden globe watermark — meridians, latitudes,
               faint continents and glowing gold nodes */
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

            /* Golden latitude arcs rising over the lower page (globe horizon) */
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
              font-family: var(--font-body), system-ui, sans-serif;
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

            /* Nav CTA as plain text */
            .nav-cta {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1.6px;
              text-transform: uppercase;
              color: var(--ink-soft);
              background: transparent;
              border-radius: 0;
              padding: 4px 0;
              transition: color 0.2s;
              white-space: nowrap;
              cursor: pointer;
              border: none;
              text-decoration: none;
              box-shadow: none;
              display: inline-flex;
              align-items: center;
            }
            .nav-cta:hover { color: var(--gold-deep); transform: none; }

            /* ── Bottom CTA bar ── */
            .bottom-cta-bar {
              position: relative;
              z-index: 1;
              display: flex;
              justify-content: center;
              padding: 48px 24px 80px;
              pointer-events: auto;
              background: transparent;
            }
            .bottom-cta-bar > * { pointer-events: auto; }

            /* Distinct styling for the Bottom CTA Pill (metallic gold) */
            .bottom-cta-bar .nav-cta {
              font-size: 14px;
              font-weight: 700;
              letter-spacing: 0.6px;
              text-transform: uppercase;
              color: #241B06;
              background: linear-gradient(135deg, #A8821E 0%, #C9A227 38%, #F3E3A6 52%, #C9A227 66%, #A8821E 100%);
              border-radius: 100px;
              padding: 16px 36px;
              box-shadow: 0 10px 30px rgba(176,138,30,0.38);
              transition: box-shadow 0.2s, transform 0.15s;
              display: inline-block;
            }
            .bottom-cta-bar .nav-cta:hover {
              transform: translateY(-2px);
              box-shadow: 0 14px 38px rgba(176,138,30,0.48);
              color: #241B06;
            }

            /* ── Hero: Market Insights ── */
            .hero-market-insights {
              position: relative;
              padding: 110px 24px 80px;
              text-align: left;
              z-index: 1;
            }
            .hero-inner {
              max-width: 900px;
              margin: 0 auto;
            }
            .hero-title {
              font-size: 44px;
              font-weight: 800;
              margin: 0 0 18px;
              line-height: 1.08;
              letter-spacing: 0.01em;
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
              font-size: 15.5px;
              line-height: 1.8;
              color: var(--ink-soft);
              max-width: 760px;
              margin: 0 auto 40px;
            }
            .hero-experience {
              display: flex;
              justify-content: center;
              margin-bottom: 32px;
            }

            .hero-contact {
              display: flex;
              justify-content: left;
            }

            /* ── ExperienceSelector ── */
            .experience-selector {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
            }

            /* ── Original Hero (Banner) ── */
            .hero { position: relative; width: 100%; line-height: 0; background: var(--paper); }
            .hero-image { display: block; width: 100%; height: auto; object-fit: cover; }
            .hero-fade {
              position: absolute; bottom: 0; left: 0; right: 0; height: 140px;
              background: linear-gradient(to bottom, transparent 0%, var(--paper) 100%);
              pointer-events: none; z-index: 2;
            }

            /* ── Body section ── */
            .body-section {
              padding: 64px 24px 88px;
              background: transparent;
              position: relative;
              overflow: visible;
              z-index: 2;
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
            .features-grid-2 {
              grid-template-columns: repeat(2, 1fr);
              max-width: 800px;
              margin: 0 auto;
            }
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

            /* ════════════════════════════════════════
               ContactUs component styles
            ════════════════════════════════════════ */

            .contact-flow {
              display: flex;
              justify-content: center;
              margin-top: 8px;
            }
            .contact-us-btn {
              display: inline-flex;
              align-items: center;
              gap: 10px;
              padding: 16px 36px;
              border: none;
              border-radius: 100px;
              background: linear-gradient(135deg, #A8821E 0%, #C9A227 38%, #F3E3A6 52%, #C9A227 66%, #A8821E 100%);
              color: #241B06;
              font-family: var(--font-display), serif;
              font-size: 15px;
              font-weight: 700;
              letter-spacing: 0.3px;
              cursor: pointer;
              box-shadow: 0 10px 30px rgba(176,138,30,0.35);
              transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
            }
            .contact-us-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 14px 36px rgba(176,138,30,0.45);
              filter: brightness(1.04);
            }
            .contact-panel {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 22px;
              width: 100%;
            }
            .selector-row {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 18px;
            }
            .selector-block {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
            }
            .selector-title {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1.8px;
              text-transform: uppercase;
              color: var(--muted);
              font-family: var(--font-body), system-ui, sans-serif;
            }
            .selector-title strong { color: var(--ink); }

            /* Dropdown */
            .dropdown { position: relative; }
            .dropdown-backdrop {
              position: fixed;
              inset: 0;
              z-index: 25;
              background: transparent;
            }
            .dropdown-toggle {
              appearance: none;
              -webkit-appearance: none;
              display: inline-flex;
              align-items: center;
              justify-content: space-between;
              gap: 14px;
              width: 100%;
              min-width: 260px;
              padding: 14px 22px;
              border-radius: 100px;
              border: 1.5px solid rgba(201,162,39,0.45);
              background: rgba(255,255,255,0.72);
              color: var(--ink);
              font-family: var(--font-display), serif;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              text-align: left;
              transition: border-color 0.2s, background 0.2s;
            }
            .dropdown-toggle:hover {
              border-color: var(--gold);
              background: #ffffff;
            }
            .dropdown-value.placeholder { color: var(--muted); }
            .dropdown-chevron {
              flex-shrink: 0;
              color: var(--gold-deep);
              transition: transform 0.
