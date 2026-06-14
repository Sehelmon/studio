"use client";

import { useState, useEffect, useCallback } from "react";
import { Binary, TrendingDown, RefreshCw, Zap, Car, Utensils, Home, Loader2, CheckCircle2, Info, Sparkles, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { simulateCarbonImpact, type SimulateCarbonImpactOutput } from "@/ai/flows/simulate-carbon-impact";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CarbonTwin() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [simulationResult, setSimulationResult] = useState< SimulateCarbonImpactOutput | null>(null);
  const { toast } = useToast();

  // Input states
  const [commute, setCommute] = useState([50]); // miles
  const [meatDays, setMeatDays] = useState([4]);
  const [energyEff, setEnergyEff] = useState([0]); // percentage
  const [isEV, setIsEV] = useState(false);
  const [isSolar, setIsSolar] = useState(false);

  const runSimulation = useCallback(async () => {
    setIsSimulating(true);
    setIsQuotaError(false);
    try {
      const lifestyleChanges = [];

      if (commute[0] < 50) {
        lifestyleChanges.push({
          type: 'transportation' as const,
          description: "Reduced weekly driving",
          impactDetails: `Reduced weekly driving distance to ${commute[0]} miles.`
        });
      }

      if (isEV) {
        lifestyleChanges.push({
          type: 'transportation' as const,
          description: "Switch to Electric Vehicle",
          impactDetails: "Eliminating direct tailpipe emissions."
        });
      }

      if (meatDays[0] < 4) {
        lifestyleChanges.push({
          type: 'diet' as const,
          description: "Reduced meat consumption",
          impactDetails: `Eating meat only ${meatDays[0]} days per week.`
        });
      }

      if (energyEff[0] > 0) {
        lifestyleChanges.push({
          type: 'home_energy' as const,
          description: "Efficiency improvements",
          impactDetails: `Improving home energy efficiency by ${energyEff[0]}%.`
        });
      }

      if (isSolar) {
        lifestyleChanges.push({
          type: 'home_energy' as const,
          description: "Installed Solar Panels",
          impactDetails: "Offsetting grid usage with onsite renewables."
        });
      }

      const result = await simulateCarbonImpact({
        currentCarbonFootprint: {
          transportation: 450,
          diet: 150,
          homeEnergy: 300,
          consumption: 300,
          total: 1200
        },
        lifestyleChanges
      });

      setSimulationResult(result);
    } catch (error: any) {
      const errorMsg = error.message || "";
      const isQuota = 
        errorMsg.toLowerCase().includes('quota') || 
        errorMsg.toLowerCase().includes('limit') || 
        errorMsg.includes('RESOURCE_EXHAUSTED') || 
        errorMsg.includes('429');
      
      if (isQuota) {
        setIsQuotaError(true);
        // Fallback estimate
        const totalSavings = (50 - commute[0]) * 0.4 + (isEV ? 120 : 0) + (isSolar ? 150 : 0);
        const fallbackResult: SimulateCarbonImpactOutput = {
          predictedCarbonFootprint: {
            transportation: Math.max(0, 450 - ((50 - commute[0]) * 0.4 + (isEV ? 120 : 0))),
            diet: 150,
            homeEnergy: Math.max(0, 300 - (isSolar ? 150 : 0)),
            consumption: 300,
            total: Math.max(0, 1200 - totalSavings)
          },
          totalCarbonReductionKgCO2e: totalSavings,
          ecoScoreChangePercentage: (totalSavings / 1200) * 10,
          aiReasoning: {
            explanation: "Predictive analysis is currently in high-availability mode. Estimates are calculated based on standard emission factors.",
            contributingBehaviors: ["Transportation delta", "Renewable energy adoption"],
            estimatedEnvironmentalImpact: `Forecasted offset of ${totalSavings.toFixed(1)}kg CO2e.`,
            estimatedCarbonSavingsBreakdown: { transport: (50 - commute[0]) * 0.4 + (isEV ? 120 : 0), energy: (isSolar ? 150 : 0) },
            suggestedNextAction: "Check back later for deep Gemini reasoning."
          }
        };
        setSimulationResult(fallbackResult);
      } else {
        toast({
          variant: "destructive",
          title: "Simulation Failed",
          description: "Gemini could not process the digital twin model. Please try again.",
        });
      }
    } finally {
      setIsSimulating(false);
    }
  }, [commute, meatDays, energyEff, isEV, isSolar, toast]);

  useEffect(() => {
    runSimulation();
  }, []);

  const resetModel = () => {
    setCommute([50]);
    setMeatDays([4]);
    setEnergyEff([0]);
    setIsEV(false);
    setIsSolar(false);
    runSimulation();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-headline font-bold">Predictive Carbon Twin</h1>
          <p className="text-muted-foreground">Adjust your digital lifestyle parameters to simulate future environmental impact via Gemini AI.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border" onClick={resetModel} disabled={isSimulating}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isSimulating && "animate-spin")} /> Reset Model
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground" onClick={runSimulation} disabled={isSimulating}>
            {isSimulating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Run Simulation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Transportation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Weekly Driving Distance</Label>
                  <span className="text-sm font-bold">{commute[0]} miles</span>
                </div>
                <Slider 
                  value={commute} 
                  onValueChange={setCommute} 
                  max={250} 
                  step={5} 
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="space-y-0.5">
                  <Label className="font-bold">Switch to Electric Vehicle</Label>
                  <div className="text-[10px] text-muted-foreground italic">Eliminate local tailpipe emissions</div>
                </div>
                <Switch checked={isEV} onCheckedChange={setIsEV} />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Dietary Habits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Meat Consumption Days</Label>
                  <span className="text-sm font-bold">{meatDays[0]} days / week</span>
                </div>
                <Slider 
                  value={meatDays} 
                  onValueChange={setMeatDays} 
                  max={7} 
                  step={1} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Home Energy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Efficiency Improvement</Label>
                  <span className="text-sm font-bold">+{energyEff[0]}%</span>
                </div>
                <Slider 
                  value={energyEff} 
                  onValueChange={setEnergyEff} 
                  max={50} 
                  step={1} 
                />
              </div>
               <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="space-y-0.5">
                  <Label className="font-bold">Install Solar Array</Label>
                  <div className="text-[10px] text-muted-foreground italic">Offset grid usage with 4.5kW peak</div>
                </div>
                <Switch checked={isSolar} onCheckedChange={setIsSolar} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-primary/30 h-full flex flex-col overflow-hidden relative">
            {isSimulating && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <div className="text-sm font-headline font-bold uppercase tracking-widest text-primary animate-pulse">Running Gemini Simulation...</div>
              </div>
            )}

            <div className="bg-primary/5 px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-primary/10">
              <div className="flex items-center gap-6">
                <div className="relative">
                   <div className="w-32 h-32 rounded-full border-[10px] border-primary/10 flex items-center justify-center overflow-hidden">
                     <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
                     <span className="relative text-4xl font-headline font-bold text-primary">
                       {simulationResult ? Math.round(84 + simulationResult.ecoScoreChangePercentage) : "--"}
                     </span>
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full border-2 border-background">
                     ECO SCORE
                   </div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Predicted Annual Footprint</div>
                  <div className="text-4xl font-headline font-bold flex items-baseline gap-2">
                    {simulationResult ? (simulationResult.predictedCarbonFootprint.total / 1000).toFixed(2) : "0.00"}
                    <span className="text-lg font-normal text-muted-foreground">t CO2e / yr</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary text-sm font-bold mt-1">
                    <TrendingDown className="w-4 h-4" />
                    {simulationResult ? (
                      `-${((simulationResult.totalCarbonReductionKgCO2e / 1200) * 100).toFixed(1)}% Reduction Forecast`
                    ) : (
                      "Calculating..."
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={cn("text-white border-none px-3 py-1 font-bold uppercase tracking-tighter", isQuotaError ? "bg-amber-500" : "bg-accent")}>
                  {isQuotaError ? "Estimated Fallback" : "Gemini Predicted"}
                </Badge>
                <div className="text-[10px] text-muted-foreground text-right italic max-w-[150px]">
                  {isQuotaError ? "Basic mathematical projection based on global factors" : "Based on local grid data and historical lifestyle audit"}
                </div>
              </div>
            </div>

            <CardContent className="p-8 flex-1">
               {isQuotaError && (
                 <Alert className="mb-6 bg-amber-500/10 border-amber-500/30 text-amber-500">
                   <AlertTriangle className="h-4 w-4" />
                   <AlertTitle className="text-xs font-bold uppercase tracking-tight">AI Service Busy</AlertTitle>
                   <AlertDescription className="text-[10px]">
                     Deep analysis is temporarily unavailable. Showing mathematical estimates based on standard emission factors.
                   </AlertDescription>
                   <Button variant="outline" size="xs" onClick={runSimulation} className="mt-2 h-7 text-[10px] border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                     <RefreshCw className="w-3 h-3 mr-1" /> Retry AI Simulation
                   </Button>
                 </Alert>
               )}

               <div className="flex items-center gap-2 mb-6">
                 <Binary className="w-5 h-5 text-primary" />
                 <h3 className="text-lg font-headline font-bold">Predictive Twin Reasoning</h3>
               </div>
               
               <div className="space-y-6">
                  {simulationResult ? (
                    <>
                      <div className="p-4 rounded-xl bg-muted/20 border border-border">
                        <div className="text-xs font-bold text-muted-foreground uppercase mb-2">AI Synthesis</div>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                             <Sparkles className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed italic">
                            {simulationResult.aiReasoning.explanation}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="text-xs font-bold uppercase text-muted-foreground">Impact Breakdown (kg)</div>
                          <div className="space-y-2">
                            {Object.entries(simulationResult.aiReasoning.estimatedCarbonSavingsBreakdown).map(([category, savings]) => (
                              <div key={category} className="flex justify-between items-center text-xs">
                                <span className="capitalize text-muted-foreground">{category.replace('_', ' ')}</span>
                                <span className="font-bold text-primary">-{savings.toFixed(1)}kg</span>
                              </div>
                            ))}
                            {Object.keys(simulationResult.aiReasoning.estimatedCarbonSavingsBreakdown).length === 0 && (
                              <div className="text-xs text-muted-foreground italic">No savings detected for these parameters.</div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="text-xs font-bold uppercase text-muted-foreground">Strategic Milestones</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                              <span>{simulationResult.aiReasoning.estimatedEnvironmentalImpact}</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs">
                              <Info className="w-3.5 h-3.5 text-accent mt-0.5" />
                              <div className="flex-1">
                                <span className="font-bold block mb-0.5">Recommended Next Step:</span>
                                <span className="text-muted-foreground">{simulationResult.aiReasoning.suggestedNextAction}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-muted-foreground italic text-sm text-center p-8">
                      Select lifestyle changes to generate AI insights.
                    </div>
                  )}
               </div>

               <div className="mt-8 flex justify-end">
                 <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8" onClick={() => toast({ title: "Target Saved", description: "Your future profile has been updated."})}>
                   Set as Target Profile
                 </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
