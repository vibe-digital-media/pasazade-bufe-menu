import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pasazadebufe.com"),

  title: {
    default: "Paşazade Büfe | Beyazıt İstanbul Büfe & Paket Servis",
    template: "%s | Paşazade Büfe",
  },

  description:
    "Paşazade Büfe, Beyazıt İstanbul’da yarım ekmek, dürüm, tost, sandviç, sıcak ve soğuk içecek seçenekleriyle hizmet veren lezzet noktasıdır.",

  keywords: [
    "Paşazade Büfe",
    "Beyazıt büfe",
    "İstanbul büfe",
    "Beyazıt tost",
    "Beyazıt dürüm",
    "Beyazıt sandviç",
    "İstanbul paket servis",
    "Sucu Baki Sokak büfe",
    "Kapalıçarşı yakın büfe",
    "Sultanahmet yakın yemek",
  ],

  authors: [{ name: "Paşazade Büfe" }],
  creator: "Paşazade Büfe",
  publisher: "Paşazade Büfe",

  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/tr/menu",
      "en-US": "/en/menu",
      "de-DE": "/de/menu",
      "ru-RU": "/ru/menu",
    },
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://pasazadebufe.com",
    siteName: "Paşazade Büfe",
    title: "Paşazade Büfe | Beyazıt İstanbul Büfe",
    description:
      "Beyazıt İstanbul’da yarım ekmek, dürüm, tost, sandviç, sıcak ve soğuk içecek seçenekleri.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Paşazade Büfe Beyazıt İstanbul",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Paşazade Büfe | Beyazıt İstanbul Büfe",
    description:
      "Beyazıt İstanbul’da yarım ekmek, dürüm, tost, sandviç, sıcak ve soğuk içecek seçenekleri.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Paşazade Büfe",
    image: "https://pasazadebufe.com/og-image.jpg",
    url: "https://pasazadebufe.com",
    telephone: "+902125178513",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mimar Hayrettin Mah, Beyazıt, Sucu Baki Sk. No:2/1",
      addressLocality: "Fatih",
      addressRegion: "İstanbul",
      postalCode: "34126",
      addressCountry: "TR",
    },
    servesCuisine: ["Turkish", "Fast Food", "Sandwich", "Toast", "Wrap"],
    priceRange: "₺₺",
  };

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}