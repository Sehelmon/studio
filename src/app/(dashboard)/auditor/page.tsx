"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight, Calculator, Fingerprint, Gauge, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { autoAnalyzeConsumption, type AutoAnalyzeConsumptionOutput } from "@/ai/flows/auto-analyze-consumption-flow";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function ConsumptionAuditor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<AutoAnalyzeConsumptionOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image or PDF document.",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalyzedResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const result = await autoAnalyzeConsumption({
          documentDataUri: base64String,
          additionalContext: "User performing high-precision forensic carbon audit."
        });
        setAnalyzedResult(result);
        toast({
          title: "Audit Complete",
          description: "Forensic extraction successful.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: error.message || "Gemini could not process this document. Please ensure readings are legible.",
        });
      } finally {
        setIsAnalyzing(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmImpact = () => {
    if (!user || !analyzedResult) return;

    const logRef = doc(db, "users", user.uid, "impact_logs", Date.now().toString());
    const data = {
      type: analyzedResult.documentTypeIdentified,
      emissions: analyzedResult.estimatedCarbonEmissionsKgCO2e,
      category: analyzedResult.spendingCategory,
      timestamp: new Date().toISOString(),
      auditData: analyzedResult.auditDetails,
      rawExtracted: analyzedResult.extractedInformation
    };

    setDoc(logRef, data)
      .then(() => {
        toast({
          title: "Audit Logged",
          description: "Your forensic impact has been recorded.",
        });
        setAnalyzedResult(null);
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
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-headline font-bold">Forensic Consumption Auditor</h1>
          <p className="text-muted-foreground">Submit utility bills or receipts for high-precision data extraction and carbon verification.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="h-8 gap-1.5 border-primary/30">
            <Fingerprint className="w-3.5 h-3.5 text-primary" />
            Verification Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-5 space-y-6">
          <Card className="glass-card border-dashed border-2 border-primary/30 bg-primary/5 overflow-hidden">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf"
              />
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                {isAnalyzing ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="text-xl font-headline font-bold mb-2">
                {isAnalyzing ? "Processing readings..." : "Drop Audit Documents"}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                AI extracts Previous and Present readings to verify consumption accuracy.
              </p>
              {!isAnalyzing && (
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Choose Document
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                Auditor Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-secondary rounded-md"><Calculator className="w-4 h-4 text-primary" /></div>
                <div className="text-sm leading-relaxed">
                  <span className="font-bold">Prioritized Extraction:</span> AI looks for explicit "Total Units" first, then verifies by calculating (Present - Previous).
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-secondary rounded-md"><Gauge className="w-4 h-4 text-primary" /></div>
                <div className="text-sm leading-relaxed">
                  <span className="font-bold">Dynamic Factors:</span> Local grid emission factors are matched to the identified provider.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-7 space-y-6">
          {analyzedResult ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <Card className="glass-card border-primary/50 overflow-hidden shadow-2xl">
                <div className="bg-primary/10 px-6 py-4 flex items-center justify-between border-b border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-tighter text-primary">Forensic Result</div>
                      <div className="text-sm font-bold">{analyzedResult.documentTypeIdentified}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Confidence Score</div>
                    <Badge variant={analyzedResult.confidenceScore > 0.8 ? "default" : "destructive"}>
                      {Math.round(analyzedResult.confidenceScore * 100)}%
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="p-4 bg-secondary/20 rounded-xl border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Spending Category</div>
                      <div className="text-2xl font-headline font-bold">{analyzedResult.spendingCategory}</div>
                    </div>
                    <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Carbon Impact</div>
                      <div className="text-2xl font-headline font-bold text-destructive">
                        {analyzedResult.estimatedCarbonEmissionsKgCO2e.toLocaleString()}kg CO2e
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Calculator className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold">Calculation Breakdown</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="space-y-1">
                          <div className="text-[9px] uppercase text-muted-foreground">Previous</div>
                          <div className="text-sm font-mono">{analyzedResult.auditDetails.previousReading || "N/A"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] uppercase text-muted-foreground">Present</div>
                          <div className="text-sm font-mono">{analyzedResult.auditDetails.presentReading || "N/A"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] uppercase text-muted-foreground">Total Units</div>
                          <div className="text-sm font-bold text-primary">{analyzedResult.auditDetails.totalUnits} {analyzedResult.auditDetails.unitType}</div>
                        </div>
                      </div>
                      <div className="text-xs space-y-2 text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Derivation Logic:</span>
                          <span className="text-foreground font-medium">{analyzedResult.auditDetails.calculationMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbon Formula:</span>
                          <span className="text-foreground font-mono font-medium">{analyzedResult.auditDetails.carbonFormula}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs font-bold flex items-center gap-2 px-1">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        Strategic Analysis
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed px-1">
                        {analyzedResult.personalizedInsights}
                      </p>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                      <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                        <Fingerprint className="w-3.5 h-3.5" />
                        Forensic Reasoning
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">
                        {analyzedResult.reasoning}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-border" onClick={() => setAnalyzedResult(null)}>
                  Discard Audit
                </Button>
                <Button className="bg-primary text-primary-foreground" onClick={handleConfirmImpact}>
                  Verify & Log Impact <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-border rounded-2xl bg-secondary/10 border-dashed text-center p-8">
              <div className="p-6 bg-background/50 rounded-full mb-6">
                <Fingerprint className="w-12 h-12 text-muted/30" />
              </div>
              <div className="text-muted-foreground font-headline font-bold text-lg">No Audit Active</div>
              <p className="text-muted-foreground text-sm mt-2 max-w-[300px] leading-relaxed">
                Upload a utility bill or fuel receipt to initiate the forensic verification process.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
