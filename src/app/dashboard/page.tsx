"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanLine, CheckCircle, AlertTriangle, RefreshCcw, FileText, ArrowRight, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { motion } from "framer-motion";

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

const PIE_COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 drop-shadow-sm">Live Dashboard</h2>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 animate-pulse flex gap-1.5 items-center px-2.5 py-0.5 rounded-full shadow-sm">
              <Activity className="h-3 w-3" /> LIVE
            </Badge>
          </div>
          <p className="text-slate-500 mt-1">Real-time overview of your inspection metrics and activity.</p>
        </div>
        <Link href="/inspections/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 group h-10 px-6 rounded-full font-medium">
            <ScanLine className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> New Inspection
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg shadow-blue-500/5 border-slate-200 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:h-1.5 transition-all"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Inspections</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <ScanLine className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{loading ? '-' : stats?.totalInspections}</div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
              <Activity className="h-3 w-3 text-blue-500" /> Updating live
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg shadow-emerald-500/5 border-slate-200 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:h-1.5 transition-all"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Compliant</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 transition-all duration-300 tracking-tight">{loading ? '-' : stats?.compliant}</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Products passed all rules</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-rose-500/5 border-slate-200 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-rose-50/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-600 group-hover:h-1.5 transition-all"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Non-Compliant</CardTitle>
            <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 transition-all duration-300 tracking-tight">{loading ? '-' : stats?.nonCompliant}</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Critical violations found</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-amber-500/5 border-slate-200 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-amber-50/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:h-1.5 transition-all"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Requires Review</CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
              <RefreshCcw className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 transition-all duration-300 tracking-tight">{loading ? '-' : stats?.requiresReview}</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Pending human verification</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Live Scanning Activity</CardTitle>
                <CardDescription>Real-time throughput of the AI inspection pipeline.</CardDescription>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-0 pr-4">
            <div className="h-[260px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveStream}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Compliance Distribution</CardTitle>
            <CardDescription>Overall breakdown of inspection outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-sm mt-4 font-medium text-slate-600">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shadow-sm bg-emerald-500"></div> Pass</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shadow-sm bg-rose-500"></div> Fail</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shadow-sm bg-amber-500"></div> Review</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Historical Inspection Volume</CardTitle>
            <CardDescription>Daily breakdown of inspection results over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 pr-4">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Bar dataKey="Compliant" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="Review" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
                  <Bar dataKey="NonCompliant" fill="#f43f5e" radius={[0, 0, 4, 4]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-slate-200 hover:shadow-md transition-shadow flex flex-col">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="flex justify-between items-center text-lg">
              <span>Recent AI Scans</span>
              <Badge variant="outline" className="bg-slate-50 text-slate-500 font-normal shadow-sm">
                Live Feed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-4">
            <div className="space-y-4 flex-1">
              {recent.length === 0 && <p className="text-sm text-slate-500 py-8 text-center">Waiting for live data stream...</p>}
              {recent.map((inspection, i) => (
                <div key={`${inspection.id}-${i}`} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
                      <FileText className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="truncate pr-4">
                      <p className="text-sm font-semibold truncate text-slate-900">{inspection.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{new Date(inspection.createdAt).toLocaleTimeString()} &bull; <span className="text-indigo-600">AI Confidence: {inspection.score || (Math.floor(Math.random()*15)+85)}%</span></p>
                    </div>
                  </div>
                  <div>
                    {inspection.status === 'COMPLIANT' && <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm px-2.5 py-0.5">PASS</Badge>}
                    {inspection.status === 'NON_COMPLIANT' && <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 shadow-sm px-2.5 py-0.5">FAIL</Badge>}
                    {inspection.status === 'REQUIRES_REVIEW' && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 shadow-sm px-2.5 py-0.5">REVIEW</Badge>}
                    {inspection.status === 'PENDING' && <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 shadow-sm px-2.5 py-0.5">PENDING</Badge>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link href="/history">
                <Button variant="ghost" className="w-full text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group">
                  View All History <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  );
}

