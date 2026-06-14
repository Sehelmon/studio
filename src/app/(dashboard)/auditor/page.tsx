
"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { autoAnalyzeConsumption, type AutoAnalyzeConsumptionOutput } from "@/ai/flows/auto-analyze-consumption-flow";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function ConsumptionAuditor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<AutoAnalyzeConsumptionOutput | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  const handleFileUpload = async () => {
    // In a real app, this would handle actual file selection and base64 conversion
    // For this MVP, we use a placeholder image seed to represent the bill
    setIsAnalyzing(true);
    try {
      const result = await autoAnalyzeConsumption({
        documentDataUri: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/", // Mock data URI
        documentType: 'electricity_bill',
        additionalContext: "User is checking their monthly spending."
      });
      setAnalyzedResult(result);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Could not analyze the document.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmImpact = () => {
    if (!user || !analyzedResult) return;

    const logRef = doc(db, "users", user.uid, "impact_logs", Date.now().toString());
    const data = {
      type: analyzedResult.documentTypeIdentified,
      emissions: analyzedResult.estimatedCarbonEmissionsKgCO2e,
      category: analyzedResult.spendingCategory,
      timestamp: new Date().toISOString(),
      details: analyzedResult.extractedInformation
    };

    setDoc(logRef, data)
      .then(() => {
        toast({
          title: "Impact Logged",
          description: "Your carbon footprint has been updated successfully.",
        });
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: logRef.path,
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
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
                {isAnalyzing ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="text-xl font-headline font-bold mb-2">
                {isAnalyzing ? "Gemini is auditing..." : "Drop documents here"}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                Supports PDF, JPG, and PNG. Electricity bills, grocery receipts, or fuel logs.
              </p>
              {!isAnalyzing && (
                <Button onClick={handleFileUpload} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Choose Files
                </Button>
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
                  <span className="font-bold">Privacy First:</span> All sensitive PII is automatically redacted before analysis.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  <span className="font-bold">Grid Intensity:</span> We use real-time regional data to convert units to accurate CO2e.
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
                      <div className="text-sm font-bold">{analyzedResult.documentTypeIdentified}</div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase mb-1">Spending Category</div>
                      <div className="text-2xl font-headline font-bold">{analyzedResult.spendingCategory}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase mb-1">Carbon Impact</div>
                      <div className="text-2xl font-headline font-bold text-destructive">{analyzedResult.estimatedCarbonEmissionsKgCO2e}kg CO2e</div>
                    </div>
                  </div>

                  <Separator className="mb-6 opacity-50" />

                  <div className="space-y-4">
                    <div className="text-sm font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      AI Insights
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {analyzedResult.personalizedInsights}
                    </p>
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
                <Button variant="outline" className="border-border" onClick={() => setAnalyzedResult(null)}>
                  Discard
                </Button>
                <Button className="bg-primary text-primary-foreground" onClick={handleConfirmImpact}>
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
