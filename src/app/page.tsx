import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ScanLine, FileText, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <header className="w-full max-w-7xl px-8 py-6 flex justify-between items-center bg-white shadow-sm mt-4 rounded-2xl">
        <div className="flex items-center gap-2 text-slate-900">
          <div className="bg-orange-500 p-2 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">PackSure AI</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">View Demo Dashboard</Button>
          </Link>
          <Link href="/inspections/new">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Start Inspection</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl px-8 flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6">
          Verify Product Labels. <br />
          <span className="text-orange-500">Before They Reach Consumers.</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          AI-assisted Legal Metrology compliance screening for packaged commodities using computer vision, OCR and explainable rule-based validation.
        </p>
        <div className="flex gap-4">
          <Link href="/inspections/new">
            <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl">
              <ScanLine className="mr-2 h-5 w-5" /> Start Live Scan
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white border-slate-200">
              Explore Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <ScanLine className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Label Scanning</h3>
            <p className="text-slate-500">Instant extraction of critical fields like MRP, Net Quantity, and Manufacturer details using advanced OCR.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-7 w-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Rule-based Compliance</h3>
            <p className="text-slate-500">Automated evaluation against versioned Legal Metrology (Packaged Commodities) Rules, 2011.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Audit-Ready Reports</h3>
            <p className="text-slate-500">Generate professional, explainable compliance PDFs instantly with human-in-the-loop verification.</p>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-8 text-center text-slate-400 text-sm border-t">
        <p>Smart India Hackathon 2026 Prototype &bull; Problem Statement SIH26034 &bull; PackSure AI</p>
      </footer>
    </div>
  );
}
