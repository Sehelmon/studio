"use client";

import { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  Calculator, 
  Fingerprint, 
  Gauge, 
  Info,
  ShieldAlert,
  SearchCheck,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { autoAnalyzeConsumption, type AutoAnalyzeConsumptionOutput } from "@/ai/flows/auto-analyze-consumption-flow";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";

export default function ConsumptionAuditor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<AutoAnalyzeConsumptionOutput | null>(null);
  const [lastFile, setLastFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  const processFile = async (base64String: string) => {
    setIsAnalyzing(true);
    setAnalyzedResult(null);
    setLastFile(base64String);

    try {
      const result = await autoAnalyzeConsumption({
        documentDataUri: base64String,
        additionalContext: "Forensic auditor mode enabled. Validate all mathematical claims by cross-referencing readings with totals."
      });
      setAnalyzedResult(result);
      
      if (result.validationStatus === 'mismatch') {
        toast({
          variant: "destructive",
          title: "Discrepancy Detected",
          description: "Extracted data failed cross-validation checks. Confidence score penalized.",
        });
      } else {
        toast({
          title: "Audit Complete",
          description: "Forensic verification successful. Data integrity confirmed.",
        });
      }
    } catch (error: any) {
      console.error("Auditor Flow Error:", error);
      const isQuotaError = error.message?.toLowerCase().includes('quota') || error.message?.toLowerCase().includes('limit');
      
      toast({
        variant: "destructive",
        title: isQuotaError ? "AI Service Busy" : "Analysis Failed",
        description: isQuotaError 
          ? "AI analysis temporarily unavailable due to high demand. Please try again later."
          : "Could not process this document. Please ensure readings are legible and try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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

    const reader = new FileReader();
    reader.onloadend = () => {
      processFile(reader.result as string);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleRetry = () => {
    if (lastFile) processFile(lastFile);
  };

  const handleConfirmImpact = () => {
    if (!analyzedResult) return;

    const data = {
      type: analyzedResult.documentTypeIdentified,
      emissions: analyzedResult.estimatedCarbonEmissionsKgCO2e,
      category: analyzedResult.spendingCategory,
      timestamp: new Date().toISOString(),
      auditData: analyzedResult.auditTrail,
      validationStatus: analyzedResult.validationStatus,
      rawExtracted: analyzedResult.extractedInformation
    };

    if (user) {
      const logId = Date.now().toString();
      const logRef = doc(db, "users", user.uid, "impact_logs", logId);
      
      setDoc(logRef, data)
        .then(() => {
          toast({
            title: "Audit Logged",
            description: "Your forensic impact has been recorded in your profile.",
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
    } else {
      toast({
        title: "Logged (Demo Mode)",
        description: "In a live environment, this audit would be saved to your persistent history.",
      });
      setAnalyzedResult(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-headline font-bold">Forensic Consumption Auditor</h1>
          <p className="text-muted-foreground">High-precision data extraction with cross-validation integrity checks.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="h-8 gap-1.5 border-primary/30">
            <Fingerprint className="w-3.5 h-3.5 text-primary" />
            Verification Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4 space-y-6">
          <Card className="glass-card border-dashed border-2 border-primary/30 bg-primary/5 overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf"
              />
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {isAnalyzing ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="text-lg font-headline font-bold mb-1">
                {isAnalyzing ? "Analyzing Integrity..." : "Upload Bill/Receipt"}
              </h3>
              <p className="text-muted-foreground text-xs mb-6 max-w-xs">
                AI cross-checks (Present - Previous) against printed totals to detect bill errors.
              </p>
              {!isAnalyzing && (
                <div className="flex flex-col gap-2 w-full max-w-[140px]">
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Choose Document
                  </Button>
                  {lastFile && !analyzedResult && (
                    <Button variant="ghost" size="xs" onClick={handleRetry} className="text-[10px] text-muted-foreground h-7">
                      <RefreshCw className="w-3 h-3 mr-1" /> Retry Last Upload
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <SearchCheck className="w-3.5 h-3.5" />
                Auditor Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-secondary rounded-md"><Calculator className="w-4 h-4 text-primary" /></div>
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">Cross-Validation:</span> AI verifies if the printed "Total Units" matches the reading delta.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-secondary rounded-md"><ShieldAlert className="w-4 h-4 text-primary" /></div>
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">Discrepancy Detection:</span> Confidence scores drop automatically if mathematical contradictions exist.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-8 space-y-6">
          {analyzedResult ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              {analyzedResult.validationStatus === 'mismatch' && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle className="font-bold">Forensic Mismatch Detected</AlertTitle>
                  <AlertDescription className="text-xs">
                    The printed total on the bill does not match the calculated difference of the meter readings. Confidence score has been penalized.
                  </AlertDescription>
                </Alert>
              )}

              <Card className={cn(
                "glass-card overflow-hidden shadow-2xl transition-all",
                analyzedResult.validationStatus === 'mismatch' ? "border-destructive/50" : "border-primary/50"
              )}>
                <div className={cn(
                  "px-6 py-4 flex items-center justify-between border-b",
                  analyzedResult.validationStatus === 'mismatch' ? "bg-destructive/10 border-destructive/20" : "bg-primary/10 border-primary/20"
                )}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background/50 rounded-lg">
                      <FileText className={cn("w-5 h-5", analyzedResult.validationStatus === 'mismatch' ? "text-destructive" : "text-primary")} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Forensic Audit</div>
                      <div className="text-sm font-bold">{analyzedResult.documentTypeIdentified}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Integrity Score</div>
                    <Badge variant={analyzedResult.confidenceScore > 0.8 ? "default" : "destructive"}>
                      {Math.round(analyzedResult.confidenceScore * 100)}%
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-secondary/20 rounded-xl border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Validated Consumption</div>
                      <div className="text-3xl font-headline font-bold text-primary">
                        {analyzedResult.auditTrail.finalValueUsed} <span className="text-sm font-normal text-muted-foreground">{analyzedResult.auditTrail.unitType}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Carbon Impact</div>
                      <div className="text-3xl font-headline font-bold text-destructive">
                        {analyzedResult.estimatedCarbonEmissionsKgCO2e.toLocaleString()}kg <span className="text-sm font-normal opacity-70">CO2e</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-muted/20 rounded-xl border border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <Calculator className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold uppercase tracking-tight">Audit Trail Verification</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="space-y-1">
                          <div className="text-[9px] uppercase text-muted-foreground font-bold">Previous</div>
                          <div className="text-sm font-mono bg-background/50 p-1.5 rounded border border-border/50">
                            {analyzedResult.auditTrail.previousReading || "???"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] uppercase text-muted-foreground font-bold">Present</div>
                          <div className="text-sm font-mono bg-background/50 p-1.5 rounded border border-border/50">
                            {analyzedResult.auditTrail.presentReading || "???"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] uppercase text-muted-foreground font-bold">Extracted Total</div>
                          <div className="text-sm font-mono bg-background/50 p-1.5 rounded border border-border/50">
                            {analyzedResult.auditTrail.extractedTotal || "???"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] uppercase text-muted-foreground font-bold">Calculated Total</div>
                          <div className={cn(
                            "text-sm font-mono p-1.5 rounded border",
                            analyzedResult.auditTrail.discrepancyFound ? "bg-destructive/10 border-destructive/30 text-destructive font-bold" : "bg-primary/10 border-primary/30 text-primary"
                          )}>
                            {analyzedResult.auditTrail.calculatedTotal || "???"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-border/50 pt-4 mt-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground font-bold uppercase tracking-tighter">Validation Method:</span>
                          <span className="font-mono bg-secondary px-2 py-0.5 rounded text-[10px]">{analyzedResult.auditTrail.calculationFormula}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground font-bold uppercase tracking-tighter">Status:</span>
                          <Badge variant={analyzedResult.validationStatus === 'verified' ? 'default' : 'destructive'} className="h-5 text-[9px]">
                            {analyzedResult.validationStatus.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs font-bold flex items-center gap-2 px-1">
                        <Info className="w-3.5 h-3.5 text-primary" />
                        Forensic Reasoning
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed px-1 italic bg-secondary/10 p-4 rounded-lg border border-border/50">
                        {analyzedResult.forensicReasoning}
                      </p>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="text-[10px] font-bold uppercase text-primary mb-2 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Strategic Insight
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {analyzedResult.personalizedInsights}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-border" onClick={() => { setAnalyzedResult(null); setLastFile(null); }}>
                  Discard Audit
                </Button>
                <Button 
                  className={cn(
                    "text-white",
                    analyzedResult.validationStatus === 'mismatch' ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
                  )} 
                  onClick={handleConfirmImpact}
                >
                  Confirm & Log Impact <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[550px] flex flex-col items-center justify-center border border-border rounded-2xl bg-secondary/10 border-dashed text-center p-8">
              <div className="p-6 bg-background/50 rounded-full mb-6">
                <SearchCheck className="w-12 h-12 text-muted/30" />
              </div>
              <div className="text-muted-foreground font-headline font-bold text-lg">Awaiting forensic input...</div>
              <p className="text-muted-foreground text-sm mt-2 max-w-[320px] leading-relaxed">
                Upload a document to perform a mathematical audit of your consumption readings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
