"use client";

import { useEffect, useState } from "react";

/* ── Renaissance palette (matches the public site) ── */
const paper = "#FBFAF5";
const card = "#FFFFFF";
const gold = "#C9A227";
const goldDeep = "#8F6F14";
const ink = "#1C1710";
const text = ink;
const textMuted = "rgba(28,23,16,0.55)";
const line = "rgba(201,162,39,0.35)";
const error = "#EF4444";
const success = "#25D366";
const whatsappColor = "#25D366";
const telegramColor = "#229ED9";
const livechatColor = "#2dd4bf";
const btnText = "#241B06";
const goldGradient =
  "linear-gradient(135deg, #A8821E 0%, #C9A227 38%, #F3E3A6 52%, #C9A227 66%, #A8821E 100%)";

/* Golden globe watermark (same mark as the homepage background) */
const GLOBE_BG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><g fill='none' stroke='%23C9A227'><circle cx='300' cy='300' r='286' stroke-opacity='0.4' stroke-width='1.4'/><ellipse cx='300' cy='300' rx='100' ry='286' stroke-opacity='0.24' stroke-width='1.1'/><ellipse cx='300' cy='300' rx='196' ry='286' stroke-opacity='0.2' stroke-width='1.1'/><ellipse cx='300' cy='300' rx='286' ry='90' stroke-opacity='0.28' stroke-width='1.1'/><ellipse cx='300' cy='208' rx='252' ry='55' stroke-opacity='0.18' stroke-width='1'/><ellipse cx='300' cy='392' rx='252' ry='55' stroke-opacity='0.18' stroke-width='1'/></g></svg>")`;

const GlobeWatermark = () => (
  <div
    aria-hidden="true"
    style={{
      position: "fixed",
      inset: 0,
      backgroundImage: GLOBE_BG,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "50% 6%",
      backgroundSize: "min(92vmin, 620px)",
      pointerEvents: "none",
      zIndex: 0,
    }}
  />
);

