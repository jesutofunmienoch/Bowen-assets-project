// Mock data store for the School Asset Management System.
// Persists everything to localStorage. Easy to swap to a real backend later.

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "college" | "senate";
export type Condition = "Good" | "Fair" | "Faulty" | "Decommissioned";
export type Severity = "Low" | "Medium" | "High" | "Critical";
export type Category = "Furniture" | "Electronics" | "Lab Equipment" | "Books" | "Vehicles" | "Other";

export interface User {
  id: string;
  name: string;
  staffId: string;
  email: string;
  role: Role;
  departmentId?: string;
  avatarUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  description: string;
}

export interface Asset {
  id: string;
  name: string;
  category: Category;
  tag: string;
  departmentId: string;
  totalQty: number;
  goodQty: number;
  faultyQty: number;
  condition: Condition;
  purchaseDate: string;
  value: number;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface FaultReport {
  id: string;
  assetId: string;
  reportedBy: string;
  affectedQty: number;
  description: string;
  severity: Severity;
  date: string;
  imageUrl?: string;
  status: "Open" | "Under Repair" | "Resolved";
}

export interface AuditLog {
  id: string;
  assetId?: string;
  assetName: string;
  changeType: "Added" | "Edited" | "Fault Reported" | "Repaired" | "Decommissioned";
  oldValue?: string;
  newValue?: string;
  changedBy: string;
  timestamp: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  departments: Department[];
  assets: Asset[];
  faultReports: FaultReport[];
  auditLogs: AuditLog[];
  seeded: boolean;

  // auth
  signUp: (data: Omit<User, "id">) => User;
  login: (email: string, role: Role) => User | null;
  logout: () => void;

