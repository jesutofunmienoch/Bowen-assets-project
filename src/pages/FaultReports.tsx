"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useStore, Severity } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ArrowLeft, Upload, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";
import { conditionColor, severityColor, StatusBadge } from "@/lib/format";

const severities: Severity[] = ["Low", "Medium", "High", "Critical"];

export default function FaultReports() {
  const pathname = usePathname();
  const params = useSearchParams();
  // Show new form if on /app/faults/new OR if an asset query param is present
  const isNew = pathname.endsWith("/new") || !!params.get("asset");
  return isNew ? <NewFaultForm /> : <FaultList />;
}

function FaultList() {
  const { faultReports, assets } = useStore();
  const router = useRouter();
  const assetName = (id: string) => assets.find(a => a.id === id)?.name || "Unknown asset";

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fault Reports</h1>
          <p className="text-muted-foreground mt-1">{faultReports.length} reports filed across the institution.</p>
        </div>
        <Button onClick={() => router.push("/app/faults/new")} className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-1.5" /> Report Fault
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faultReports.length === 0 && (
          <div className="card-elevated p-12 text-center md:col-span-2 lg:col-span-3">
            <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-semibold mb-1">No fault reports yet</h3>
            <p className="text-sm text-muted-foreground">All assets are in good shape — or none have been reported yet.</p>
          </div>
        )}
        {faultReports.map((f) => (
          <div key={f.id} className="card-elevated p-5">
            <div className="flex items-center justify-between mb-3">
              <StatusBadge className={severityColor(f.severity)}>{f.severity}</StatusBadge>
              <span className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString()}</span>
            </div>
            <h3 className="font-semibold mb-1">{assetName(f.assetId)}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{f.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{f.affectedQty} units affected</span>
              <StatusBadge className={conditionColor(
                f.status === "Resolved" ? "Good" : f.status === "Under Repair" ? "Fair" : "Faulty"
              )}>
                {f.status}
              </StatusBadge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewFaultForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { assets, addFaultReport, currentUser } = useStore();
  const [form, setForm] = useState({
    assetId: params.get("asset") || "",
    affectedQty: 1,
    description: "",
    severity: "Medium" as Severity,
    date: new Date().toISOString().slice(0, 10),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.assetId || !form.description) return toast.error("Select an asset and describe the fault");
    addFaultReport({
      assetId: form.assetId,
      reportedBy: currentUser?.name || "Anonymous",
      affectedQty: Number(form.affectedQty),
      description: form.description,
      severity: form.severity,
      date: form.date,
    });
    toast.success("Fault report submitted");
    router.push("/app/faults");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/app/faults">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Report a Fault</h1>
        <p className="text-muted-foreground mt-1">The asset will be auto-updated and an audit log entry created.</p>
      </div>
      <form onSubmit={submit} className="card-elevated p-6 space-y-5">
        <div>
          <Label>Affected Asset *</Label>
          <Select value={form.assetId} onValueChange={(v) => setForm({ ...form, assetId: v })}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select asset..." /></SelectTrigger>
            <SelectContent className="max-h-72">
              {assets.map((a) => <SelectItem key={a.id} value={a.id}>{a.name} ({a.tag})</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Affected Quantity</Label>
            <Input
              type="number"
              min={1}
              value={form.affectedQty}
              onChange={(e) => setForm({ ...form, affectedQty: Number(e.target.value) })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Severity</Label>
            <Select value={form.severity} onValueChange={(v: Severity) => setForm({ ...form, severity: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{severities.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date of Fault</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label>Fault Description *</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1.5"
            rows={4}
            placeholder="Describe what's wrong, where it happened, and any troubleshooting tried..."
          />
        </div>
        <div>
          <Label>Supporting Image (optional)</Label>
          <label className="mt-1.5 flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors">
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => router.push("/app/faults")}>Cancel</Button>
          <Button type="submit" className="bg-gradient-primary hover:opacity-90">
            <AlertTriangle className="w-4 h-4 mr-1.5" /> Submit Report
          </Button>
        </div>
      </form>
    </div>
  );
}