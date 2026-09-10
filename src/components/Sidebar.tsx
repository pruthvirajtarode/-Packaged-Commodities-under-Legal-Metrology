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
    <div className="flex md:flex-col bg-slate-900 text-white w-full md:w-64 md:h-full border-b md:border-r border-slate-800 shadow-sm z-50 shrink-0">
      <div className="flex md:flex-col flex-1 px-3 py-2 overflow-x-auto md:overflow-x-visible no-scrollbar">
        <Link href="/" className="flex items-center pl-2 md:pl-3 md:mb-14 mr-6 md:mr-0 gap-2 shrink-0 my-auto md:my-0 py-2 md:py-0">
          <div className="bg-orange-500 p-1.5 rounded-lg">
            <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white hidden sm:block">
            PackSure AI
          </h1>
        </Link>
        <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 my-auto md:my-0">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-2 md:p-3 items-center md:justify-start font-medium cursor-pointer hover:text-white hover:bg-slate-800 rounded-lg transition whitespace-nowrap shrink-0",
                pathname.startsWith(route.href) ? "text-white bg-slate-800 md:border-l-4 border-b-4 md:border-b-0 border-orange-500 md:pl-2" : "text-slate-400"
              )}
            >
              <route.icon className={cn("h-5 w-5 md:mr-3", pathname.startsWith(route.href) ? "text-orange-500" : "")} />
              <span className="hidden md:block ml-2 md:ml-0">{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="hidden md:block p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
            NT
          </div>
          <div>
            <p className="text-sm font-medium">Nandini Tarode</p>
            <p className="text-xs text-slate-400">Inspector</p>
          </div>
        </div>
        <Link href="/">
          <button className="flex items-center w-full text-slate-400 hover:text-white transition text-sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </Link>
      </div>
    </div>
  );
}
