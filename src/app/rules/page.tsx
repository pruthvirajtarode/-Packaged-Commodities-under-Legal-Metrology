"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export default function RulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rules')
      .then(res => res.json())
      .then(data => {
        setRules(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Compliance Rule Library</h2>
          <p className="text-slate-500 mt-1">Configurable Legal Metrology requirements.</p>
        </div>
        <div className="bg-orange-100 p-3 rounded-xl border border-orange-200 flex items-center gap-2">
          <BookOpen className="text-orange-600 h-5 w-5" />
          <span className="text-sm font-semibold text-orange-700">Active Version: 2011 Rules</span>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading rules...</div>
        ) : rules.map(rule => (
          <Card key={rule.id} className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg text-slate-900">{rule.title}</CardTitle>
                    <Badge variant="outline" className="bg-slate-50">{rule.ruleCode}</Badge>
                  </div>
                  <CardDescription>{rule.category}</CardDescription>
                </div>
                <Badge className={
                  rule.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                  rule.severity === 'HIGH' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                  'bg-blue-100 text-blue-700 hover:bg-blue-100'
                }>
                  {rule.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 mb-4">{rule.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">Required Fields</span>
                  <span className="text-slate-600 font-mono">{JSON.parse(rule.requiredFields).join(', ')}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">Source Reference</span>
                  <span className="text-slate-600">{rule.source}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
