import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ContentWrapper } from "@/components/ContentWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScanSure AI | Legal Metrology Compliance",
  description: "AI-powered dashboard for scanning and verifying packaged commodity labels against Legal Metrology guidelines.",
  keywords: ["Legal Metrology", "Packaged Commodities", "AI Compliance", "OCR Label Scanning", "Supply Chain Verification", "Smart India Hackathon", "ScanSure AI"],
  authors: [{ name: "ScanSure AI Team" }],
  openGraph: {
    title: "ScanSure AI | AI-assisted Legal Metrology Compliance",
    description: "Ensure compliance with Legal Metrology rules using AI and OCR.",
    url: "https://scansure-ai.vercel.app",
    siteName: "ScanSure AI",
    images: [
      {
        url: "/hero-generated.png",
        width: 1200,
        height: 630,
        alt: "ScanSure AI Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScanSure AI | Compliance Automation",
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
