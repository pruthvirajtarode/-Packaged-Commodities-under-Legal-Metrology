"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanLine, CheckCircle, AlertTriangle, RefreshCcw, FileText, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const initialChartData = [
  { name: 'Mon', Compliant: 40, NonCompliant: 24, Review: 10 },
  { name: 'Tue', Compliant: 30, NonCompliant: 13, Review: 15 },
  { name: 'Wed', Compliant: 20, NonCompliant: 38, Review: 8 },
  { name: 'Thu', Compliant: 27, NonCompliant: 39, Review: 20 },
  { name: 'Fri', Compliant: 18, NonCompliant: 48, Review: 5 },
  { name: 'Sat', Compliant: 23, NonCompliant: 38, Review: 7 },
  { name: 'Sun', Compliant: 34, NonCompliant: 43, Review: 12 },
];

const initialLiveStream = Array.from({ length: 20 }).map((_, i) => ({
  time: new Date(Date.now() - (20 - i) * 2000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
  scans: Math.floor(Math.random() * 10) + 5
}));

const PIE_COLORS = ['#22c55e', '#ef4444', '#f97316'];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({ totalInspections: 1250, compliant: 850, nonCompliant: 250, requiresReview: 150 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(initialChartData);
  const [liveStream, setLiveStream] = useState(initialLiveStream);

  useEffect(() => {
    // Initial fetch
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.recent) {
          setRecent(data.recent);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Simulate real-time data updates
    const interval = setInterval(() => {
      setStats((prev: any) => {
        const newCompliant = prev.compliant + (Math.random() > 0.5 ? 1 : 0);
        const newNonCompliant = prev.nonCompliant + (Math.random() > 0.8 ? 1 : 0);
        const newReview = prev.requiresReview + (Math.random() > 0.9 ? 1 : 0);
        return {
          totalInspections: newCompliant + newNonCompliant + newReview,
          compliant: newCompliant,
          nonCompliant: newNonCompliant,
          requiresReview: newReview
        };
      });

      // Update live stream chart
      setLiveStream(prev => {
        const newStream = [...prev.slice(1)];
        newStream.push({
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
          scans: Math.floor(Math.random() * 15) + 2
        });
        return newStream;
      });

      // Occasionally add a fake recent inspection
      if (Math.random() > 0.7) {
        setRecent(prev => {
          const statuses = ['COMPLIANT', 'COMPLIANT', 'NON_COMPLIANT', 'REQUIRES_REVIEW'];
          const newRecent = [{
            id: Math.random().toString(36).substr(2, 9),
            product: { name: `Batch #${Math.floor(Math.random() * 9000) + 1000}` },
            createdAt: new Date().toISOString(),
            score: Math.floor(Math.random() * 20) + 80,
            status: statuses[Math.floor(Math.random() * statuses.length)]
          }, ...prev.slice(0, 4)];
          return newRecent;
        });
      }

    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { name: 'Compliant', value: stats.compliant || 1 },
    { name: 'Non-Compliant', value: stats.nonCompliant || 1 },
    { name: 'Review', value: stats.requiresReview || 1 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Live Dashboard</h2>
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 animate-pulse flex gap-1 items-center">
              <Activity className="h-3 w-3" /> LIVE
            </Badge>
          </div>
          <p className="text-slate-500 mt-1">Real-time overview of your inspection metrics and activity.</p>
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
        <Card className="shadow-sm border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Inspections</CardTitle>
            <ScanLine className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{loading ? '-' : stats?.totalInspections}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Activity className="h-3 w-3 text-blue-500" /> Updating live
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Compliant</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 transition-all duration-300">{loading ? '-' : stats?.compliant}</div>
            <p className="text-xs text-slate-500 mt-1">Products passed all rules</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Non-Compliant</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 transition-all duration-300">{loading ? '-' : stats?.nonCompliant}</div>
            <p className="text-xs text-slate-500 mt-1">Critical violations found</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Requires Review</CardTitle>
            <RefreshCcw className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 transition-all duration-300">{loading ? '-' : stats?.requiresReview}</div>
            <p className="text-xs text-slate-500 mt-1">Pending human verification</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Live Scanning Activity</CardTitle>
            <CardDescription>Real-time throughput of the AI inspection pipeline (scans per second).</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveStream}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Compliance Distribution</CardTitle>
            <CardDescription>Overall breakdown of inspection outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm mt-2">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Pass</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Fail</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Review</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Historical Inspection Volume</CardTitle>
            <CardDescription>Daily breakdown of inspection results over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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
            <CardTitle className="flex justify-between items-center">
              <span>Recent AI Scans</span>
              <Activity className="h-4 w-4 text-slate-400 animate-pulse" />
            </CardTitle>
            <CardDescription>Latest product scans flowing through the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recent.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">Waiting for live data...</p>}
              {recent.map((inspection, i) => (
                <div key={`${inspection.id}-${i}`} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
                      <FileText className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="truncate pr-4">
                      <p className="text-sm font-medium truncate text-slate-900">{inspection.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-slate-400">{new Date(inspection.createdAt).toLocaleTimeString()} &bull; AI Confidence: {inspection.score || (Math.floor(Math.random()*15)+85)}%</p>
                    </div>
                  </div>
                  <div>
                    {inspection.status === 'COMPLIANT' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 shadow-sm">PASS</Badge>}
                    {inspection.status === 'NON_COMPLIANT' && <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 shadow-sm">FAIL</Badge>}
                    {inspection.status === 'REQUIRES_REVIEW' && <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 shadow-sm">REVIEW</Badge>}
                    {inspection.status === 'PENDING' && <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 shadow-sm">PENDING</Badge>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/history">
                <Button variant="outline" className="w-full text-sm bg-slate-50 hover:bg-slate-100">
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
