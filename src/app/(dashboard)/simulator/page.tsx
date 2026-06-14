"use client";

import { useState } from "react";
import { Binary, TrendingDown, TrendingUp, Info, RefreshCw, Zap, Car, Utensils, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CarbonTwin() {
  const [commute, setCommute] = useState([50]); // miles
  const [meatDays, setMeatDays] = useState([4]);
  const [energyEff, setEnergyEff] = useState([0]); // percentage improvement
  const [isEV, setIsEV] = useState(false);
  const [isSolar, setIsSolar] = useState(false);

  // Derived metrics (simulated)
  const currentTotal = 1.2; // tons
  const baseRedux = (50 - commute[0]) * 0.005 + (4 - meatDays[0]) * 0.02 + energyEff[0] * 0.01;
  const evBonus = isEV ? 0.2 : 0;
  const solarBonus = isSolar ? 0.35 : 0;
  const predictedTotal = Math.max(0.1, currentTotal - baseRedux - evBonus - solarBonus);
  const percentageRedux = ((currentTotal - predictedTotal) / currentTotal) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-headline font-bold">Predictive Carbon Twin</h1>
          <p className="text-muted-foreground">Adjust your digital lifestyle parameters to simulate future environmental impact.</p>
        </div>
        <Button variant="outline" size="sm" className="border-border">
          <RefreshCw className="w-4 h-4 mr-2" /> Reset Model
        </Button>
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
          <Card className="glass-card border-primary/30 h-full flex flex-col overflow-hidden">
            <div className="bg-primary/5 px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-primary/10">
              <div className="flex items-center gap-6">
                <div className="relative">
                   <div className="w-32 h-32 rounded-full border-[10px] border-primary/10 flex items-center justify-center overflow-hidden">
                     <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
                     <span className="relative text-4xl font-headline font-bold text-primary">{Math.round(84 + percentageRedux / 5)}</span>
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full border-2 border-background">
                     ECO SCORE
                   </div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Simulated Impact</div>
                  <div className="text-4xl font-headline font-bold flex items-baseline gap-2">
                    {predictedTotal.toFixed(2)}<span className="text-lg font-normal text-muted-foreground">t CO2e / yr</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary text-sm font-bold mt-1">
                    <TrendingDown className="w-4 h-4" />
                    -{percentageRedux.toFixed(1)}% Reduction Forecast
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className="bg-accent text-white border-none px-3 py-1 font-bold">94% PROBABILITY</Badge>
                <div className="text-[10px] text-muted-foreground text-right italic max-w-[150px]">
                  Based on local grid data and historical lifestyle audit
                </div>
              </div>
            </div>

            <CardContent className="p-8 flex-1">
               <div className="flex items-center gap-2 mb-6">
                 <Binary className="w-5 h-5 text-primary" />
                 <h3 className="text-lg font-headline font-bold">Predictive Twin Reasoning</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-muted/20 border border-border">
                    <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Primary Contributor</div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                         {isEV ? <Car className="w-5 h-5 text-primary" /> : isSolar ? <Zap className="w-5 h-5 text-primary" /> : <TrendingDown className="w-5 h-5 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {percentageRedux > 10 
                          ? `Implementing these changes would be equivalent to planting ${Math.round(percentageRedux * 1.5)} trees per year. Your transport sector remains the most sensitive variable in this model.`
                          : "Small adjustments detected. Your baseline emissions are dominated by essential home energy usage. Consider deeper retrofitting for significant score gains."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="text-xs font-bold uppercase text-muted-foreground">Long-term Trajectory</div>
                      <div className="h-32 w-full bg-secondary/30 rounded-lg border border-border flex items-center justify-center overflow-hidden">
                        <div className="w-full px-4 h-full flex items-end gap-1">
                          {[40, 35, 30, 25, 20, 15, 12, 10, 8, 5].map((h, i) => (
                             <div key={i} className="flex-1 bg-primary/30 rounded-t-sm transition-all duration-1000" style={{height: `${h}%`}}></div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-[9px] text-muted-foreground font-bold px-1">
                        <span>2025</span>
                        <span>2035</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase text-muted-foreground">Key Milestones</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-primary" />
                          <span>Carbon Neutral by 2038</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-primary" />
                          <span>Top 5% of Local Savers</span>
                        </div>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Info className="w-3 h-3" />
                          <span>Qualifies for Green Grant</span>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="mt-8 flex justify-end">
                 <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
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

function CheckCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  )
}
