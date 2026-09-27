import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://renaissanceinvestorsclub.com"),
  title: "Renaissance Investors Club — Wisdom · Wealth · Legacy",
  description:
    "Join Renaissance Investors Club to invest with clarity and confidence. Access market insights, curated education, and expert trading guidance for wealth growth, passive income, and legacy building.",
  keywords: [
    "Renaissance Investors Club",
    "investors club",
    "Wisdom Wealth Legacy",
    "financial freedom",
    "wealth building",
    "retirement planning",
    "passive income",
    "investment strategies",
    "trading guidance",
    "market insights",
    "financial education",
  ],
  authors: [{ name: "Renaissance Investors Club" }],
  alternates: { canonical: "/" },
  other: {
    "fb:app_id": "YOUR_APP_ID_HERE",
  },
  openGraph: {
    title: "Renaissance Investors Club — Wisdom · Wealth · Legacy",
    description:
      "Join Renaissance Investors Club to invest with clarity and confidence. Market insights, curated education, and expert trading guidance for wealth growth, passive income, and legacy building.",
    url: "https://renaissanceinvestorsclub.com",
    siteName: "Renaissance Investors Club",
    type: "website",
    images: [
      {
        url: "https://renaissanceinvestorsclub.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Renaissance Investors Club — Wisdom · Wealth · Legacy. Golden globe emblem.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renaissance Investors Club",
    description:
      "Join Renaissance Investors Club to invest with clarity and confidence. Market insights, curated education, and expert trading guidance for wealth growth, passive income, and legacy building.",
    images: ["https://renaissanceinvestorsclub.com/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FBFAF5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${display.variable} ${body.variable} antialiased min-h-screen m-0 p-0 overflow-x-hidden`}
        style={{
          backgroundColor: "#FBFAF5",
          color: "#1C1710",
          fontFamily: "var(--font-body), system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
