"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  User, 
  MapPin, 
  Target, 
  ShieldCheck, 
  Save, 
  Loader2, 
  Globe,
  Lock,
  UserCheck,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function SettingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    location: "",
    sustainabilityGoals: "",
    userHabits: "",
    isProMember: false,
  });

  // Support demo mode by using a fixed ID if no user is authenticated
  const profileRef = useMemo(() => {
    const uid = user?.uid || "demo-user";
    return doc(db, "users", uid);
  }, [db, user]);

  const { data: profile, loading: profileLoading } = useDoc(profileRef);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        location: profile.location || "San Francisco, CA",
        sustainabilityGoals: profile.sustainabilityGoals || "Reduce household energy consumption by 20%.",
        userHabits: profile.userHabits || "Drives to work daily, leaves lights on frequently.",
        isProMember: profile.isProMember === true,
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileRef) return;

    setIsSaving(true);
    const updateData = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    // Use setDoc with merge to ensure demo users can create their doc
    setDoc(profileRef, updateData, { merge: true })
      .then(() => {
        toast({
          title: "Profile Updated",
          description: "Your sustainability preferences have been saved and synced across the platform.",
        });
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: profileRef.path,
          operation: 'update',
          requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-headline font-bold tracking-tight">Intelligence Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your sustainability profile and AI grounding data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  Sustainability Identity
                </CardTitle>
                <CardDescription>
                  This information grounds Gemini when providing personalized insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="displayName" 
                        className="pl-9" 
                        placeholder="e.g., Alex Rivers"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Primary Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="location" 
                        className="pl-9" 
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Sustainability Goals</Label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea 
                      id="goals" 
                      className="pl-9 min-h-[100px]" 
                      placeholder="e.g., Reduce carbon footprint by 20%, transition to solar..."
                      value={formData.sustainabilityGoals}
                      onChange={(e) => setFormData(prev => ({ ...prev, sustainabilityGoals: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="habits">Known Habits</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea 
                      id="habits" 
                      className="pl-9 min-h-[100px]" 
                      placeholder="e.g., Use public transport for work, eat plant-based 3 days a week..."
                      value={formData.userHabits}
                      onChange={(e) => setFormData(prev => ({ ...prev, userHabits: e.target.value }))}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="space-y-1">
                    <div className="text-sm font-bold flex items-center gap-2">
                      Pro Membership Status
                      <Badge variant="default" className="text-[10px] h-5 bg-primary text-primary-foreground">PRO</Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">Enable exclusive AI auditing features</div>
                  </div>
                  <Switch 
                    checked={formData.isProMember} 
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isProMember: checked }))} 
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 pt-6">
                <Button disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Profile & Grounding Data
                </Button>
              </CardFooter>
            </Card>
          </form>

          <Card className="glass-card border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-xl text-destructive flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Data Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your account data and privacy preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border">
                <div className="space-y-1">
                  <div className="text-sm font-bold">Email Notifications</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Weekly impact reports & AI alerts</div>
                </div>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border">
                <div className="space-y-1">
                  <div className="text-sm font-bold">Forensic Data Retention</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Storage of audited bills and receipts</div>
                </div>
                <Badge variant="outline">90 Days</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-card overflow-hidden">
            <div className="h-24 bg-primary/10 flex items-center justify-center relative">
              <div className="absolute top-4 right-4">
                {formData.isProMember && (
                   <div className="p-1 bg-primary rounded-full"><Check className="w-3 h-3 text-primary-foreground" /></div>
                )}
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-background bg-secondary flex items-center justify-center overflow-hidden">
                <img 
                  src={profile?.photoURL || "https://picsum.photos/seed/user-1/200/200"} 
                  alt={formData.displayName} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <CardContent className="p-6 text-center pt-10">
              <h3 className="text-lg font-bold">{formData.displayName || "Alex Rivers"}</h3>
              <p className="text-xs text-muted-foreground mb-2">{user?.email || "demo@ecologic.ai"}</p>
              {formData.isProMember && (
                <div className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-4">Pro Member</div>
              )}
              <Separator className="my-4" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Eco Score</span>
                <span className="font-headline font-bold text-primary">{profile?.ecoScore || 84}</span>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">AI Compliance</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Grounding data is used exclusively to train your local Gemini Carbon Twin. Your raw documents are processed through forensic OCR and never shared with third-party providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}