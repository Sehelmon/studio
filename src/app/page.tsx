
"use client";

import Link from "next/link";
import { ArrowRight, Globe, Zap, Binary, Rocket, Target, Building2, CheckCircle2, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";

export default function LandingPage() {
  const { toast } = useToast();
  const { user } = useUser();

  const handleContactSales = () => {
    toast({
      title: "Request Sent",
      description: "Our enterprise sales team will contact you within 24 hours.",
    });
  };

  const handlePlaceholderClick = (feature: string) => {
    toast({
      title: `${feature} Information`,
      description: `The ${feature.toLowerCase()} section is currently being finalized for our production release.`,
    });
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tighter">EcoLogic AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#about" className="hover:text-primary transition-colors">Mission</Link>
            <Link href="#enterprise" className="hover:text-primary transition-colors">Enterprise</Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:inline-flex">Login</Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(44,218,177,0.3)]">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-pulse-subtle">
            <Zap className="w-3 h-3" />
            AI-POWERED SUSTAINABILITY INTELLIGENCE
          </div>
          <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tight mb-8 max-w-5xl mx-auto leading-[0.9]">
            The World&apos;s Most Advanced <span className="text-primary italic">Carbon Copilot</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Stop guessing your impact. EcoLogic AI proactively audits your consumption, predicts your environmental future, and coaches you toward net-zero with forensic precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/dashboard" : "/login"}>
              <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:scale-105 transition-transform duration-300">
                {user ? "View Dashboard" : "Launch Dashboard"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      </section>

      {/* Stats/Proof */}
      <section className="py-20 border-y border-border/50 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Users", value: "45k+" },
            { label: "Carbon Tracked", value: "1.2M Tons" },
            { label: "AI Predictions", value: "98.4%" },
            { label: "Partner Brands", value: "120+" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-headline font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">Forensic Carbon Intelligence</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Our platform isn&apos;t just a tracker. It&apos;s a digital twin of your environmental impact powered by Gemini.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group">
              <FileSearch className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-headline font-bold mb-4">Multi-Modal Auditor</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Upload electricity bills, fuel receipts, and grocery lists. Our AI extracts data automatically, eliminating manual entry.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group">
              <Binary className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-headline font-bold mb-4">Predictive Twin</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Simulate lifestyle changes like switching to an EV or changing diets. Forecast your environmental score decades into the future.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group">
              <Rocket className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-headline font-bold mb-4">Proactive Copilot</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Gemini doesn&apos;t wait for you. It identifies trends, explains score drops, and alerts you to optimization opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="about" className="py-32 bg-secondary/20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                <Target className="w-3 h-3" />
                OUR MISSION
              </div>
              <h2 className="text-4xl md:text-6xl font-headline font-bold mb-8 leading-tight">
                Democratizing <span className="text-primary">Environmental</span> Accountability
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We believe that carbon tracking should be as effortless as checking your bank balance. Our mission is to leverage hyper-advanced AI to give every individual the tools to understand their impact and take meaningful action toward a sustainable future.
              </p>
              <ul className="space-y-4">
                {[
                  "Eliminate manual data entry via AI OCR",
                  "Provide science-based impact predictions",
                  "Foster a community of accountability",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[40px] overflow-hidden border border-border relative z-10">
                <img 
                  src="https://picsum.photos/seed/mission-1/800/800" 
                  alt="Environmental Mission" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  data-ai-hint="nature forest"
                />
              </div>
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="py-32 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-6">
            <Building2 className="w-3 h-3" />
            FOR ORGANIZATIONS
          </div>
          <h2 className="text-4xl md:text-6xl font-headline font-bold mb-8">Scale Your Impact</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
            EcoLogic AI for Enterprise provides organizations with the tools to track Scope 3 emissions, engage employees in sustainability, and automate ESG reporting.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <Card className="glass-card p-8 border-accent/20">
              <h3 className="text-xl font-bold mb-4">ESG Automation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automatically aggregate consumption data across your entire supply chain with forensic-grade accuracy.
              </p>
            </Card>
            <Card className="glass-card p-8 border-accent/20">
              <h3 className="text-xl font-bold mb-4">Employee Engagement</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Gamify sustainability with custom challenges and rewards tailored to your corporate climate goals.
              </p>
            </Card>
            <Card className="glass-card p-8 border-accent/20">
              <h3 className="text-xl font-bold mb-4">Custom Modeling</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Build bespoke digital twins to simulate the impact of large-scale infrastructure and policy changes.
              </p>
            </Card>
          </div>
          
          <Button size="lg" className="mt-16 bg-accent text-white hover:bg-accent/90" onClick={handleContactSales}>
            Contact Enterprise Sales
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[40px] bg-primary relative overflow-hidden text-primary-foreground text-center">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-headline font-bold mb-8 leading-tight">Ready to Audit Your World?</h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
              Join thousands of individuals and enterprises using EcoLogic AI to master their environmental footprint.
            </p>
            <Link href={user ? "/dashboard" : "/login"}>
              <Button size="lg" className="h-16 px-12 text-xl bg-background text-foreground hover:bg-background/90 rounded-2xl">
                Get Started for Free
              </Button>
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-headline font-bold text-lg tracking-tighter">EcoLogic AI</span>
          </Link>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <button onClick={() => handlePlaceholderClick('Privacy')} className="hover:text-primary transition-colors">Privacy</button>
            <button onClick={() => handlePlaceholderClick('Terms')} className="hover:text-primary transition-colors">Terms</button>
            <button onClick={() => handlePlaceholderClick('API')} className="hover:text-primary transition-colors">API</button>
            <button onClick={() => handlePlaceholderClick('Status')} className="hover:text-primary transition-colors">Status</button>
          </div>
          <div className="text-xs text-muted-foreground/50">
            © 2025 EcoLogic AI. Built for the Future.
          </div>
        </div>
      </footer>
    </div>
  );
}
