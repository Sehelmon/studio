
"use client";

import { Zap, ChevronRight, Calculator, PieChart, Landmark, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ROIConsultant() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-headline font-bold">ROI Sustainability Consultant</h1>
        <p className="text-muted-foreground">Calculate the financial and environmental return on investment for green retrofits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <Zap className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Solar PV Panel Array</CardTitle>
            <CardDescription>Estimated for a 2,500 sq ft roof.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Payback Period</span>
              <span className="text-2xl font-bold font-headline text-primary">4.2 Years</span>
            </div>
            <Progress value={85} className="h-1.5" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Savings</div>
                <div className="text-lg font-bold font-headline">$145.00</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground">CO2 Offset</div>
                <div className="text-lg font-bold font-headline">1.4t / yr</div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-primary text-primary-foreground">
              Request Full Quote <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <Landmark className="w-8 h-8 text-accent mb-2" />
            <CardTitle>Heat Pump Retrofit</CardTitle>
            <CardDescription>Replace old gas furnace systems.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Tax Credit Eligibility</span>
              <span className="text-2xl font-bold font-headline text-accent">$2,000</span>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              Federal incentive lowers upfront costs by 30%. Energy bills typically drop by 45%.
            </div>
            <Button variant="outline" className="w-full mt-4 border-accent text-accent hover:bg-accent/10">
              Calculate Rebates
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <Calculator className="w-8 h-8 text-muted-foreground mb-2" />
            <CardTitle>Custom Simulation</CardTitle>
            <CardDescription>Input your own project parameters.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[180px] text-center">
            <TrendingUp className="w-12 h-12 text-muted/20 mb-4" />
            <p className="text-sm text-muted-foreground mb-6">Build a bespoke ROI model for your unique property.</p>
            <Button variant="ghost" className="text-primary font-bold">Start Custom Audit</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
