"use client";

import { Bell, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function TopBar() {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'avatar-user')?.imageUrl;

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="max-w-md w-full relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search insights, documents, or data..." 
          className="pl-10 bg-muted/50 border-none h-9 text-sm focus-visible:ring-1 focus-visible:ring-primary/50"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
        </Button>
        <div className="h-8 w-px bg-border"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">Alex Rivers</div>
            <div className="text-[10px] text-primary uppercase font-bold tracking-tighter">Pro Member</div>
          </div>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={userAvatar} alt="Alex Rivers" />
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