  // departments
  addDepartment: (d: Omit<Department, "id">) => void;
  updateDepartment: (id: string, d: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // assets
  addAsset: (a: Omit<Asset, "id" | "createdAt" | "goodQty" | "faultyQty">) => void;
  updateAsset: (id: string, a: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  // faults
  addFaultReport: (f: Omit<FaultReport, "id" | "status">) => void;

  seed: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

const seedData = () => {
  const departments: Department[] = [
    { id: "d1", name: "Computer Science", code: "CSC", hod: "Prof. Adewale Johnson", description: "Department of Computer Science and Software Engineering" },
    { id: "d2", name: "Electrical Engineering", code: "EEE", hod: "Dr. Funmi Okafor", description: "Power systems, electronics and telecommunications" },
    { id: "d3", name: "Mechanical Engineering", code: "MEE", hod: "Prof. Tunde Bello", description: "Thermodynamics, manufacturing and design" },
    { id: "d4", name: "Biological Sciences", code: "BIO", hod: "Dr. Ngozi Eze", description: "Biology, microbiology and biochemistry labs" },
    { id: "d5", name: "Library & Resources", code: "LIB", hod: "Mrs. Aisha Bello", description: "Central library and reading rooms" },
    { id: "d6", name: "Administration", code: "ADM", hod: "Mr. Chike Nnamdi", description: "Registry, finance and administrative offices" },
  ];

  const cats: Category[] = ["Furniture", "Electronics", "Lab Equipment", "Books", "Vehicles", "Other"];
  const sample: Array<[string, Category, string, number, number, Condition, number]> = [
    ["Dell OptiPlex Desktops", "Electronics", "d1", 60, 8, "Good", 250000],
    ["Programming Textbooks", "Books", "d1", 200, 0, "Good", 8500],
    ["Cisco Network Switches", "Electronics", "d1", 12, 2, "Fair", 180000],
    ["Lecture Hall Chairs", "Furniture", "d1", 150, 12, "Good", 12000],
    ["Oscilloscopes", "Lab Equipment", "d2", 25, 5, "Fair", 320000],
    ["Soldering Stations", "Lab Equipment", "d2", 30, 3, "Good", 45000],
    ["Power Generators", "Electronics", "d2", 4, 1, "Faulty", 850000],
    ["Lab Workbenches", "Furniture", "d2", 40, 0, "Good", 95000],
    ["CNC Milling Machine", "Lab Equipment", "d3", 3, 0, "Good", 4500000],
    ["Engine Test Rigs", "Lab Equipment", "d3", 8, 2, "Fair", 1200000],
    ["Workshop Tool Sets", "Other", "d3", 50, 6, "Good", 35000],
    ["Microscopes", "Lab Equipment", "d4", 45, 4, "Good", 180000],
    ["Centrifuges", "Lab Equipment", "d4", 12, 3, "Faulty", 420000],
    ["Lab Stools", "Furniture", "d4", 80, 5, "Good", 8500],
    ["Reference Books Collection", "Books", "d5", 5400, 0, "Good", 4500],
    ["Library Reading Tables", "Furniture", "d5", 60, 2, "Good", 28000],
    ["Self-Checkout Terminals", "Electronics", "d5", 6, 1, "Fair", 380000],
    ["Office Desktops", "Electronics", "d6", 35, 4, "Good", 220000],
    ["Filing Cabinets", "Furniture", "d6", 45, 0, "Good", 32000],
    ["Toyota Hiace Bus", "Vehicles", "d6", 3, 1, "Fair", 18500000],
    ["Office Printers", "Electronics", "d6", 18, 5, "Faulty", 95000],
    ["Air Conditioners", "Electronics", "d1", 25, 4, "Fair", 220000],
  ];

  const assets: Asset[] = sample.map(([name, cat, dep, total, faulty, cond, val], i) => ({
    id: `a${i + 1}`,
    name,
    category: cat,
    tag: `${departments.find(d => d.id === dep)?.code}-${String(i + 1).padStart(4, "0")}`,
    departmentId: dep,
    totalQty: total,
    goodQty: total - faulty,
    faultyQty: faulty,
    condition: cond,
    purchaseDate: new Date(Date.now() - (i * 45 + 30) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    value: val,
    description: "",
    createdAt: new Date(Date.now() - (i * 5) * 24 * 60 * 60 * 1000).toISOString(),
  }));

  // faults across last 6 months
  const faults: FaultReport[] = [];
  const audit: AuditLog[] = [];
  let fId = 1;
  assets.forEach((a) => {
    if (a.faultyQty > 0) {
      const date = new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000);
      const sev: Severity = a.faultyQty > 5 ? "High" : a.faultyQty > 2 ? "Medium" : "Low";
      faults.push({
        id: `f${fId++}`,
        assetId: a.id,
        reportedBy: "Dr. Sample Staff",
        affectedQty: a.faultyQty,
        description: `Reported faulty units of ${a.name}. Requires inspection and possible replacement.`,
        severity: sev,
        date: date.toISOString().slice(0, 10),
        status: "Open",
      });
      audit.push({
        id: uid(),
        assetId: a.id,
        assetName: a.name,
        changeType: "Fault Reported",
        oldValue: `${a.totalQty} good`,
        newValue: `${a.faultyQty} faulty`,
        changedBy: "Dr. Sample Staff",
        timestamp: date.toISOString(),
      });
    }
    audit.push({
      id: uid(),
      assetId: a.id,
      assetName: a.name,
      changeType: "Added",
      newValue: `${a.totalQty} units`,
      changedBy: "System Seed",
      timestamp: a.createdAt,
    });
  });

  return { departments, assets, faultReports: faults, auditLogs: audit.sort((a, b) => b.timestamp.localeCompare(a.timestamp)) };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      departments: [],
      assets: [],
      faultReports: [],
      auditLogs: [],
      seeded: false,

      signUp: (data) => {
        const user: User = { ...data, id: uid() };
        set((s) => ({ users: [...s.users, user], currentUser: user }));
        return user;
      },
      login: (email, role) => {
        const existing = get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          const updated = { ...existing, role };
          set((s) => ({ currentUser: updated, users: s.users.map((u) => (u.id === existing.id ? updated : u)) }));
          return updated;
        }
        // demo login: synthesize a user
        const demo: User = {
          id: uid(),
          name: role === "senate" ? "Senate Demo Officer" : "College Demo Staff",
          staffId: role === "senate" ? "SEN-001" : "COL-001",
          email,
          role,
        };
        set((s) => ({ currentUser: demo, users: [...s.users, demo] }));
        return demo;
      },
      logout: () => set({ currentUser: null }),

      addDepartment: (d) => {
        const dept = { ...d, id: uid() };
        set((s) => ({ departments: [...s.departments, dept] }));
      },
      updateDepartment: (id, d) =>
        set((s) => ({ departments: s.departments.map((x) => (x.id === id ? { ...x, ...d } : x)) })),
      deleteDepartment: (id) =>
        set((s) => ({ departments: s.departments.filter((x) => x.id !== id) })),

      addAsset: (a) => {
        const asset: Asset = {
          ...a,
          id: uid(),
          goodQty: a.totalQty,
          faultyQty: 0,
          createdAt: now(),
        };
        const log: AuditLog = {
          id: uid(),
          assetId: asset.id,
          assetName: asset.name,
          changeType: "Added",
          newValue: `${asset.totalQty} units`,
          changedBy: get().currentUser?.name || "Unknown",
          timestamp: now(),
        };
        set((s) => ({ assets: [asset, ...s.assets], auditLogs: [log, ...s.auditLogs] }));
      },
      updateAsset: (id, a) => {
        const old = get().assets.find((x) => x.id === id);
        if (!old) return;
        const updated = { ...old, ...a };
        const log: AuditLog = {
          id: uid(),
          assetId: id,
          assetName: updated.name,
          changeType: "Edited",
          oldValue: JSON.stringify({ qty: old.totalQty, condition: old.condition }),
          newValue: JSON.stringify({ qty: updated.totalQty, condition: updated.condition }),
          changedBy: get().currentUser?.name || "Unknown",
          timestamp: now(),
        };
        set((s) => ({ assets: s.assets.map((x) => (x.id === id ? updated : x)), auditLogs: [log, ...s.auditLogs] }));
      },
      deleteAsset: (id) => set((s) => ({ assets: s.assets.filter((x) => x.id !== id) })),

      addFaultReport: (f) => {
        const report: FaultReport = { ...f, id: uid(), status: "Open" };
        const asset = get().assets.find((a) => a.id === f.assetId);
        if (asset) {
          const newFaulty = Math.min(asset.totalQty, asset.faultyQty + f.affectedQty);
          const newGood = Math.max(0, asset.totalQty - newFaulty);
          const newCondition: Condition = newFaulty / asset.totalQty > 0.3 ? "Faulty" : asset.condition;
          set((s) => ({
            assets: s.assets.map((a) =>
              a.id === f.assetId ? { ...a, faultyQty: newFaulty, goodQty: newGood, condition: newCondition } : a,
            ),
          }));
        }
        const log: AuditLog = {
          id: uid(),
          assetId: f.assetId,
          assetName: asset?.name || "Unknown",
          changeType: "Fault Reported",
          newValue: `${f.affectedQty} affected (${f.severity})`,
          changedBy: get().currentUser?.name || f.reportedBy,
          timestamp: now(),
        };
        set((s) => ({ faultReports: [report, ...s.faultReports], auditLogs: [log, ...s.auditLogs] }));
      },

      seed: () => {
        if (get().seeded) return;
        const data = seedData();
        set({ ...data, seeded: true });
      },
    }),
    { name: "sams-store" },
  ),
);
