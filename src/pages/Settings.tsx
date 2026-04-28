// src/pages/Settings.tsx
"use client";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function Settings() {
  const { currentUser } = useStore();
  if (!currentUser) return null;
  const initials = currentUser.name.split(" ").map(n => n[0]).slice(0, 2).join("");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and preferences.</p>
      </div>
      <div className="card-elevated p-6 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 ring-2 ring-accent/20">
            <AvatarFallback className="bg-gradient-primary text-white font-semibold text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-lg">{currentUser.name}</div>
            <div className="text-sm text-muted-foreground capitalize">{currentUser.role} Staff · {currentUser.staffId}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Full name</Label><Input defaultValue={currentUser.name} className="mt-1.5" /></div>
          <div><Label>Staff ID</Label><Input defaultValue={currentUser.staffId} className="mt-1.5" /></div>
          <div className="sm:col-span-2"><Label>Email</Label><Input defaultValue={currentUser.email} className="mt-1.5" /></div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-gradient-primary hover:opacity-90" onClick={() => toast.success("Profile saved")}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}
