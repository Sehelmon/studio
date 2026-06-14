"use client";

import Link from "next/link";
import { ArrowRight, Globe, Zap, Shield, BarChart3, Binary, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tighter">EcoLogic AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#about" className="hover:text-primary transition-colors">Mission</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Enterprise</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="hidden sm:inline-flex">Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(44,218,177,0.3)]">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
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
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:scale-105 transition-transform duration-300">
                Launch Dashboard
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-border hover:bg-white/5">
              Watch Demo
            </Button>
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
      <section id="features" className="py-32">
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
              <h3 className="text-2xl font-headline font-bold mb-4">Carbon Twin</h3>
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

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[40px] bg-primary relative overflow-hidden text-primary-foreground text-center">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-headline font-bold mb-8 leading-tight">Ready to Audit Your World?</h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
              Join thousands of individuals and enterprises using EcoLogic AI to master their environmental footprint.
            </p>
            <Link href="/dashboard">
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
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-headline font-bold text-lg tracking-tighter">EcoLogic AI</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">API</Link>
            <Link href="#" className="hover:text-primary">Status</Link>
          </div>
          <div className="text-xs text-muted-foreground/50">
            © 2025 EcoLogic AI. Built for the Future.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper icons
function FileSearch(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="14" r="2"/><path d="m20 22-1.5-1.5"/></svg>
  )
}
