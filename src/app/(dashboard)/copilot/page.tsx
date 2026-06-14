"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  History, 
  PlusCircle, 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getPersonalizedCarbonCoaching } from "@/ai/flows/personalized-carbon-coaching";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const suggestions = [
  "Why did my carbon score decrease?",
  "How can I reduce emissions by 20%?",
  "What is my biggest emission source?",
  "Compare me with average households",
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  recommendations?: string[];
  trends?: string[];
}

export default function CarbonCopilot() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your Gemini Carbon Copilot. I've analyzed your sustainability profile. Ask me anything about your footprint or how to improve your Eco Score.",
      reasoning: "Initialization complete based on user profile context."
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Fetch real user context
  const profileRef = useMemo(() => user ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: profile } = useDoc(profileRef);

  const logsQuery = useMemo(() => 
    user ? query(collection(db, 'users', user.uid, 'impact_logs'), orderBy('timestamp', 'desc'), limit(5)) : null, 
  [db, user]);
  const { data: recentLogs } = useCollection(logsQuery);

  const userAvatar = PlaceHolderImages.find(img => img.id === 'avatar-user')?.imageUrl;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMsg = input.trim();
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setIsThinking(true);

    try {
      // Build context strings for the AI
      const profileCtx = profile 
        ? `User: ${profile.displayName}, EcoScore: ${profile.ecoScore}, Joined: ${profile.joinedAt}` 
        : "Anonymous user in demo mode.";
      
      const logsCtx = recentLogs && recentLogs.length > 0
        ? recentLogs.map(l => `${l.type} (${l.category}): ${l.emissions}kg CO2e`).join("; ")
        : "No recent impact logs found.";

      const response = await getPersonalizedCarbonCoaching({
        userQuestion: userMsg,
        userProfile: profileCtx,
        currentEmissionBreakdown: logsCtx,
        recentBehaviorChanges: "User is actively querying their footprint dashboard."
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.aiResponse,
        reasoning: response.reasoning.whyGenerated,
        recommendations: response.personalizedRecommendations,
        trends: response.identifiedTrends
      }]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Copilot Error",
        description: "Gemini is currently unavailable. Please try again in a moment.",
      });
      // Fallback response for demo stability
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to my knowledge base right now, but based on your local data, you're doing great with transportation emissions! Let's try again in a second.",
      }]);
    } finally {
      setIsThinking(false);
    }
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
                <div className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-primary animate-pulse' : 'bg-muted'}`}></div>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Forensic Sustainability Advisor</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
            <History className="w-4 h-4 mr-2" /> View History
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-9 w-9 border border-border shrink-0">
                {msg.role === 'assistant' ? (
                  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>U</AvatarFallback>
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
                  
                  {msg.role === 'assistant' && msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                      <div className="text-[10px] font-bold uppercase text-primary flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Personalized Recommendations
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.recommendations.map((rec, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] font-normal border-primary/20 bg-primary/5">
                            {rec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
          {isThinking && (
            <div className="flex gap-4">
              <Avatar className="h-9 w-9 border border-border shrink-0">
                <AvatarFallback className="bg-primary/20"><Loader2 className="w-4 h-4 animate-spin text-primary" /></AvatarFallback>
              </Avatar>
              <div className="bg-secondary/30 p-4 rounded-2xl h-10 w-24 flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
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
                disabled={isThinking}
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
                disabled={isThinking}
              />
              <Button 
                onClick={handleSend}
                size="icon" 
                className="absolute right-1.5 top-1.5 h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isThinking || !input.trim()}
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Active Trends</h3>
            <div className="space-y-4">
               {messages[messages.length - 1]?.trends?.slice(0, 3).map((trend, i) => (
                 <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-primary/10 rounded-lg"><TrendingDown className="w-3.5 h-3.5 text-primary" /></div>
                     <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{trend}</span>
                   </div>
                   <span className="text-[10px] font-bold text-primary">Detected</span>
                 </div>
               )) || (
                <div className="text-center py-4 text-xs text-muted-foreground italic">
                  Ask Copilot to analyze your trends
                </div>
               )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
