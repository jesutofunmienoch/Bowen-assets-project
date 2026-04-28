"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore, Role } from "@/store/useStore";
import { toast } from "sonner";
import authImg from "@/assets/auth-illustration.jpg";
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const { signUp, departments, seed, seeded } = useStore();

  useEffect(() => { if (!seeded) seed(); }, [seeded, seed]);

  const [form, setForm] = useState({
    name: "", staffId: "", email: "", password: "", confirm: "",
    departmentId: "", role: "college" as Role,
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("Please complete all required fields");
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    signUp({
      name: form.name, staffId: form.staffId, email: form.email,
      role: form.role, departmentId: form.departmentId || undefined,
    });
    toast.success("Account created! Welcome to SAMS");
    router.push("/app/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
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
            alt="Asset management"
            width={1024}
            height={1280}
            className="relative max-h-[55vh] w-auto mx-auto rounded-2xl shadow-2xl"
          />
        </div>
        <div className="text-white relative z-10 max-w-md">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Join SAMS today</h2>
          <p className="text-white/70">Get visibility into every asset across your institution.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <form onSubmit={submit} className="w-full max-w-md animate-fade-up space-y-4">
          <div className="lg:hidden mb-4 flex justify-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SAMS</span>
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create your account</h1>
            <p className="text-muted-foreground">Get started in less than a minute.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Full name</Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-1.5" placeholder="Jane Adekunle" />
            </div>
            <div>
              <Label>Staff ID</Label>
              <Input value={form.staffId} onChange={(e) => update("staffId", e.target.value)} className="mt-1.5" placeholder="ACC/2024/001" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-1.5" placeholder="jane@school.edu" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Confirm</Label>
              <Input type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Department</Label>
            <Select value={form.departmentId} onValueChange={(v) => update("departmentId", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Role</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {(["college", "senate"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => update("role", r)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    form.role === r ? "border-accent bg-accent-soft text-accent" : "border-border hover:border-accent/50"
                  }`}
                >
                  {r === "college" ? "College Staff" : "Senate Staff"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Profile photo (optional)</Label>
            <label className="mt-1.5 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">Create account</Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}