
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Globe, LogIn, Mail, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Basic check for empty config to provide a better error message
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        throw new Error("Firebase API Key is missing. Please check your .env file or use Demo Mode.");
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Initialize User Profile in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const profileData = {
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          photoURL: user.photoURL || "",
          ecoScore: 50, // Starting score
          joinedAt: new Date().toISOString(),
        };

        setDoc(userDocRef, profileData, { merge: true })
          .catch(async () => {
            const permissionError = new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: profileData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
      }
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Auth Error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Failed to sign in. If you don't have keys configured yet, try Demo Mode.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    toast({
      title: "Entering Demo Mode",
      description: "Bypassing authentication for demonstration purposes.",
    });
    router.push("/dashboard");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const profileData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        ecoScore: 50,
        joinedAt: new Date().toISOString(),
      };

      setDoc(userDocRef, profileData, { merge: true })
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'write',
            requestResourceData: profileData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Error",
        description: error.message || "Failed to sign in with Google. Try Demo Mode if keys are not set up.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 hero-gradient">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-6 outline-none">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <Globe className="w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tighter">EcoLogic AI</span>
          </Link>
          <h1 className="text-3xl font-headline font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Enter your credentials or try our demo environment.</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{isLogin ? "Login" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin ? "Access your sustainability dashboard." : "Join our community of eco-conscious users."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="alex@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/5" onClick={handleDemoMode}>
              <Sparkles className="w-4 h-4 mr-2" />
              Enter Demo Mode (No Key Required)
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
              Continue with Google
            </Button>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="w-full" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
