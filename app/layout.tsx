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
  title: "2042 — Ton futur job selon Loan",
  description:
    "Loan revient de 2042 et a vu ton futur job. Colle ton profil LinkedIn et découvre ce que tu feras dans 18 ans.",
  openGraph: {
    title: "2042 — Ton futur job selon Loan",
    description:
      "Loan revient de 2042 avec de bonnes nouvelles pour ta carrière.",
    type: "website",
    url: "https://loan.nanocorp.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          src="https://phospho-nanocorp-prod--nanocorp-api-fastapi-app.modal.run/beacon/snippet.js?s=loan"
          defer
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
