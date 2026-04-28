"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, Package, AlertTriangle,
  History, Settings, LogOut, Bell, Search, GraduationCap, Plus,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/departments", label: "Departments", icon: Building2 },
  { to: "/app/assets", label: "Assets", icon: Package },
  { to: "/app/faults", label: "Fault Reports", icon: AlertTriangle },
  { to: "/app/history", label: "History & Audit", icon: History },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser, logout, seed, seeded } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!seeded) seed();
    if (!currentUser) router.push("/login");
  }, [currentUser, seeded, seed, router]);

  if (!currentUser) return null;

  const initials = currentUser.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const isSenate = currentUser.role === "senate";

  return (
    <div className="min-h-screen flex w-full bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground sticky top-0 h-screen">
        <div className="px-6 py-5 border-b border-sidebar-border flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold tracking-tight">SAMS</div>
            <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
              {isSenate ? "Senate Portal" : "College Portal"}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => { logout(); toast.success("Signed out"); router.push("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-40 flex items-center px-4 md:px-8 gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search assets, departments..." className="pl-9 bg-muted/50 border-0" />
          </div>
          <Button
            size="sm"
            className="hidden md:inline-flex bg-gradient-primary hover:opacity-90"
            onClick={() => router.push("/app/assets/new")}
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Asset
          </Button>
          <button className="relative p-2 rounded-lg hover:bg-muted">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
          </button>
          <div className="flex items-center gap-2.5">
            <Avatar className="w-9 h-9 ring-2 ring-accent/20">
              <AvatarFallback className="bg-gradient-primary text-white font-semibold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold leading-tight">{currentUser.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{currentUser.role} Staff</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 animate-fade-in">
          {children} {/* was: <Outlet /> */}
        </main>
      </div>
    </div>
  );
}