/* Small golden globe — the portal monogram */
const GlobeMark = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={goldDeep}
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10.5" />
    <ellipse cx="12" cy="12" rx="4.2" ry="10.5" />
    <ellipse cx="12" cy="12" rx="9" ry="10.5" strokeOpacity="0.55" />
    <ellipse cx="12" cy="12" rx="10.5" ry="3.6" />
    <line x1="1.5" y1="12" x2="22.5" y2="12" strokeOpacity="0.55" />
  </svg>
);

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");
  const [livechat, setLivechat] = useState("");
  const [agentName, setAgentName] = useState("");

  // Visibility toggles
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [livechatEnabled, setLivechatEnabled] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!authed) return;
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => {
        setWhatsapp(data.whatsapp || "");
        setTelegram(data.telegram || "");
        setLivechat(data.livechat || "");
        setAgentName(data.agentName || "");

        // Load visibility states (default to true if not yet present in DB)
        setWhatsappEnabled(data.whatsappEnabled !== false);
        setTelegramEnabled(data.telegramEnabled !== false);
        setLivechatEnabled(data.livechatEnabled !== false);

        setLoading(false);
      });
  }, [authed]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    });
    const data = await res.json();
    if (data.success) {
      setAuthed(true);
    } else {
      setLoginError(data.error || "Login failed");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMessage("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        whatsapp,
        telegram,
        livechat,
        agentName,
        whatsappEnabled,
        telegramEnabled,
        livechatEnabled,
      }),
    });
    const data = await res.json();
    setSaving(false);
    setSaveMessage(data.success ? "Saved!" : data.error || "Failed to save");
  }

  // --- Custom Toggle Switch Component ---
  const ToggleSwitch = ({
    checked,
    onChange,
    color,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    color: string;
  }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: checked ? color : line,
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s ease",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: 3,
          left: checked ? 19 : 3,
          transition: "left 0.2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );

  // --- Login Screen ---
  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: paper,
          padding: "32px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body), system-ui, sans-serif",
        }}
      >
        <GlobeWatermark />
        <div
          style={{
            maxWidth: 380,
            width: "100%",
            margin: "0 auto",
            background: card,
            padding: "32px 24px",
            borderRadius: 12,
            border: `1px solid ${line}`,
            boxShadow: "0 16px 40px rgba(143,111,20,0.12)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: `1px solid ${gold}`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <GlobeMark size={26} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                color: text,
                fontSize: 24,
                margin: "0 0 6px",
                fontWeight: 600,
              }}
            >
              Admin Portal
            </h1>
            <p style={{ color: goldDeep, fontSize: 13, margin: 0, letterSpacing: "0.5px" }}>
              Renaissance Investors Club
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label
              style={{
                display: "block",
                color: textMuted,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: `1px solid ${line}`,
                background: paper,
                color: text,
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 16,
              }}
            />

            {loginError && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(239, 68, 68, 0.08)",
                  border: `1px solid rgba(239, 68, 68, 0.25)`,
                  color: error,
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 8,
                border: "none",
                background: goldGradient,
                color: btnText,
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 8px 22px rgba(176,138,30,0.30)",
              }}
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: paper,
        padding: "32px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-body), system-ui, sans-serif",
      }}
    >
      <GlobeWatermark />
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          margin: "0 auto",
          background: card,
          padding: "28px 24px",
          borderRadius: 12,
          border: `1px solid ${line}`,
          boxShadow: "0 16px 40px rgba(143,111,20,0.12)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${line}`,
            paddingBottom: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: success,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: success,
                }}
              />
              Authenticated
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                color: text,
                fontSize: 22,
                margin: 0,
                fontWeight: 600,
              }}
            >
              Edit Community Links
            </h1>
          </div>

          <button
            onClick={() => setAuthed(false)}
            style={{
              background: "transparent",
              border: `1px solid ${line}`,
              color: textMuted,
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Lock
          </button>
        </div>

        {loading ? (
          <div
            style={{
              padding: "32px 0",
              textAlign: "center",
              color: textMuted,
              fontSize: 14,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                border: `2px solid ${line}`,
                borderTopColor: gold,
                borderRadius: "50%",
                margin: "0 auto 10px",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style
              dangerouslySetInnerHTML={{
                __html: `@keyframes spin { to { transform: rotate(360deg); } }`,
              }}
            />
            Retrieving database values...
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* WhatsApp URL */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: textMuted,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: whatsappColor,
                    }}
                  />
                  WhatsApp Group URL
                </div>
                <ToggleSwitch
                  checked={whatsappEnabled}
                  onChange={setWhatsappEnabled}
                  color={whatsappColor}
                />
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="https://wa.link/..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${line}`,
                  background: paper,
                  color: text,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  opacity: whatsappEnabled ? 1 : 0.5,
                  transition: "opacity 0.2s ease",
                }}
              />
            </div>

            {/* Telegram URL */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: textMuted,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: telegramColor,
                    }}
                  />
                  Telegram Channel URL
                </div>
                <ToggleSwitch
                  checked={telegramEnabled}
                  onChange={setTelegramEnabled}
                  color={telegramColor}
                />
              </label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="https://t.me/..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${line}`,
                  background: paper,
                  color: text,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  opacity: telegramEnabled ? 1 : 0.5,
                  transition: "opacity 0.2s ease",
                }}
              />
            </div>

            {/* Live Chat URL */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: textMuted,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: livechatColor,
                    }}
                  />
                  Live Chat URL
                </div>
                <ToggleSwitch
                  checked={livechatEnabled}
                  onChange={setLivechatEnabled}
                  color={livechatColor}
                />
              </label>
              <input
                type="text"
                value={livechat}
                onChange={(e) => setLivechat(e.target.value)}
                placeholder="https://t.me/... (live chat bot or group)"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${line}`,
                  background: paper,
                  color: text,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  opacity: livechatEnabled ? 1 : 0.5,
                  transition: "opacity 0.2s ease",
                }}
              />
            </div>

            {/* Agent Name */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: textMuted,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: livechatColor,
                  }}
                />
                Agent Name
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Enter live chat agent name"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${line}`,
                  background: paper,
                  color: text,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 8,
                border: "none",
                background: goldGradient,
                color: btnText,
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: saving ? "default" : "pointer",
                opacity: saving ? 0.6 : 1,
                boxShadow: "0 8px 22px rgba(176,138,30,0.30)",
              }}
            >
              {saving ? "Updating..." : "Save Changes"}
            </button>

            {/* Status */}
            {saveMessage && (
              <div
                style={{
                  marginTop: 12,
                  padding: "12px",
                  borderRadius: 8,
                  background:
                    saveMessage === "Saved!"
                      ? "rgba(37, 211, 102, 0.10)"
                      : "rgba(239, 68, 68, 0.08)",
                  border: `1px solid ${
                    saveMessage === "Saved!"
                      ? "rgba(37, 211, 102, 0.3)"
                      : "rgba(239, 68, 68, 0.25)"
                  }`,
                  color: saveMessage === "Saved!" ? "#1B8A4B" : error,
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {saveMessage === "Saved!"
                  ? "✓ Changes saved successfully"
                  : saveMessage}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
