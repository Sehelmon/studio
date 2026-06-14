
"use client";

import { useState, useEffect } from "react";
import { 
  Trophy, 
  Flame, 
  Target, 
  Star, 
  ChevronRight, 
  Users, 
  Leaf, 
  Bike, 
  Sparkles, 
  Loader2, 
  CloudSun, 
  MapPin, 
  RefreshCw,
  Zap,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { hyperLocalChallenges, type HyperLocalChallengesOutput } from "@/ai/flows/hyper-local-challenges";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const communityChallenges = [
  {
    title: "Zero-Emission Commute",
    description: "Bike or walk to work for 5 consecutive days.",
    impact: "15kg CO2 saved",
    participants: 1240,
    progress: 60,
    reward: "100 Eco Points",
    icon: Bike,
    color: "text-primary"
  },
  {
    title: "Plant-Based Week",
    description: "Enjoy meat-free meals for 7 days straight.",
    impact: "42kg CO2 saved",
    participants: 856,
    progress: 20,
    reward: "250 Eco Points",
    icon: Leaf,
    color: "text-green-500"
  }
];

export default function ChallengesPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiChallenges, setAiChallenges] = useState<HyperLocalChallengesOutput | null>(null);
  const [isQuotaError, setIsQuotaError] = useState(false);

  const userProfileRef = user ? doc(db, "users", user.uid) : null;
  const { data: profile } = useDoc(userProfileRef);

  const generateAIChallenges = async () => {
    setIsGenerating(true);
    setIsQuotaError(false);
    try {
      // Mocked local context for the AI flow
      const response = await hyperLocalChallenges({
        userHabits: "Frequently uses private vehicle for short commutes, tends to leave heating on overnight.",
        localWeather: "Partly cloudy, 18°C. Forecasted rain tomorrow.",
        sustainabilityGoals: "Reduce household energy consumption and minimize transportation footprint.",
        currentLocation: "San Francisco, CA"
      });
      setAiChallenges(response);
      toast({
        title: "Challenges Generated",
        description: "Gemini has curated 3 hyper-local challenges for you.",
      });
    } catch (error: any) {
      const errorMsg = error.message || "";
      const isQuota = 
        errorMsg.toLowerCase().includes('quota') || 
        errorMsg.toLowerCase().includes('limit') || 
        errorMsg.includes('RESOURCE_EXHAUSTED') || 
        errorMsg.includes('429');
      
      if (isQuota) {
        setIsQuotaError(true);
        // Fallback placeholder data if AI is busy
        setAiChallenges({
          challenges: [
            {
              title: "Rainwater Collection Ready",
              description: "Prepare containers for the forecasted rain tomorrow to water indoor plants.",
              estimatedCarbonSavingsKg: 2.5,
              estimatedImpactDescription: "Saves treated municipal water usage.",
              reasoning: "AI analysis is busy. This is a seasonal recommendation for your area.",
              suggestedNextAction: "Place clean buckets on your balcony or patio."
            }
          ]
        });
      } else {
        toast({
          variant: "destructive",
          title: "AI Generation Failed",
          description: "Could not connect to the challenge engine. Using community defaults.",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (user && !aiChallenges) {
      generateAIChallenges();
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">Impact Challenges</h1>
          <p className="text-muted-foreground">Gamify your journey with AI-driven personalized missions.</p>
        </div>
        <div className="flex items-center gap-4 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-primary">Your Eco Points</div>
            <div className="text-2xl font-bold font-headline">{profile?.ecoScore ? profile.ecoScore * 50 : 2450}</div>
          </div>
          <Trophy className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* AI Personalized Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Personalized for You
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={generateAIChallenges} 
                disabled={isGenerating}
                className="text-xs h-8 text-muted-foreground hover:text-primary"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-2" />}
                Refresh AI
              </Button>
            </div>

            {isGenerating && !aiChallenges ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 rounded-xl bg-secondary/20 border border-dashed border-primary/20 animate-pulse flex items-center justify-center">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Curating Missions...</div>
                  </div>
                ))}
              </div>
            ) : aiChallenges ? (
              <div className="grid grid-cols-1 gap-4">
                {isQuotaError && (
                  <Badge variant="outline" className="w-fit bg-amber-500/10 border-amber-500/30 text-amber-500 text-[10px] py-1">
                    AI Service Busy - Showing Regional Recommendations
                  </Badge>
                )}
                {aiChallenges.challenges.map((c, i) => (
                  <Card key={i} className="glass-card border-primary/20 bg-primary/5 hover:border-primary/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-primary text-primary-foreground font-bold">{c.estimatedCarbonSavingsKg}kg CO2e Offset</Badge>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold">
                              <MapPin className="w-3 h-3" /> Hyper-Local
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold mb-1">{c.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                          </div>
                          <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg border border-border text-[11px] italic">
                            <Zap className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>AI Reasoning: {c.reasoning}</span>
                          </div>
                        </div>
                        <div className="md:w-48 flex flex-col justify-between gap-4">
                          <div className="space-y-2">
                            <div className="text-[10px] font-bold uppercase text-muted-foreground">Estimated Impact</div>
                            <div className="text-xs font-medium">{c.estimatedImpactDescription}</div>
                          </div>
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-9">
                            Start Challenge
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}
          </div>

          {/* Community Challenges */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              Community Streaks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communityChallenges.map((c, i) => (
                <Card key={i} className="glass-card hover:border-primary/50 transition-all group cursor-pointer overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className={`p-2 rounded-lg bg-muted/50 ${c.color}`}>
                        <c.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{c.reward}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-4">{c.title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{c.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                      <span>Progress</span>
                      <span>{c.progress}%</span>
                    </div>
                    <Progress value={c.progress} className="h-1.5" />
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                        <Users className="w-3 h-3" />
                        {c.participants.toLocaleString()} Active
                      </div>
                      <div className="text-[10px] font-bold text-primary uppercase">{c.impact}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Impact Leaderboard
            </h2>
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {[
                    { name: "EcoWarrior_99", score: 12450, rank: 1 },
                    { name: "GreenQueen", score: 11200, rank: 2 },
                    { name: "SolarSam", score: 10800, rank: 3 },
                    { name: "BikeAlex", score: 8400, rank: 4 },
                  ].map((u, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                          i === 0 ? "bg-yellow-500 text-black" : 
                          i === 1 ? "bg-gray-300 text-black" : 
                          i === 2 ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {u.rank}
                        </div>
                        <span className="text-sm font-medium">{u.name}</span>
                      </div>
                      <span className="text-sm font-bold">{u.score.toLocaleString()} pts</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full h-12 text-[10px] font-bold uppercase tracking-widest text-primary border-t border-border rounded-t-none hover:bg-primary/5">
                  View Global Rankings <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card bg-accent/5 border-accent/20 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-accent">
                <CloudSun className="w-4 h-4" />
                Local Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-[10px] text-muted-foreground leading-relaxed">
                Gemini is optimizing your challenges for <span className="text-foreground font-bold">San Francisco, CA</span> where it&apos;s currently 18°C.
              </div>
              <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg border border-accent/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-medium text-accent italic">Weather-optimized active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
