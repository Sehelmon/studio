
"use client";

import { Trophy, Flame, Target, Star, ChevronRight, Users, Leaf, Bike } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const challenges = [
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
  },
  {
    title: "Energy Vampire Hunter",
    description: "Unplug all non-essential devices before bed.",
    impact: "5kg CO2 saved",
    participants: 3421,
    progress: 90,
    reward: "50 Eco Points",
    icon: Target,
    color: "text-accent"
  }
];

export default function ChallengesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">Impact Challenges</h1>
          <p className="text-muted-foreground">Gamify your sustainability journey and compete with the global community.</p>
        </div>
        <div className="flex items-center gap-4 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-primary">Your Eco Points</div>
            <div className="text-2xl font-bold font-headline">2,450</div>
          </div>
          <Trophy className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-destructive" />
            Active Streaks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((c, i) => (
              <Card key={i} className="glass-card hover:border-primary/50 transition-all group cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg bg-muted/50 ${c.color}`}>
                      <c.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{c.reward}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-4">{c.title}</CardTitle>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                    <span>Progress</span>
                    <span>{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="h-1.5" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                      <Users className="w-3 h-3" />
                      {c.participants} Active
                    </div>
                    <div className="text-[10px] font-bold text-primary uppercase">{c.impact}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Leaderboard
          </h2>
          <Card className="glass-card">
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
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {u.rank}
                      </div>
                      <span className="text-sm font-medium">{u.name}</span>
                    </div>
                    <span className="text-sm font-bold">{u.score} pts</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full h-12 text-xs font-bold uppercase tracking-widest text-primary border-t border-border rounded-t-none">
                View Global Rankings <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
