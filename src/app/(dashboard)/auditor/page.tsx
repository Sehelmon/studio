"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ConsumptionAuditor() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzedResult, setAnalyzedResult] = useState<any>(null);

  const simulateUpload = () => {
    setIsUploading(true);
    setAnalyzedResult(null);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setAnalyzedResult({
            type: "Electricity Bill",
            provider: "Clean Grid Energy",
            period: "Sept 2023",
            consumption: "420 kWh",
            emissions: "118.4 kg CO2e",
            confidence: 99.2,
            insights: [
              "Your usage increased by 15% compared to August.",
              "Major spike detected during 4 PM - 8 PM peak grid intensity hours.",
              "Suggested action: Shift laundry and dishwasher to off-peak (after 10 PM)."
            ],
            reasoning: "AI analysis of your smart meter data confirms cooling systems were the primary contributor due to unusually high local temperatures (85°F avg)."
          });
        }, 1500);
      }
    }, 50);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-headline font-bold">Multi-Modal Consumption Auditor</h1>
        <p className="text-muted-foreground">Upload bills or receipts. Gemini handles the data extraction and carbon forensic analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="glass-card border-dashed border-2 border-primary/30 bg-primary/5">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                {isUploading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="text-xl font-headline font-bold mb-2">
                {isUploading ? "Gemini is auditing..." : "Drop documents here"}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                Supports PDF, JPG, and PNG. Electricity bills, grocery receipts, or fuel logs.
              </p>
              {!isUploading && (
                <Button onClick={simulateUpload} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Choose Files
                </Button>
              )}
              {isUploading && (
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tighter">
                    <span>Scanning Forensics</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{width: `${uploadProgress}%`}}></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Auditor Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  <span className="font-bold">Privacy First:</span> All sensitive PII (Account numbers, address) is automatically redacted before analysis.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  <span className="font-bold">Grid Intensity:</span> We use real-time regional grid data to convert kWh to accurate CO2e.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  <span className="font-bold">Multi-Modal:</span> Upload physical receipt photos or digital PDF bills.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {analyzedResult ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <Card className="glass-card border-primary/50 overflow-hidden">
                <div className="bg-primary/10 px-6 py-4 flex items-center justify-between border-b border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-tighter text-primary">Audit Result</div>
                      <div className="text-sm font-bold">{analyzedResult.type} Identified</div>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-bold">{analyzedResult.confidence}% Confidence</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase mb-1">Consumption</div>
                      <div className="text-2xl font-headline font-bold">{analyzedResult.consumption}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase mb-1">Carbon Impact</div>
                      <div className="text-2xl font-headline font-bold text-destructive">{analyzedResult.emissions}</div>
                    </div>
                  </div>

                  <Separator className="mb-6 opacity-50" />

                  <div className="space-y-4">
                    <div className="text-sm font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      AI Insights
                    </div>
                    <ul className="space-y-3">
                      {analyzedResult.insights.map((insight: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-border">
                    <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Forensic Reasoning</div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      &quot;{analyzedResult.reasoning}&quot;
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-border hover:bg-white/5">
                  <Eye className="w-4 h-4 mr-2" /> View OCR Data
                </Button>
                <Button className="bg-primary text-primary-foreground">
                  Confirm & Log Impact <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-border rounded-2xl bg-secondary/10 border-dashed text-center p-8">
              <Sparkles className="w-12 h-12 text-muted/30 mb-4" />
              <div className="text-muted-foreground font-medium">No active audit</div>
              <p className="text-muted-foreground text-xs mt-2 max-w-[240px]">
                Upload a document to start the forensic carbon tracking process.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
