"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Building2, Landmark } from "lucide-react";
import { useState } from "react";
import { useStore, Role } from "@/store/useStore";
import { toast } from "sonner";
import authImg from "@/assets/auth-illustration.jpg";
import Image from "next/image";

export default function Login() {
  const params = useSearchParams();
  const initialRole = (params.get("role") as Role) || "college";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const router = useRouter();
  const login = useStore((s) => s.login);

  const handleLogin = (role: Role) => {
    if (!email || !password) {
      toast.error("Enter your email and password");
      return;
    }
    login(email, role);
    toast.success(`Welcome back! Signed in as ${role === "senate" ? "Senate" : "College"} staff`);
    router.push("/app/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Illustration side */}
      <div className="hidden lg:flex hero-bg p-12 flex-col justify-between relative overflow-hidden">
        <Link href="/" className="flex items-center gap-2.5 text-white relative z-10">
          <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl">SAMS</span>
        </Link>
        <div className="relative z-10">
          <div className="absolute -inset-8 bg-gradient-glow blur-3xl opacity-50" />
          <Image
            src={authImg}
            alt="Asset management illustration"
            width={1024}
            height={1280}
            className="relative max-h-[60vh] w-auto mx-auto rounded-2xl shadow-2xl"
          />
        </div>
        <div className="text-white relative z-10 max-w-md">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome back</h2>
          <p className="text-white/70">Sign in to monitor your institution's assets in real time.</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SAMS</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Sign in to SAMS</h1>
          <p className="text-muted-foreground mb-8">Choose your portal below to continue.</p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button className="text-xs text-accent hover:underline">Forgot password?</button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <Checkbox checked={remember} onCheckedChange={(c) => setRemember(!!c)} /> Remember me
            </label>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={() => handleLogin("college")}
                variant={initialRole === "college" ? "default" : "outline"}
                className={initialRole === "college" ? "bg-gradient-primary hover:opacity-90" : ""}
              >
                <Building2 className="w-4 h-4 mr-1.5" /> College Staff
              </Button>
              <Button
                onClick={() => handleLogin("senate")}
                variant={initialRole === "senate" ? "default" : "outline"}
                className={initialRole === "senate" ? "bg-gradient-primary hover:opacity-90" : ""}
              >
                <Landmark className="w-4 h-4 mr-1.5" /> Senate Staff
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center pt-4">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-accent font-medium hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}