"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle, RefreshCcw, FileText, Activity, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function InspectionResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/inspections/${id}`)
      .then(res => res.json())
      .then(data => {
        setInspection(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading inspection results...</div>;
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
      
      // Update local state to reflect change without reload
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inspection #{inspection.id.slice(0,8)}</h2>
            {inspection.status === 'COMPLIANT' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-sm py-1">COMPLIANT</Badge>}
            {inspection.status === 'NON_COMPLIANT' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-sm py-1">NON-COMPLIANT</Badge>}
            {inspection.status === 'REQUIRES_REVIEW' && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-sm py-1">REQUIRES REVIEW</Badge>}
          </div>
          <p className="text-slate-500">Product: {inspection.product?.name || 'Unknown'}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-200 shadow-sm" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 shadow-sm" onClick={() => window.print()}>
            <FileText className="mr-2 h-4 w-4" /> Generate PDF Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1 shadow-sm border-slate-200 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">AI Confidence Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                <circle 
                  cx="64" cy="64" r="56" fill="transparent" 
                  stroke={inspection.confidenceScore > 80 ? "#22c55e" : inspection.confidenceScore > 60 ? "#f97316" : "#ef4444"} 
                  strokeWidth="12" 
                  strokeDasharray={`${(inspection.confidenceScore / 100) * 351} 351`} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">{inspection.confidenceScore}%</span>
              </div>
            </div>
            <p className="text-sm text-center text-slate-500 mt-6">
              {inspection.confidenceScore < 85 ? "Low confidence. Human verification recommended." : "High confidence in OCR extraction."}
            </p>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Tabs defaultValue="results">
            <TabsList className="bg-white border-b border-slate-200 w-full justify-start rounded-none h-12 p-0 space-x-6">
              <TabsTrigger value="results" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none bg-transparent px-2">Compliance Results</TabsTrigger>
              <TabsTrigger value="extraction" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none bg-transparent px-2">Extracted Data & Verification</TabsTrigger>
              <TabsTrigger value="images" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none bg-transparent px-2">Evidence Images</TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none bg-transparent px-2">Audit Trail</TabsTrigger>
            </TabsList>
            
            <TabsContent value="results" className="pt-6 space-y-4">
              {inspection.results?.map((res: any) => (
                <Card key={res.id} className="shadow-sm border-slate-200">
                  <div className="flex items-start p-5 gap-4">
                    <div className="mt-1">
                      {res.status === 'PASS' && <CheckCircle className="h-6 w-6 text-green-500" />}
                      {res.status === 'FAIL' && <AlertTriangle className="h-6 w-6 text-red-500" />}
                      {res.status === 'REVIEW' && <RefreshCcw className="h-6 w-6 text-orange-500" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-slate-900">{res.rule.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{res.explanation}</p>
                      
                      <div className="mt-4 flex gap-4 text-xs">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">Rule: {res.rule.ruleCode}</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">Field: {res.evidenceField}</span>
                        {res.confidence > 0 && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">AI Confidence: {Math.round(res.confidence)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="extraction" className="pt-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle>Human-in-the-loop Verification</CardTitle>
                  <CardDescription>Review and correct data extracted by the AI.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {inspection.extractedData?.map((field: any) => (
                    <div key={field.id} className="grid grid-cols-12 gap-4 items-center border-b pb-4 last:border-0 last:pb-0">
                      <div className="col-span-3 font-medium text-sm text-slate-900 capitalize">
                        {field.fieldKey.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="col-span-4 relative">
                        <Label className="text-xs text-slate-500 mb-1 block">AI Extracted Value</Label>
                        <div className="p-2 bg-slate-50 border rounded-md text-sm text-slate-700 font-mono flex justify-between">
                          <span>{field.aiValue || 'Not detected'}</span>
                          <span className={`text-xs ${field.confidence < 85 ? 'text-orange-500' : 'text-green-600'}`}>
                            {Math.round(field.confidence)}%
                          </span>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <Label className="text-xs text-slate-500 mb-1 block">Human Corrected Value</Label>
                        <Input 
                          defaultValue={field.humanValue || field.aiValue} 
                          onChange={(e) => handleEditChange(field.id, e.target.value)}
                          className={field.isCorrected ? "border-green-300 bg-green-50" : ""}
                        />
                      </div>
                      <div className="col-span-1 flex justify-end mt-5">
                        <Button variant="ghost" size="icon" onClick={() => handleSaveCorrection(field.id)}>
                          <Save className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!inspection.extractedData || inspection.extractedData.length === 0) && (
                    <p className="text-slate-500 text-sm">No fields were extracted.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                {inspection.images?.map((img: any) => (
                  <Card key={img.id} className="overflow-hidden">
                    <div className="bg-slate-100 p-2 flex justify-between items-center text-sm font-semibold text-slate-700">
                      <span>{img.type} Label</span>
                    </div>
                    <img src={img.url} className="w-full h-auto object-contain bg-slate-50" alt="Evidence" />
                  </Card>
                ))}
                {(!inspection.images || inspection.images.length === 0) && (
                  <p className="text-slate-500">No images attached to this inspection.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="audit" className="pt-6">
              <Card className="shadow-sm border-slate-200">
                <CardContent className="pt-6">
                  <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                    {inspection.auditLogs?.map((log: any) => (
                      <div key={log.id} className="relative pl-6">
                        <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-slate-300 border-2 border-white"></div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                          <h5 className="font-semibold text-sm text-slate-900">{log.action.replace(/_/g, ' ')}</h5>
                          <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {log.user?.name} &bull; {JSON.parse(log.details || '{}').message || log.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
