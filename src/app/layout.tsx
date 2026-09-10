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
  description: "AI-assisted Legal Metrology compliance screening for packaged commodities",
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
