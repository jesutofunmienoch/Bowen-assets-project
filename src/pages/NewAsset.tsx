"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore, Category, Condition } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ArrowLeft, Upload, Package } from "lucide-react";
import { toast } from "sonner";

const categories: Category[] = ["Furniture", "Electronics", "Lab Equipment", "Books", "Vehicles", "Other"];
const conditions: Condition[] = ["Good", "Fair", "Faulty", "Decommissioned"];

export default function NewAsset() {
  const router = useRouter();
  const { departments, addAsset } = useStore();
  const [form, setForm] = useState({
    name: "", category: "Electronics" as Category, tag: "", departmentId: "",
    totalQty: 1, condition: "Good" as Condition,
    purchaseDate: new Date().toISOString().slice(0, 10),
    value: 0, description: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.tag || !form.departmentId) return toast.error("Fill all required fields");
    addAsset({
      name: form.name, category: form.category, tag: form.tag,
      departmentId: form.departmentId, totalQty: Number(form.totalQty),
      condition: form.condition, purchaseDate: form.purchaseDate,
      value: Number(form.value), description: form.description,
    });
    toast.success("Asset registered successfully");
    router.push("/app/assets");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/app/assets">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to assets
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Register New Asset</h1>
        <p className="text-muted-foreground mt-1">Add equipment, furniture or any tracked resource.</p>
      </div>

      <form onSubmit={submit} className="card-elevated p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Asset Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1.5"
              placeholder="e.g. Dell Latitude Laptops"
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v: Category) => setForm({ ...form, category: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Asset Tag / Serial *</Label>
            <Input
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="mt-1.5"
              placeholder="CSC-2024-0142"
            />
          </div>
          <div>
            <Label>Department *</Label>
            <Select value={form.departmentId} onValueChange={(v) => setForm({ ...form, departmentId: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min={1}
              value={form.totalQty}
              onChange={(e) => setForm({ ...form, totalQty: Number(e.target.value) })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Condition</Label>
            <Select value={form.condition} onValueChange={(v: Condition) => setForm({ ...form, condition: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Purchase Date</Label>
            <Input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Estimated Value (₦)</Label>
            <Input
              type="number"
              min={0}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              className="mt-1.5"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Description / Notes</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1.5"
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Asset Image (optional)</Label>
            <label className="mt-1.5 flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload an image</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => router.push("/app/assets")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gradient-primary hover:opacity-90">
            <Package className="w-4 h-4 mr-1.5" /> Register Asset
          </Button>
        </div>
      </form>
    </div>
  );
}