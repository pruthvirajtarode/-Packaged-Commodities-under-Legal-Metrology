"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UploadCloud, Camera, Loader2, ArrowRight, ScanLine } from "lucide-react";
import { performOCR } from "@/lib/ocr";
import Image from "next/image";

export default function NewInspectionPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [demoScenario, setDemoScenario] = useState<string>("COMPLIANT");
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("Initializing scan...");

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const startScan = async () => {
    if (!previewUrl) return;
    setIsProcessing(true);
    setStep(2);
    
    try {
      // 1. Create inspection
      setProgressStatus("Creating inspection record...");
      const resCreate = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProductId })
      });
      const inspection = await resCreate.json();
      
      if (!resCreate.ok || !inspection.id) {
        throw new Error(inspection.error || "Failed to create inspection record");
      }

      // 2. Save Image (Mocked as data URI for demo)
      setProgressStatus("Uploading high-resolution image...");
      await fetch(`/api/inspections/${inspection.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: previewUrl, type: 'FRONT' })
      });

      // 3. OCR Processing
      setProgressStatus("Pre-processing image...");
      await new Promise(r => setTimeout(r, 1500));
      setProgressStatus("OCR in progress... extracting text");
      
      const extractedFields = await performOCR(previewUrl);

      // Force demo logic overrides for presentation guarantees
      if (demoScenario === 'NON_COMPLIANT') {
        const mrpField = extractedFields.find(f => f.fieldKey === 'mrp');
        if (mrpField) mrpField.value = ''; // simulate missing MRP
      } else if (demoScenario === 'REQUIRES_REVIEW') {
        const netQty = extractedFields.find(f => f.fieldKey === 'netQuantity');
        if (netQty) netQty.confidence = 55; // Low confidence
      }

      // 4. Compliance Engine
      setProgressStatus("Applying Legal Metrology compliance rules...");
      await new Promise(r => setTimeout(r, 1000));
      
      const resAnalyze = await fetch(`/api/inspections/${inspection.id}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          extractedFields, 
          demoMode: demoScenario === 'NON_COMPLIANT'
        })
      });

      setProgressStatus("Generating explainable findings...");
      await new Promise(r => setTimeout(r, 800));

      // 5. Redirect to results
      router.push(`/inspections/${inspection.id}`);

    } catch (err) {
      console.error(err);
      alert('Error during scan.');
      setIsProcessing(false);
      setStep(1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">New Inspection Scan</h2>
        <p className="text-slate-500 mt-1">Upload a product label image to automatically verify Legal Metrology compliance.</p>
      </div>

      {step === 1 && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Step 1: Product & Image</CardTitle>
            <CardDescription>Select the product and capture or upload the label image.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Target Product (Optional)</Label>
                <select 
                  value={selectedProductId} 
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-700"
                >
                  <option value="" disabled>Select a product from database</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <Label>Demo Scenario Override (SIH Presentation)</Label>
                <select 
                  value={demoScenario} 
                  onChange={(e) => setDemoScenario(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-700 font-medium"
                >
                  <option value="COMPLIANT">Fully Compliant</option>
                  <option value="NON_COMPLIANT">Non-Compliant (Missing MRP)</option>
                  <option value="REQUIRES_REVIEW">Requires Review (Low Confidence OCR)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Package Image</Label>
              {!previewUrl ? (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <div className="flex gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <UploadCloud className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Camera className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">Upload or Capture Image</h3>
                  <p className="text-sm text-slate-500 mt-1">JPEG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="relative border rounded-xl overflow-hidden bg-slate-100 flex justify-center items-center h-80">
                  <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => setPreviewUrl(null)}
                  >
                    Change Image
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end bg-slate-50 p-4 border-t rounded-b-xl">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-md"
              disabled={!previewUrl}
              onClick={startScan}
            >
              Start AI Scan <ScanLine className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="shadow-sm border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-24">
            <div className="relative flex items-center justify-center w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
              <ScanLine className="h-8 w-8 text-orange-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Product Label</h3>
            <p className="text-slate-500 font-medium text-lg">{progressStatus}</p>
            
            <div className="w-full max-w-md mt-10 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>OCR Pipeline</span>
                <span>Rule Engine</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 animate-pulse w-3/4 rounded-full transition-all duration-1000"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
