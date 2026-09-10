"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertTriangle, RefreshCcw, FileText, Activity, Save, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function InspectionResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("results");

  useEffect(() => {
    fetch(`/api/inspections/${id}`)
      .then(res => res.json())
      .then(data => {
        setInspection(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center flex-col space-y-4">
      <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-slate-500 font-medium">Loading inspection results...</div>
    </div>
  );
  
  if (!inspection) return <div className="p-12 text-center text-slate-500">Inspection not found.</div>;

  const handleEditChange = (fieldId: string, value: string) => {
    setEdits({ ...edits, [fieldId]: value });
  };

  const handleSaveCorrection = async (fieldId: string) => {
    const value = edits[fieldId];
    if (!value) return;

    try {
      await fetch(`/api/inspections/${id}/fields`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldId, humanValue: value, reviewerId: inspection.inspectorId })
      });
      
      toast({
        title: "Field Verified",
        description: "Human-in-the-loop correction saved to audit trail.",
      });
      
      setInspection((prev: any) => ({
        ...prev,
        extractedData: prev.extractedData.map((f: any) => 
          f.id === fieldId ? { ...f, humanValue: value, isCorrected: true } : f
        )
      }));
    } catch (e) {
      toast({ title: "Error", description: "Failed to save correction.", variant: "destructive" });
    }
  };

  const tabs = [
    { id: 'results', label: 'Compliance Results' },
    { id: 'extraction', label: 'Extracted Data & Verification' },
    { id: 'images', label: 'Evidence Images' },
    { id: 'audit', label: 'Audit Trail' }
  ];

  const getStatusColor = (status: string) => {
    if (status === 'COMPLIANT') return 'bg-emerald-500/15 text-emerald-600 border-emerald-200';
    if (status === 'NON_COMPLIANT') return 'bg-rose-500/15 text-rose-600 border-rose-200';
    return 'bg-amber-500/15 text-amber-600 border-amber-200';
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-orange-500" />
              Inspection #{inspection.id.slice(0,8)}
            </h2>
            <Badge className={`px-3 py-1 rounded-full border text-sm font-bold shadow-sm ${getStatusColor(inspection.status)}`}>
              {inspection.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-slate-500 font-medium">Product Reference: <span className="text-slate-900">{inspection.product?.name || 'Unknown'}</span></p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0 print:hidden">
          <Button variant="outline" className="border-slate-200 shadow-sm rounded-full px-6" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-md shadow-orange-500/20 rounded-full px-6 transition-all" onClick={() => window.print()}>
            <FileText className="mr-2 h-4 w-4" /> Generate PDF Report
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-4 print:flex print:flex-col print:gap-8">
        {/* Premium AI Score Card */}
        <Card className="md:col-span-1 shadow-lg shadow-slate-200/50 border-slate-100 rounded-2xl overflow-hidden h-fit bg-white print:shadow-none print:border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              AI Confidence
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl print:hidden"></div>
            <div className="relative flex items-center justify-center w-36 h-36">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-md">
                <circle cx="72" cy="72" r="64" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                {/* Screen version with beautiful gradients */}
                <circle 
                  cx="72" cy="72" r="64" fill="transparent" 
                  stroke={inspection.confidenceScore > 80 ? "url(#green-gradient)" : inspection.confidenceScore > 60 ? "url(#orange-gradient)" : "#ef4444"} 
                  strokeWidth="12" 
                  strokeDasharray={`${(inspection.confidenceScore / 100) * 402} 402`} 
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out print:hidden"
                />
                {/* Print fallback version with solid hex colors because browsers drop SVG gradients in PDFs */}
                <circle 
                  cx="72" cy="72" r="64" fill="transparent" 
                  strokeWidth="12" 
                  strokeDasharray={`${(inspection.confidenceScore / 100) * 402} 402`} 
                  strokeLinecap="round" 
                  className="hidden print:block"
                  style={{ stroke: inspection.confidenceScore > 80 ? "#10b981" : inspection.confidenceScore > 60 ? "#f59e0b" : "#ef4444" }}
                />
                <defs>
                  <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">{inspection.confidenceScore}%</span>
              </div>
            </div>
            <p className="text-sm text-center text-slate-500 mt-8 font-medium px-4">
              {inspection.confidenceScore < 85 ? "Low confidence. Human verification recommended." : "High confidence in real-time OCR extraction."}
            </p>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6 print:space-y-8">
          {/* Custom Tabs List */}
          <div className="flex space-x-1 border-b border-slate-200 bg-white px-2 pt-2 rounded-t-2xl shadow-sm print:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold transition-all relative outline-none ${
                  activeTab === tab.id 
                    ? 'text-orange-600' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full shadow-[0_-2px_10px_rgba(249,115,22,0.5)]"></div>
                )}
              </button>
            ))}
          </div>
          
          <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-slate-100 p-6 min-h-[400px] print:min-h-0 print:shadow-none print:border-none print:p-0 print:space-y-8">
            
            {/* Results Tab */}
            <div className={`${activeTab === 'results' ? 'block' : 'hidden print:block'} animate-in slide-in-from-right-4 fade-in duration-300`}>
              <h3 className="text-xl font-bold text-slate-800 hidden print:block mb-4 pb-2 border-b">Compliance Results</h3>
              <div className="space-y-4">
                {inspection.results?.map((res: any) => (
                  <div key={res.id} className="group flex items-start p-5 gap-5 rounded-xl border border-slate-100 bg-white hover:shadow-md hover:border-slate-200 transition-all duration-200 print:break-inside-avoid print:border-slate-200">
                    <div className="mt-1 p-2 rounded-full bg-slate-50 group-hover:bg-white transition-colors shadow-sm">
                      {res.status === 'PASS' && <CheckCircle className="h-6 w-6 text-emerald-500" />}
                      {res.status === 'FAIL' && <AlertTriangle className="h-6 w-6 text-rose-500" />}
                      {res.status === 'REVIEW' && <RefreshCcw className="h-6 w-6 text-amber-500" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-800">{res.rule.title}</h4>
                      <p className="text-sm text-slate-600 mt-1 font-medium">{res.explanation}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md border border-slate-200">Rule: {res.rule.ruleCode}</span>
                        <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md border border-slate-200">Field: {res.evidenceField}</span>
                        {res.confidence > 0 && (
                          <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md border border-blue-100 flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            AI Confidence: {Math.round(res.confidence)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extraction Tab */}
            <div className={`${activeTab === 'extraction' ? 'block' : 'hidden print:block'} animate-in slide-in-from-right-4 fade-in duration-300 print:mt-10`}>
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-xl font-bold text-slate-800">Extracted Data & Verification</h3>
                <p className="text-slate-500 text-sm mt-1 print:hidden">Review and correct data extracted by the AI in real-time.</p>
              </div>
              
              <div className="space-y-4">
                {inspection.extractedData?.map((field: any) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors print:break-inside-avoid print:bg-white print:border-slate-200">
                    <div className="md:col-span-3 font-bold text-sm text-slate-800 capitalize">
                      {field.fieldKey.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="md:col-span-4 relative">
                      <Label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 block">AI Extracted Value</Label>
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-mono flex justify-between items-center shadow-sm">
                        <span className="font-semibold">{field.aiValue || 'Not detected'}</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${field.confidence < 85 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {Math.round(field.confidence)}%
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-4">
                      <Label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 block">Human Corrected Value</Label>
                      <Input 
                        defaultValue={field.humanValue || field.aiValue} 
                        onChange={(e) => handleEditChange(field.id, e.target.value)}
                        className={`font-mono shadow-sm ${field.isCorrected ? "border-emerald-400 bg-emerald-50 focus-visible:ring-emerald-500" : ""}`}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end mt-5 print:hidden">
                      <Button size="icon" className="bg-white border hover:bg-blue-50 border-slate-200 text-blue-600 shadow-sm rounded-lg" onClick={() => handleSaveCorrection(field.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!inspection.extractedData || inspection.extractedData.length === 0) && (
                  <div className="p-8 text-center text-slate-500 border-2 border-dashed rounded-xl">No fields were extracted for this inspection.</div>
                )}
              </div>
            </div>

            {/* Images Tab */}
            <div className={`${activeTab === 'images' ? 'block' : 'hidden print:block'} animate-in slide-in-from-right-4 fade-in duration-300 print:mt-10`}>
              <h3 className="text-xl font-bold text-slate-800 hidden print:block mb-4 pb-2 border-b">Evidence Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inspection.images?.map((img: any) => (
                  <div key={img.id} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 group print:break-inside-avoid">
                    <div className="bg-slate-800 p-3 flex justify-between items-center text-sm font-bold text-white print:bg-slate-100 print:text-slate-800">
                      <span>{img.type} SCAN</span>
                      <Badge className="bg-white/20 hover:bg-white/30 border-none print:hidden">HD</Badge>
                    </div>
                    <div className="relative p-4 flex justify-center items-center bg-checkered">
                      <img src={img.url} className="max-h-64 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105" alt="Evidence" />
                    </div>
                  </div>
                ))}
                {(!inspection.images || inspection.images.length === 0) && (
                  <div className="col-span-2 p-12 text-center text-slate-500 border-2 border-dashed rounded-xl bg-slate-50">
                    No images were captured during this scan.
                  </div>
                )}
              </div>
            </div>

            {/* Audit Trail Tab */}
            <div className={`${activeTab === 'audit' ? 'block' : 'hidden print:block'} animate-in slide-in-from-right-4 fade-in duration-300 print:mt-10`}>
              <h3 className="text-xl font-bold text-slate-800 hidden print:block mb-4 pb-2 border-b">Audit Trail</h3>
              <div className="relative border-l-2 border-slate-200 ml-4 py-4 space-y-8">
                {inspection.auditLogs?.map((log: any) => (
                  <div key={log.id} className="relative pl-8 group print:break-inside-avoid">
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-slate-200 border-4 border-white group-hover:bg-orange-500 group-hover:border-orange-100 transition-colors"></div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow print:border-slate-200 print:bg-white">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                        <h5 className="font-bold text-sm text-slate-900 tracking-tight uppercase">{log.action.replace(/_/g, ' ')}</h5>
                        <span className="text-xs font-medium text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">
                        <span className="font-semibold text-slate-800">{log.user?.name || 'System'}</span> &bull; {JSON.parse(log.details || '{}').message || log.details}
                      </p>
                    </div>
                  </div>
                ))}
                {(!inspection.auditLogs || inspection.auditLogs.length === 0) && (
                  <div className="pl-8 text-slate-500 text-sm">No audit logs available.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Add a subtle checkered pattern for image backgrounds */}
      <style dangerouslySetInnerHTML={{__html: `
        .bg-checkered {
          background-image: linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}} />
    </div>
  );
}
