import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

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
      <body className={`${inter.className} bg-slate-50 antialiased`}>
        <TooltipProvider>
          <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto bg-slate-50 relative">
              <main className="mx-auto max-w-7xl p-6 md:p-8">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
