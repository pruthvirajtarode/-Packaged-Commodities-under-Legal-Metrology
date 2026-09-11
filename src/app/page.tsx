"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ScanLine, FileText, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative text-white overflow-x-hidden">
      {/* Background Image with Overlay */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/hero-generated.png")' }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </motion.div>

      {/* Content wrapper to stay above background */}
      <div className="relative z-10 flex flex-col min-h-screen items-center">
        
        {/* Transparent Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-7xl px-4 md:px-8 py-4 md:py-6 flex justify-between items-center mt-2 md:mt-4"
        >
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 md:p-2 rounded-lg shadow-lg shadow-orange-500/20">
              <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wider">PackSure AI</h1>
          </div>
          <div className="flex gap-3 md:gap-4">
            <Link href="/dashboard" className="hidden sm:block">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md bg-transparent transition-all">
                View Demo Dashboard
              </Button>
            </Link>
            <Link href="/inspections/new">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg shadow-orange-500/30 transition-transform hover:scale-105">
                Start Inspection
              </Button>
            </Link>
          </div>
        </motion.header>

        {/* Hero Main Content */}
        <main className="flex-1 w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center py-12 md:py-20 text-center">
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-4 md:mb-6 font-serif drop-shadow-xl leading-tight"
          >
            Verify Product Labels.<br/>
            <span className="text-orange-400 italic font-medium bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">Before They Reach Consumers.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 md:mb-12 leading-relaxed drop-shadow-md"
          >
            AI-assisted Legal Metrology compliance screening for packaged commodities using computer vision, OCR and explainable rule-based validation.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0"
          >
            <Link href="/inspections/new" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-8 text-base md:text-lg bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/40 border-0 transition-all hover:scale-105 hover:shadow-orange-500/60 group">
                <ScanLine className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" /> Start Live Scan
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-8 text-base md:text-lg bg-black/40 hover:bg-black/60 border-white/20 text-white backdrop-blur-md transition-all group">
                Explore Dashboard <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Feature Cards below fold */}
          <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl">
            {[
              {
                icon: ScanLine,
                color: "blue",
                title: "AI Label Scanning",
                desc: "Instant extraction of critical fields like MRP, Net Quantity, and Manufacturer details using advanced OCR."
              },
              {
                icon: CheckCircle,
                color: "orange",
                title: "Rule-based Compliance",
                desc: "Automated evaluation against versioned Legal Metrology (Packaged Commodities) Rules, 2011."
              },
              {
                icon: FileText,
                color: "green",
                title: "Audit-Ready Reports",
                desc: "Generate professional, explainable compliance PDFs instantly with human-in-the-loop verification."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 + (idx * 0.2) }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:bg-black/60 transition-colors shadow-2xl relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-b from-${feature.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className={`w-14 h-14 bg-${feature.color}-500/20 rounded-full flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white relative z-10">{feature.title}</h3>
                <p className="text-slate-300 relative z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </main>
        
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="w-full py-8 text-center text-white/50 text-sm border-t border-white/10 mt-auto bg-black/40 backdrop-blur-sm"
        >
          <p>Smart India Hackathon 2026 Prototype &bull; Problem Statement SIH26034 &bull; PackSure AI</p>
        </motion.footer>
      </div>
    </div>
  );
}
