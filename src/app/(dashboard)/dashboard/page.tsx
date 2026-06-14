"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  Car, 
  Utensils, 
  ShoppingBag,
  Info,
  ChevronRight,
  Leaf,
  Loader2,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { doc, collection, query, orderBy, limit } from "firebase/firestore";
import { getProactiveCarbonInsights, type ProactiveCarbonInsightsOutput } from "@/ai/flows/proactive-carbon-insights-flow";
import { useToast } from "@/hooks/use-toast";

const performanceData = [
  { name: 'Mon', emissions: 12.5 },
  { name: 'Tue', emissions: 15.2 },
  { name: 'Wed', emissions: 10.8 },
  { name: 'Thu', emissions: 14.1 },
  { name: 'Fri', emissions: 18.3 },
  { name: 'Sat', emissions: 8.5 },
  { name: 'Sun', emissions: 6.2 },
];

const breakdownData = [
  { name: 'Transport', value: 450, color: '#2CDAB1' },
  { name: 'Energy', value: 300, color: '#2C80DA' },
  { name: 'Diet', value: 150, color: '#A0AEC0' },
  { name: 'Shopping', value: 100, color: '#4A5568' },
];

export default function DashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [proactiveInsight, setProactiveInsight] = useState<ProactiveCarbonInsightsOutput | null>(null);

  // Fetch real user context
  const profileRef = useMemo(() => user ? doc(db, "users", user.uid) : null, [db, user]);
  const { data: profile } = useDoc(profileRef);

  // Fetch recent impact logs
  const logsQuery = useMemo(() => 
    user ? query(collection(db, "users", user.uid, "impact_logs"), orderBy("timestamp", "desc"), limit(3)) : null, 
  [db, user]);
  const { data: recentLogs, loading: logsLoading } = useCollection(logsQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefreshInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const result = await getProactiveCarbonInsights({
        userLocation: profile?.location || "San Francisco, CA",
        recentConsumptionSummary: recentLogs && recentLogs.length > 0 
          ? `Last 3 logs: ${recentLogs.map(l => `${l.type} (${l.emissions}kg)`).join(", ")}`
          : "No recent logs to analyze.",
        historicalAverageConsumption: "Weekly average is roughly 85kg CO2e.",
        currentWeatherConditions: "Sunny, 18°C.",
        userGoals: profile?.sustainabilityGoals || "Reduce footprint by 20%.",
        identifiedHabits: profile?.userHabits || "Drives daily, uses energy efficient appliances."
      });
      setProactiveInsight(result);
      toast({
        title: "Insight Generated",
        description: "Gemini has analyzed your latest activity.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Analysis Busy",
        description: "Could not generate proactive insight right now. Showing default solar opportunity.",
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  if (!mounted) return null;

  const currentEcoScore = profile?.ecoScore || 84;
  const displayName = profile?.displayName || "Alex";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">Intelligence Overview</h1>
          <p className="text-muted-foreground">Welcome back, <span className="text-foreground font-bold">{displayName}</span>. Your footprint is <span className="text-primary font-bold">12% lower</span> than last week.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-secondary/30 px-3 py-2 rounded-lg border border-border">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Live Monitoring Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Eco Score 
              <Info className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl font-headline font-bold text-primary">{currentEcoScore}</div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  +4 pts
                </span>
                <span className="text-[10px] text-muted-foreground">vs. last month</span>
              </div>
            </div>
            <Progress value={currentEcoScore} className="h-2 mb-4" />
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              Your score improved because you swapped <span className="text-foreground font-medium">3 commute trips</span> for cycling.
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Emissions
              <TrendingDown className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl font-headline font-bold">1.2<span className="text-xl font-normal text-muted-foreground ml-1">t</span></div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-primary">-12.5%</span>
                <span className="text-[10px] text-muted-foreground">Target: 0.9t</span>
              </div>
            </div>
            <div className="flex gap-1 h-2 mb-4 overflow-hidden rounded-full">
              <div className="bg-primary w-[45%]" />
              <div className="bg-accent w-[30%]" />
              <div className="bg-muted w-[25%]" />
            </div>
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full"></span> Transport</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-accent rounded-full"></span> Energy</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-muted rounded-full"></span> Other</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card col-span-1 bg-primary/5 border-primary/20 relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
                <Zap className="w-4 h-4" />
                Proactive Insight
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-muted-foreground hover:text-primary"
                onClick={handleRefreshInsight}
                disabled={isGeneratingInsight}
              >
                {isGeneratingInsight ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {proactiveInsight ? (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="text-lg font-headline font-bold mb-2 leading-tight">{proactiveInsight.title}</div>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                  {proactiveInsight.message}
                </p>
                <Link href="/copilot">
                  <Button size="xs" variant="outline" className="w-full text-[10px] font-bold h-8 border-primary/30">
                    Discuss with Copilot
                    <ChevronRight className="ml-1 w-3 h-3" />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-lg font-headline font-bold mb-3 leading-tight">Solar Opportunity Identified</div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Based on your electricity bills and local sun exposure, solar panels would pay for themselves in <span className="text-foreground font-medium underline decoration-primary decoration-2 underline-offset-4">4.2 years</span>.
                </p>
                <Link href="/roi">
                  <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    View ROI Report
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card md:col-span-3">
          <CardHeader>
            <CardTitle>Emission Trends</CardTitle>
            <CardDescription>Daily kg CO2e fluctuations for the current week.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2CDAB1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2CDAB1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A201E" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4A5568', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#4A5568', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0E0D', border: '1px solid #1A201E', borderRadius: '8px' }}
                  itemStyle={{ color: '#2CDAB1' }}
                />
                <Area type="monotone" dataKey="emissions" stroke="#2CDAB1" strokeWidth={3} fillOpacity={1} fill="url(#colorEmissions)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-1">
          <CardHeader>
            <CardTitle>Source Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-[240px] flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0A0E0D', border: '1px solid #1A201E', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-4">
              {breakdownData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}kg</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            Active Challenges
          </h2>
          <div className="space-y-3">
            {[
              { title: "Public Transit Streak", impact: "12kg CO2 saved", progress: 60, days: "3/5 days" },
              { title: "Meatless Weekdays", impact: "45kg CO2 saved", progress: 20, days: "1/5 days" },
            ].map((challenge, i) => (
              <Card key={i} className="glass-card hover:border-primary/40 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-bold group-hover:text-primary transition-colors">{challenge.title}</div>
                    <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-tighter">{challenge.impact}</div>
                    <Progress value={challenge.progress} className="h-1.5" />
                  </div>
                  <div className="ml-6 text-xs font-bold text-muted-foreground">{challenge.days}</div>
                </CardContent>
              </Card>
            ))}
            <Link href="/challenges" className="w-full">
              <Button variant="outline" className="w-full border-border hover:bg-primary/5">View All Challenges</Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Forensic Audit Log
          </h2>
          <div className="space-y-3">
            {logsLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-16 animate-pulse bg-secondary/20 rounded-lg border border-border/50"></div>
              ))
            ) : recentLogs && recentLogs.length > 0 ? (
              recentLogs.map((log: any, i) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50 hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border group-hover:bg-primary/5 transition-colors">
                      {log.category?.toLowerCase().includes('electricity') ? <Zap className="w-5 h-5 text-primary" /> : 
                       log.category?.toLowerCase().includes('fuel') || log.type?.toLowerCase().includes('transport') ? <Car className="w-5 h-5 text-accent" /> : 
                       <ShoppingBag className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold capitalize">{log.type?.replace('_', ' ')}</div>
                      <div className="text-[10px] text-muted-foreground">{new Date(log.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-xs font-bold",
                      log.emissions > 20 ? "text-destructive" : "text-primary"
                    )}>
                      {log.emissions > 0 ? `+${log.emissions}kg` : `${log.emissions}kg`}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                      {log.validationStatus || "Analyzed"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-40 flex flex-col items-center justify-center border border-dashed border-border rounded-xl text-center p-4">
                <AlertCircle className="w-8 h-8 text-muted/30 mb-2" />
                <div className="text-xs text-muted-foreground">No forensic audits recorded yet.</div>
                <Link href="/auditor" className="mt-2">
                  <Button variant="link" size="sm" className="text-[10px] uppercase font-bold text-primary">Upload First Document</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
