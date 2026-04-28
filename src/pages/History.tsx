// src/pages/History.tsx
"use client";
import { useStore } from "@/store/useStore";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Search, History as HistoryIcon, Plus, Pencil, AlertTriangle, Wrench, X } from "lucide-react";

export default function History() {
  const { auditLogs, assets, departments } = useStore();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [dept, setDept] = useState("all");

  const assetDept = (assetId?: string) => {
    const a = assets.find((x) => x.id === assetId);
    return a ? a.departmentId : "";
  };

  const filtered = useMemo(() => auditLogs.filter((l) =>
    (search === "" || l.assetName.toLowerCase().includes(search.toLowerCase()) || l.changedBy.toLowerCase().includes(search.toLowerCase())) &&
    (type === "all" || l.changeType === type) &&
    (dept === "all" || assetDept(l.assetId) === dept),
  ), [auditLogs, search, type, dept]);

  const iconFor = (t: string) => {
    if (t === "Added") return { icon: Plus, color: "text-success bg-success/10" };
    if (t === "Edited") return { icon: Pencil, color: "text-warning bg-warning/10" };
    if (t === "Fault Reported") return { icon: AlertTriangle, color: "text-destructive bg-destructive/10" };
    if (t === "Repaired") return { icon: Wrench, color: "text-info bg-info/10" };
    return { icon: X, color: "text-muted-foreground bg-muted" };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">History & Audit Log</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} entries · every change is tracked.</p>
      </div>

      <div className="card-elevated p-4 grid md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search asset or staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All change types</SelectItem>
            {["Added", "Edited", "Fault Reported", "Repaired", "Decommissioned"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="card-elevated p-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <HistoryIcon className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No audit entries match your filters.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((log, i) => {
              const { icon: Icon, color } = iconFor(log.changeType);
              return (
                <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${Math.min(i * 20, 400)}ms` }}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{log.assetName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{log.changeType}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {log.oldValue && <><span className="line-through">{log.oldValue}</span> → </>}
                      <span className="text-foreground">{log.newValue}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      by <span className="font-medium text-foreground">{log.changedBy}</span> · {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
