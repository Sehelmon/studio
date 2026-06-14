"use client";

import { useState } from "react";
import { Send, Sparkles, MessageSquare, PlusCircle, History, Zap, TrendingDown, Info, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const suggestions = [
  "Why did my carbon score decrease?",
  "How can I reduce emissions by 20%?",
  "What is my biggest emission source?",
  "Compare me with average households",
];

export default function CarbonCopilot() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello Alex. I've analyzed your consumption audit from this morning. Your electricity usage spiked at 7 PM. Would you like to know why or how to offset this?",
      reasoning: "Generated based on recent electricity bill audit showing 420kWh usage."
    }
  ]);
  const [input, setInput] = useState("");
  const userAvatar = PlaceHolderImages.find(img => img.id === 'avatar-user')?.imageUrl;

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: "Based on your historical driving habits and your recent goal to save 100kg CO2, swapping your Tuesday cross-town commute for the subway would reach 45% of that goal immediately. This change alone would improve your Eco Score from 84 to 86.",
        reasoning: "Reasoning: Calculated based on 15-mile commute and local subway emission factors (0.05kg/mile vs 0.4kg/mile for sedan)."
      }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                Gemini Carbon Copilot
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Forensic Sustainability Advisor</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
            <History className="w-4 h-4 mr-2" /> View History
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-9 w-9 border border-border shrink-0">
                {msg.role === 'assistant' ? (
                  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>AR</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className={`space-y-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant' 
                    ? 'bg-secondary/50 text-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && msg.reasoning && (
                  <div className="text-[10px] text-muted-foreground italic px-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    {msg.reasoning}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap text-[10px] uppercase font-bold border-border hover:border-primary/50 hover:bg-primary/5 h-7"
                onClick={() => setInput(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your Copilot about your footprint..." 
                className="bg-muted/50 border-none h-12 text-sm pr-12 focus-visible:ring-1 focus-visible:ring-primary/50"
              />
              <Button 
                onClick={handleSend}
                size="icon" 
                className="absolute right-1.5 top-1.5 h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 border-border">
              <PlusCircle className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Profile Info */}
      <div className="w-80 space-y-6 hidden lg:block">
        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Focus This Week</h3>
            <div className="space-y-4">
               <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
                 <div className="flex items-center gap-2 mb-1">
                   <Zap className="w-4 h-4 text-primary" />
                   <span className="text-xs font-bold">Electricity Cap</span>
                 </div>
                 <div className="text-lg font-headline font-bold">120 kWh <span className="text-[10px] text-muted-foreground font-normal">Limit</span></div>
                 <div className="w-full bg-muted/30 h-1 rounded-full mt-2">
                   <div className="bg-primary w-[45%] h-full rounded-full"></div>
                 </div>
               </div>
               <div className="p-3 bg-accent/5 rounded-xl border border-accent/20">
                 <div className="flex items-center gap-2 mb-1">
                   <Globe className="w-4 h-4 text-accent" />
                   <span className="text-xs font-bold">Mobility Target</span>
                 </div>
                 <div className="text-lg font-headline font-bold">25 mi <span className="text-[10px] text-muted-foreground font-normal">Remaining</span></div>
                 <div className="w-full bg-muted/30 h-1 rounded-full mt-2">
                   <div className="bg-accent w-[70%] h-full rounded-full"></div>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Historical Trends</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-primary/10 rounded-lg"><TrendingDown className="w-3.5 h-3.5 text-primary" /></div>
                   <span className="text-xs text-muted-foreground">Transport</span>
                 </div>
                 <span className="text-xs font-bold text-primary">-18%</span>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-destructive/10 rounded-lg"><TrendingUp className="w-3.5 h-3.5 text-destructive" /></div>
                   <span className="text-xs text-muted-foreground">Electricity</span>
                 </div>
                 <span className="text-xs font-bold text-destructive">+4.2%</span>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-primary/10 rounded-lg"><TrendingDown className="w-3.5 h-3.5 text-primary" /></div>
                   <span className="text-xs text-muted-foreground">Grocery</span>
                 </div>
                 <span className="text-xs font-bold text-primary">-5%</span>
               </div>
            </div>
            <Button variant="ghost" className="w-full mt-6 text-xs text-primary font-bold hover:bg-primary/5">
              Analyze Full Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
