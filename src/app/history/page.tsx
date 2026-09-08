"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch('/api/inspections?limit=100')
      .then(res => res.json())
      .then(data => {
        setInspections(data);
        setLoading(false);
      });
  }, []);

  const filtered = inspections.filter(i => 
    i.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inspection History</h2>
          <p className="text-slate-500 mt-1">View and search past compliance reports.</p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search product or ID..." 
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Inspector</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading history...</td>
                  </tr>
                )}
                {filtered.map(i => (
                  <tr key={i.id} className="border-b hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono text-xs">{i.id.slice(0,8)}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(i.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{i.product?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{i.inspector?.name}</td>
                    <td className="px-6 py-4">
                      {i.status === 'COMPLIANT' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100">PASS</Badge>}
                      {i.status === 'NON_COMPLIANT' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100">FAIL</Badge>}
                      {i.status === 'REQUIRES_REVIEW' && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">REVIEW</Badge>}
                      {i.status === 'PENDING' && <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">PENDING</Badge>}
                    </td>
                    <td className="px-6 py-4 font-semibold">{i.score !== null ? `${i.score}%` : '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/inspections/${i.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
