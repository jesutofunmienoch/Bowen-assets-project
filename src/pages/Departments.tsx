"use client";

import { useState } from "react";
import { useStore, Department } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Building2,
  Pencil,
  Trash2,
  Users,
  Package,
  AlertTriangle,
} from "lucide-react";
import { conditionColor, StatusBadge } from "@/lib/format";
import { toast } from "sonner";

export default function DepartmentsPage() {
  const {
    departments,
    assets,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    currentUser,
  } = useStore();
  const isReadOnly = currentUser?.role === "senate";
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    hod: "",
    description: "",
  });

  const filtered = departments.filter((d) =>
    [d.name, d.code, d.hod].some((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  );

  const openModal = (d?: Department) => {
    if (d) {
      setEditing(d);
      setForm({ name: d.name, code: d.code, hod: d.hod, description: d.description });
    } else {
      setEditing(null);
      setForm({ name: "", code: "", hod: "", description: "" });
    }
    setOpen(true);
  };

  const submit = () => {
    if (!form.name || !form.code) return toast.error("Name and code are required");
    if (editing) {
      updateDepartment(editing.id, form);
      toast.success("Department updated");
    } else {
      addDepartment(form);
      toast.success("Department created");
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-1">
            {departments.length} departments managing institution assets.
          </p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => openModal()}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit" : "New"} Department</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Code</Label>
                    <Input
                      value={form.code}
                      onChange={(e) =>
                        setForm({ ...form, code: e.target.value.toUpperCase() })
                      }
                      className="mt-1.5"
                      placeholder="CSC"
                    />
                  </div>
                </div>
                <div>
                  <Label>Head of Department</Label>
                  <Input
                    value={form.hod}
                    onChange={(e) => setForm({ ...form, hod: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={submit}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {editing ? "Save" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="font-semibold mb-1">No departments found</h3>
          <p className="text-sm text-muted-foreground">
            Try a different search or add a new department.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => {
            const da = assets.filter((a) => a.departmentId === d.id);
            const total = da.reduce((s, a) => s + a.totalQty, 0);
            const faulty = da.reduce((s, a) => s + a.faultyQty, 0);
            const health = total
              ? Math.round(((total - faulty) / total) * 100)
              : 100;
            return (
              <div key={d.id} className="card-elevated p-5 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <StatusBadge
                    className={conditionColor(
                      health > 90 ? "Good" : health > 70 ? "Fair" : "Faulty"
                    )}
                  >
                    {health}% healthy
                  </StatusBadge>
                </div>
                <div className="mb-1 text-xs text-muted-foreground font-mono">
                  {d.code}
                </div>
                <h3 className="font-semibold text-lg leading-tight mb-1">
                  {d.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                  {d.description || "No description"}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                  <Users className="w-3.5 h-3.5" /> {d.hod}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Package className="w-3 h-3" /> Assets
                    </div>
                    <div className="font-semibold">{total.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Faulty
                    </div>
                    <div className="font-semibold text-destructive">{faulty}</div>
                  </div>
                </div>
                {!isReadOnly && (
                  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => openModal(d)}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {d.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove the department permanently.
                            Associated assets will remain but become unassigned.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              deleteDepartment(d.id);
                              toast.success("Department deleted");
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}