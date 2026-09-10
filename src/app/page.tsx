import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ScanLine, FileText, CheckCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative text-white overflow-x-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/hero-bg.png")' }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Content wrapper to stay above background */}
      <div className="relative z-10 flex flex-col min-h-screen items-center">
        
        {/* Transparent Header */}
        <header className="w-full max-w-7xl px-4 md:px-8 py-4 md:py-6 flex justify-between items-center mt-2 md:mt-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 md:p-2 rounded-lg shadow-lg shadow-orange-500/20">
              <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wider">PackSure AI</h1>
          </div>
          <div className="flex gap-3 md:gap-4">
            <Link href="/dashboard" className="hidden sm:block">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md bg-transparent">
                View Demo Dashboard
              </Button>
            </Link>
            <Link href="/inspections/new">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg shadow-orange-500/30">
                Start Inspection
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Main Content */}
        <main className="flex-1 w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center py-12 md:py-20 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-4 md:mb-6 font-serif drop-shadow-xl leading-tight">
            Verify Product Labels.<br/>
            <span className="text-orange-400 italic font-medium">Before They Reach Consumers.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mb-8 md:mb-12 leading-relaxed drop-shadow-md">
            AI-assisted Legal Metrology compliance screening for packaged commodities using computer vision, OCR and explainable rule-based validation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0">
            <Link href="/inspections/new" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-8 text-base md:text-lg bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 border-0 transition-all hover:scale-105">
                <ScanLine className="mr-2 h-5 w-5" /> Start Live Scan
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-8 text-base md:text-lg bg-black/40 hover:bg-black/60 border-white/20 text-white backdrop-blur-md transition-all">
                Explore Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Feature Cards below fold */}
          <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl">
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:bg-black/60 transition-colors">
              <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <ScanLine className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Label Scanning</h3>
              <p className="text-slate-300">Instant extraction of critical fields like MRP, Net Quantity, and Manufacturer details using advanced OCR.</p>
            </div>
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:bg-black/60 transition-colors">
              <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-7 w-7 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Rule-based Compliance</h3>
              <p className="text-slate-300">Automated evaluation against versioned Legal Metrology (Packaged Commodities) Rules, 2011.</p>
            </div>
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:bg-black/60 transition-colors">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Audit-Ready Reports</h3>
              <p className="text-slate-300">Generate professional, explainable compliance PDFs instantly with human-in-the-loop verification.</p>
            </div>
          </div>
        </main>
        
        <footer className="w-full py-8 text-center text-white/50 text-sm border-t border-white/10 mt-auto">
          <p>Smart India Hackathon 2026 Prototype &bull; Problem Statement SIH26034 &bull; PackSure AI</p>
        </footer>
      </div>
    </div>
  );
}
