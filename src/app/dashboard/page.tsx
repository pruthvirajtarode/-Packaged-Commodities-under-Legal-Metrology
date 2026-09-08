"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanLine, CheckCircle, AlertTriangle, RefreshCcw, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
  { name: 'Mon', Compliant: 40, NonCompliant: 24, Review: 10 },
  { name: 'Tue', Compliant: 30, NonCompliant: 13, Review: 15 },
  { name: 'Wed', Compliant: 20, NonCompliant: 38, Review: 8 },
  { name: 'Thu', Compliant: 27, NonCompliant: 39, Review: 20 },
  { name: 'Fri', Compliant: 18, NonCompliant: 48, Review: 5 },
  { name: 'Sat', Compliant: 23, NonCompliant: 38, Review: 7 },
  { name: 'Sun', Compliant: 34, NonCompliant: 43, Review: 12 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setRecent(data.recent);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">Overview of your inspection metrics and recent activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/inspections/new">
            <Button className="bg-orange-500 hover:bg-orange-600 shadow-md">
              <ScanLine className="mr-2 h-4 w-4" /> New Inspection
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Inspections</CardTitle>
            <ScanLine className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{loading ? '-' : stats?.totalInspections}</div>
            <p className="text-xs text-slate-500 mt-1">+20% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Compliant</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{loading ? '-' : stats?.compliant}</div>
            <p className="text-xs text-slate-500 mt-1">Products passed all rules</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Non-Compliant</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{loading ? '-' : stats?.nonCompliant}</div>
            <p className="text-xs text-slate-500 mt-1">Critical violations found</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Requires Review</CardTitle>
            <RefreshCcw className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{loading ? '-' : stats?.requiresReview}</div>
            <p className="text-xs text-slate-500 mt-1">Pending human verification</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Inspection Volume</CardTitle>
            <CardDescription>Daily breakdown of inspection results over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dummyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="Compliant" fill="#22c55e" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="Review" fill="#f97316" radius={[0, 0, 0, 0]} stackId="a" />
                  <Bar dataKey="NonCompliant" fill="#ef4444" radius={[0, 0, 4, 4]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Inspections</CardTitle>
            <CardDescription>Latest product scans processed by AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recent.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">No recent inspections.</p>}
              {recent.map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-slate-100 rounded-md">
                      <FileText className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="truncate pr-4">
                      <p className="text-sm font-medium truncate text-slate-900">{inspection.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-slate-500">{new Date(inspection.createdAt).toLocaleDateString()} &bull; Score: {inspection.score}%</p>
                    </div>
                  </div>
                  <div>
                    {inspection.status === 'COMPLIANT' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">PASS</Badge>}
                    {inspection.status === 'NON_COMPLIANT' && <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">FAIL</Badge>}
                    {inspection.status === 'REQUIRES_REVIEW' && <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">REVIEW</Badge>}
                    {inspection.status === 'PENDING' && <Badge variant="outline" className="bg-slate-100 text-slate-700">PENDING</Badge>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/history">
                <Button variant="outline" className="w-full text-sm">
                  View All History <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
