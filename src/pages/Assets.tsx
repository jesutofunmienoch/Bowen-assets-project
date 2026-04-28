"use client";

import { useState, useMemo } from "react";
import { useStore, Asset, Category, Condition } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Search, Eye, AlertTriangle, Package, Calendar, DollarSign, Tag, Building2 } from "lucide-react";
import { conditionColor, StatusBadge, formatNaira } from "@/lib/format";
import { toast } from "sonner";

const categories: Category[] = ["Furniture", "Electronics", "Lab Equipment", "Books", "Vehicles", "Other"];
const conditions: Condition[] = ["Good", "Fair", "Faulty", "Decommissioned"];

export default function Assets() {
  const { assets, departments, auditLogs, deleteAsset } = useStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [cond, setCond] = useState<string>("all");
  const [cat, setCat] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Asset | null>(null);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => assets.filter((a) =>
    (search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.tag.toLowerCase().includes(search.toLowerCase())) &&
    (dept === "all" || a.departmentId === dept) &&
    (cond === "all" || a.condition === cond) &&
    (cat === "all" || a.category === cat),
  ), [assets, search, dept, cond, cat]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const depName = (id: string) => departments.find(d => d.id === id)?.name || "—";
  const assetHistory = selected ? auditLogs.filter((l) => l.assetId === selected.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} of {assets.length} assets</p>
        </div>
        <Button onClick={() => router.push("/app/assets/new")} className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-1.5" /> Register Asset
        </Button>
      </div>

      <div className="card-elevated p-4 grid md:grid-cols-4 gap-3">
        <div className="relative md:col-span-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name or tag..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={dept} onValueChange={(v) => { setDept(v); setPage(1); }}>
          <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={cond} onValueChange={(v) => { setCond(v); setPage(1); }}>
          <SelectTrigger><SelectValue placeholder="Condition" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All conditions</SelectItem>
            {conditions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left font-medium px-4 py-3">Asset</th>
                <th className="text-left font-medium px-4 py-3">Tag</th>
                <th className="text-left font-medium px-4 py-3">Department</th>
                <th className="text-right font-medium px-4 py-3">Qty</th>
                <th className="text-left font-medium px-4 py-3">Condition</th>
                <th className="text-left font-medium px-4 py-3">Added</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Package className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground">No assets match your filters.</p>
                  </td>
                </tr>
              ) : paged.map((a) => (
                <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.category}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{a.tag}</td>
                  <td className="px-4 py-3 text-muted-foreground">{depName(a.departmentId)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold">{a.totalQty}</span>
                    {a.faultyQty > 0 && <span className="text-destructive text-xs ml-1">({a.faultyQty} ✕)</span>}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge className={conditionColor(a.condition)}>{a.condition}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setSelected(a)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => router.push(`/app/faults/new?asset=${a.id}`)}>
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <StatusBadge className={conditionColor(selected.condition)}>{selected.condition}</StatusBadge>
                  <span className="text-xs text-muted-foreground font-mono">{selected.tag}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Package, label: "Total qty", val: selected.totalQty },
                    { icon: AlertTriangle, label: "Faulty", val: selected.faultyQty, danger: true },
                    { icon: Tag, label: "Category", val: selected.category },
                    { icon: Building2, label: "Department", val: depName(selected.departmentId) },
                    { icon: Calendar, label: "Purchased", val: selected.purchaseDate },
                    { icon: DollarSign, label: "Unit value", val: formatNaira(selected.value) },
                  ].map((it) => (
                    <div key={it.label} className="p-3 rounded-lg bg-muted/40">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <it.icon className="w-3 h-3" /> {it.label}
                      </div>
                      <div className={`font-semibold text-sm mt-1 ${it.danger && Number(it.val) > 0 ? "text-destructive" : ""}`}>
                        {it.val}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">History timeline</h4>
                  <div className="space-y-3 border-l-2 border-border pl-4">
                    {assetHistory.length === 0 && <p className="text-xs text-muted-foreground">No history yet.</p>}
                    {assetHistory.map((h) => (
                      <div key={h.id} className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-background" />
                        <div className="text-sm font-medium">{h.changeType}</div>
                        <div className="text-xs text-muted-foreground">{h.changedBy} · {new Date(h.timestamp).toLocaleString()}</div>
                        {h.newValue && <div className="text-xs mt-1">{h.newValue}</div>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => { router.push(`/app/faults/new?asset=${selected.id}`); setSelected(null); }}
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                  >
                    <AlertTriangle className="w-4 h-4 mr-1.5" /> Report Fault
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { deleteAsset(selected.id); toast.success("Asset deleted"); setSelected(null); }}
                    className="text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}