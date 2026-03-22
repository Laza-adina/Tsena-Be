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

export const metadata = {
  title: 'Tsen@be — Votre boutique en ligne Madagascar',
  description: 'Créez votre mini-boutique en ligne en 5 minutes. Partagez vos produits sur Facebook et recevez les commandes via WhatsApp. Simple, rapide, adapté à Madagascar.',
  keywords: 'boutique en ligne madagascar, vente en ligne madagascar, whatsapp commerce, facebook marketplace madagascar,tsenabe,tsena,tena be, tsena-be, boutique enligne, gratuit,10000ar,creation de site web,web,madagascar,keyros,shop,shopify,Laza,Rayan,informatique,saas,SaaS,bon marche',
  openGraph: {
    title: 'Tsen@be — Votre boutique en ligne Madagascar',
    description: 'Créez votre mini-boutique en ligne en 5 minutes.',
    url: 'https://tsenabe.app',
    siteName: 'Tsen@be',
    locale: 'fr_MG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tsen@be',
    description: 'Créez votre mini-boutique en ligne Madagascar',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
