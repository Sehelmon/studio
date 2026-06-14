"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileSearch, 
  MessageSquare, 
  Binary, 
  Zap, 
  Trophy, 
  Settings, 
  ShieldCheck,
  TrendingDown,
  Globe
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Consumption Auditor", href: "/auditor", icon: FileSearch },
  { name: "Gemini Copilot", href: "/copilot", icon: MessageSquare },
  { name: "Carbon Twin", href: "/simulator", icon: Binary },
  { name: "ROI Consultant", href: "/roi", icon: Zap },
  { name: "Impact Challenges", href: "/challenges", icon: Trophy },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64 fixed left-0 top-0 z-40 overflow-y-auto">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
          <Globe className="w-6 h-6" />
        </div>
        <span className="font-headline font-bold text-xl tracking-tighter">EcoLogic AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 py-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Intelligence</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-tight">Eco Score</span>
          </div>
          <div className="text-2xl font-headline font-bold mb-1">84<span className="text-sm text-muted-foreground font-normal">/100</span></div>
          <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
            <TrendingDown className="w-3 h-3" />
            -4.2% kg CO2e this month
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </div>
  );
}
