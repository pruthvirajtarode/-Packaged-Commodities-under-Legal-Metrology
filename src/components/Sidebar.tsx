"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ScanLine, 
  History, 
  BookOpen, 
  Settings, 
  LogOut,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "New Inspection", icon: ScanLine, href: "/inspections/new" },
  { label: "Inspection History", icon: History, href: "/history" },
  { label: "Compliance Rules", icon: BookOpen, href: "/rules" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/') return null; // Don't show sidebar on landing page

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white w-64 border-r shadow-sm">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14 gap-2">
          <div className="bg-orange-500 p-1.5 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            PackSure AI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-slate-800 rounded-lg transition",
                pathname.startsWith(route.href) ? "text-white bg-slate-800 border-l-4 border-orange-500 pl-2" : "text-slate-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", pathname.startsWith(route.href) ? "text-orange-500" : "")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
            RK
          </div>
          <div>
            <p className="text-sm font-medium">Ramesh Kumar</p>
            <p className="text-xs text-slate-400">Inspector</p>
          </div>
        </div>
        <button className="flex items-center w-full text-slate-400 hover:text-white transition text-sm">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
