"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, Package, AlertTriangle, Building2,
  BarChart3, History, Shield, ArrowRight, CheckCircle2, Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import Image from "next/image";

const features = [
  { icon: Package, title: "Asset Tracking", desc: "Centralised inventory across every department with serial-level traceability." },
  { icon: AlertTriangle, title: "Fault Reporting", desc: "Staff log faults instantly with severity, photos and audit history." },
  { icon: Building2, title: "Department Management", desc: "Organise resources by department with HOD ownership and roll-ups." },
  { icon: BarChart3, title: "Real-time Dashboard", desc: "Live KPIs and charts that update as assets move through their lifecycle." },
  { icon: History, title: "Audit History", desc: "Every change is timestamped with who, what and when — fully accountable." },
  { icon: Shield, title: "Role-based Access", desc: "Separate College and Senate portals enforce the right permissions." },
];

const stats = [
  { value: 12480, label: "Assets Tracked", suffix: "+" },
  { value: 86, label: "Departments", suffix: "" },
  { value: 2340, label: "Reports Filed", suffix: "+" },
  { value: 99.8, label: "Uptime", suffix: "%" },
];

const steps = [
  { n: "01", title: "Register", desc: "Sign up as College or Senate staff and join your department." },
  { n: "02", title: "Log Assets", desc: "Add equipment, books and furniture with full lifecycle metadata." },
  { n: "03", title: "Monitor", desc: "Track health, faults and value across the entire institution." },
];

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const dur = 1500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end]);
  const isFloat = end % 1 !== 0;
  return <span>{isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString()}{suffix}</span>;
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">SAMS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Impact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link href="/signup"><Button size="sm" className="bg-gradient-primary hover:opacity-90">Get started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-bg pt-32 pb-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
                Built for modern academic institutions
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                Smart Asset Management for{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-glow to-cyan-300">
                  Modern Institutions
                </span>
              </h1>
              <p className="text-lg text-white/70 mb-8 max-w-xl">
                Track every desk, device and instrument across your colleges. Catch faults early, surface insights instantly, and give Senate full visibility — all in one elegant platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/login?role=college">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                    College Portal <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/login?role=senate">
                  <Button size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10 font-semibold">
                    Senate Portal <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-white/60">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary-glow" /> No card required</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary-glow" /> Setup in minutes</div>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="absolute -inset-4 bg-gradient-glow blur-3xl opacity-60" />
              <Image
                src={heroImg}
                alt="Asset management dashboard preview"
                width={1536}
                height={1024}
                className="relative rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-5xl font-bold gradient-text tracking-tight">
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-muted-foreground mt-2 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-semibold mb-4">
              FEATURES
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Everything you need to run a tight ship</h2>
            <p className="text-muted-foreground text-lg">From the smallest lab stool to the most expensive instrument — accounted for, in real time.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="card-elevated p-6 group" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-semibold mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Three steps to total control</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((s, i) => (
              <div key={s.n} className="card-elevated p-8 relative">
                <div className="text-6xl font-bold gradient-text mb-4">{s.n}</div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 text-accent/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="hero-bg rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Ready to modernise your institution?</h2>
              <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">Join schools and universities running smarter operations with SAMS.</p>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                  Create your account <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">SAMS</span>
            <span>· School Asset Management System</span>
          </div>
          <div>© {new Date().getFullYear()} SAMS. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}