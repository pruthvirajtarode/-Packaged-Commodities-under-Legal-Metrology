import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ContentWrapper } from "@/components/ContentWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PackSure AI | Legal Metrology Compliance",
  description: "AI-assisted Legal Metrology compliance screening for packaged commodities. Verify product labels with computer vision and OCR before they reach consumers.",
  keywords: ["Legal Metrology", "Packaged Commodities", "AI Compliance", "OCR Label Scanning", "Supply Chain Verification", "Smart India Hackathon", "PackSure AI"],
  authors: [{ name: "PackSure AI Team" }],
  openGraph: {
    title: "PackSure AI | AI-assisted Legal Metrology Compliance",
    description: "Automate compliance screening for packaged commodities using computer vision and explainable rule-based validation.",
    url: "https://packsure-ai.vercel.app",
    siteName: "PackSure AI",
    images: [
      {
        url: "/hero-generated.png",
        width: 1200,
        height: 630,
        alt: "PackSure AI Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PackSure AI | Compliance Automation",
    description: "AI-assisted Legal Metrology compliance screening for packaged commodities.",
    images: ["/hero-generated.png"],
  },
};

export const viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 antialiased print:bg-white`}>
        <TooltipProvider>
          <div className="flex flex-col md:flex-row h-screen overflow-hidden print:h-auto print:overflow-visible">
            <Sidebar />
            <div className="flex-1 overflow-auto bg-slate-50 relative print:bg-white print:overflow-visible">
              <ContentWrapper>
                {children}
              </ContentWrapper>
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
