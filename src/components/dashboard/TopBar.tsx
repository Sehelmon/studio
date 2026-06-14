"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Zap, TrendingDown, Target, Sparkles, Command } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

const notifications = [
  {
    id: 1,
    title: "Solar Opportunity",
    description: "New rebate identified for your zip code.",
    icon: Zap,
    color: "text-primary",
    time: "2h ago"
  },
  {
    id: 2,
    title: "Efficiency Milestone",
    description: "You saved 12kg CO2e this week!",
    icon: TrendingDown,
    color: "text-primary",
    time: "5h ago"
  },
  {
    id: 3,
    title: "New Challenge",
    description: "The 'Zero-Waste Weekend' has started.",
    icon: Target,
    color: "text-accent",
    time: "Yesterday"
  }
];

export function TopBar() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const userAvatarPlaceholder = PlaceHolderImages.find(img => img.id === 'avatar-user')?.imageUrl;

  const profileRef = useMemo(() => user ? doc(db, "users", user.uid) : null, [db, user]);
  const { data: profile } = useDoc(profileRef);

  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || "Alex Rivers";
  const photoURL = profile?.photoURL || user?.photoURL || userAvatarPlaceholder;
  const isPro = profile?.isProMember !== false;

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const q = searchQuery.trim();
      router.push(`/copilot?q=${encodeURIComponent(q)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="max-w-md w-full relative group">
        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary group-focus-within:animate-pulse transition-colors" />
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Ask Gemini anything..." 
          className="pl-10 pr-12 bg-primary/5 border-primary/20 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/50"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
          <kbd className="hidden sm:flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 glass-card border-border shadow-2xl mr-4" align="end">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Insights & Alerts
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">3 New</span>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((n, i) => (
                <div key={n.id}>
                  <button className="w-full p-4 flex gap-4 text-left hover:bg-white/5 transition-colors group">
                    <div className={`mt-1 p-2 rounded-lg bg-background border border-border group-hover:border-primary/50 ${n.color}`}>
                      <n.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-bold flex justify-between items-center">
                        {n.title}
                        <span className="text-[9px] font-medium text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  </button>
                  {i < notifications.length - 1 && <Separator className="opacity-50" />}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border bg-muted/20">
              <Button variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5">
                Mark all as read
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-border"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold">{displayName}</div>
            {isPro && (
              <div className="text-[10px] text-primary uppercase font-bold tracking-tighter">Pro Member</div>
            )}
          </div>
          <Avatar className="h-9 w-9 border border-border cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/settings')}>
            <AvatarImage src={photoURL} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
