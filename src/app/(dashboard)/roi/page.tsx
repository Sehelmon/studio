"use client";

import { useState } from "react";
import { 
  Zap, 
  ChevronRight, 
  Calculator, 
  Landmark, 
  TrendingUp, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  MapPin, 
  Building2, 
  DollarSign,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { calculateRoi, type CalculateRoiOutput, type CalculateRoiInput } from "@/ai/flows/calculate-roi-flow";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ROIConsultant() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<CalculateRoiOutput | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CalculateRoiInput>({
    projectType: 'solar',
    location: "California, USA",
    propertySizeSqFt: 2500,
    currentMonthlySpend: 250
  });

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const output = await calculateRoi(formData);
      setResult(output);
      setDialogOpen(false);
      toast({
        title: "Simulation Complete",
        description: "Gemini has generated your custom ROI report.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Simulation Failed",
        description: error.message || "Could not generate ROI report. Please try again.",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold tracking-tight">ROI Sustainability Consultant</h1>
          <p className="text-muted-foreground mt-2">Financial and environmental forecasting for net-zero retrofits.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/10">
              <Calculator className="w-4 h-4 mr-2" />
              New Custom Audit
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline font-bold text-xl">Custom ROI Audit</DialogTitle>
              <DialogDescription>
                Input your property details for a Gemini-powered financial simulation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="project">Retrofit Project</Label>
                <Select 
                  value={formData.projectType} 
                  onValueChange={(v: any) => setFormData(prev => ({ ...prev, projectType: v }))}
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solar">Solar PV Panels</SelectItem>
                    <SelectItem value="heat_pump">Heat Pump HVAC</SelectItem>
                    <SelectItem value="ev_charger">EV Home Charging</SelectItem>
                    <SelectItem value="insulation">Full Home Insulation</SelectItem>
                    <SelectItem value="windows">Double Glazed Windows</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location (City, State)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input 
                    id="location" 
                    className="pl-9" 
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="size">Property Size (Sq Ft)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input 
                      id="size" 
                      type="number" 
                      className="pl-9" 
                      value={formData.propertySizeSqFt}
                      onChange={(e) => setFormData(prev => ({ ...prev, propertySizeSqFt: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="spend">Monthly Spend ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input 
                      id="spend" 
                      type="number" 
                      className="pl-9" 
                      value={formData.currentMonthlySpend}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentMonthlySpend: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSimulate} disabled={isSimulating} className="w-full">
                {isSimulating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Run AI Simulation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Landmark className="w-3.5 h-3.5" />
                Investment Methodology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                <div className="text-xs font-bold mb-1">Incentive Tracking</div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Calculations factor in the Inflation Reduction Act (IRA) tax credits and local utility SREC programs.
                </p>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                <div className="text-xs font-bold mb-1">Carbon Intensity</div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Emission offsets are calculated using location-specific marginal grid emission factors (e.g., eGRID data).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Quick Estimates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-between text-xs font-medium hover:bg-primary/10 group"
                onClick={() => {
                  setFormData(prev => ({ ...prev, projectType: 'solar' }));
                  handleSimulate();
                }}
              >
                Solar Payback (Typical) <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-between text-xs font-medium hover:bg-primary/10 group"
                onClick={() => {
                  setFormData(prev => ({ ...prev, projectType: 'heat_pump' }));
                  handleSimulate();
                }}
              >
                Heat Pump ROI <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {isSimulating ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-dashed border-primary/30 rounded-2xl bg-primary/5 p-8 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-headline font-bold">Simulating Financial Future...</h3>
              <p className="text-muted-foreground text-sm mt-2 max-w-[320px]">
                Gemini is cross-referencing utility rates, federal tax codes, and project costs for your region.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <Card className="glass-card overflow-hidden shadow-2xl border-primary/50">
                <div className="bg-primary/10 px-6 py-4 flex items-center justify-between border-b border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background/50 rounded-lg">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Audit Results</div>
                      <div className="text-sm font-bold capitalize">{formData.projectType.replace('_', ' ')} Project</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/30 bg-primary/5 font-bold">
                    Payback: {result.paybackPeriodYears} Years
                  </Badge>
                </div>

                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-secondary/20 rounded-2xl border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Annual Energy Savings</div>
                      <div className="text-4xl font-headline font-bold text-primary">
                        ${result.annualSavings.toLocaleString()}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Estimated based on current monthly spend of ${formData.currentMonthlySpend}
                      </p>
                    </div>
                    <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20">
                      <div className="text-[10px] text-accent uppercase font-bold mb-1">Carbon Offset</div>
                      <div className="text-4xl font-headline font-bold text-accent">
                        {result.carbonOffsetTonsPerYear} <span className="text-xl font-normal opacity-70">t/yr</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Metric tons of CO2e avoided annually
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-5 bg-muted/20 rounded-xl border border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold uppercase tracking-tight">Financial Efficiency</span>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span>Upfront Investment</span>
                            <span>${result.estimatedUpfrontCost.toLocaleString()}</span>
                          </div>
                          <Progress value={40} className="h-1.5" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.availableIncentives.map((inc, i) => (
                            <Badge key={i} variant="secondary" className="text-[9px] px-2 py-0.5 border border-primary/20 bg-primary/5">
                              {inc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-secondary/10 border border-border/50">
                      <div className="text-xs font-bold flex items-center gap-2 mb-3">
                        <Info className="w-3.5 h-3.5 text-primary" />
                        Consultant Analysis
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        {result.aiReasoning.explanation}
                      </p>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Key Factors Considered</div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          {result.aiReasoning.factorsConsidered.map((factor, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <CheckCircle2 className="w-3 h-3 text-primary" />
                              {factor}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-headline font-bold group">
                      {result.aiReasoning.suggestedNextAction}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-border rounded-2xl bg-secondary/10 border-dashed text-center p-8">
              <div className="p-6 bg-background/50 rounded-full mb-6">
                <Calculator className="w-12 h-12 text-muted/30" />
              </div>
              <div className="text-muted-foreground font-headline font-bold text-lg">Awaiting custom parameters...</div>
              <p className="text-muted-foreground text-sm mt-2 max-w-[320px] leading-relaxed">
                Click "New Custom Audit" or select a quick estimate to see your projected ROI and carbon offset.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
