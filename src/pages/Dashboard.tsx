"use client";

import { useStore } from "@/store/useStore";
import {
  Package,
  AlertTriangle,
  Wrench,
  Building2,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertOctagon,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useMemo } from "react";
import { formatNaira, conditionColor, StatusBadge } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

const COLORS = [
  "hsl(142 71% 45%)",
  "hsl(38 92% 50%)",
  "hsl(0 84% 60%)",
  "hsl(215 16% 47%)",
];
const ACCENT = "hsl(217 91% 60%)";

export default function DashboardPage() {
  const { currentUser, assets, departments, faultReports, auditLogs } =
    useStore();
  const isSenate = currentUser?.role === "senate";

  const stats = useMemo(() => {
    const total = assets.reduce((s, a) => s + a.totalQty, 0);
    const faulty = assets.reduce((s, a) => s + a.faultyQty, 0);
    const repair = assets
      .filter((a) => a.condition === "Fair")
      .reduce((s, a) => s + a.totalQty, 0);
    const value = assets.reduce((s, a) => s + a.value * a.totalQty, 0);
    return {
      total,
      faulty,
      repair,
      value,
      deps: departments.length,
      pending: faultReports.filter((f) => f.status === "Open").length,
    };
  }, [assets, departments, faultReports]);

  const byDept = useMemo(
    () =>
      departments.map((d) => {
        const da = assets.filter((a) => a.departmentId === d.id);
        const total = da.reduce((s, a) => s + a.totalQty, 0);
        const faulty = da.reduce((s, a) => s + a.faultyQty, 0);
        const good = total - faulty;
        return {
          name: d.code,
          fullName: d.name,
          total,
          faulty,
          good,
          health: total ? Math.round((good / total) * 100) : 100,
          faultRate: total ? Math.round((faulty / total) * 100) : 0,
        };
      }),
    [departments, assets]
  );

  const conditionMix = useMemo(() => {
    const acc = { Good: 0, Fair: 0, Faulty: 0, Decommissioned: 0 };
    assets.forEach((a) => {
      acc.Good += a.goodQty;
      acc.Faulty += a.faultyQty;
      if (a.condition === "Fair") acc.Fair += Math.floor(a.goodQty * 0.3);
    });
    return Object.entries(acc)
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0);
  }, [assets]);

  const monthlyFaults = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString("en", { month: "short" });
      months[key] = 0;
    }
    faultReports.forEach((f) => {
      const d = new Date(f.date);
      const key = d.toLocaleDateString("en", { month: "short" });
      if (key in months) months[key]++;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [faultReports]);

  const monthlyAssets = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months[d.toLocaleDateString("en", { month: "short" })] = 0;
    }
    assets.forEach((a) => {
      const key = new Date(a.createdAt).toLocaleDateString("en", {
        month: "short",
      });
      if (key in months) months[key] += a.totalQty;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [assets]);

  const criticalDepts = byDept.filter((d) => d.faultRate > 30);

  const kpis = isSenate
    ? [
        {
          label: "Institution Assets",
          value: stats.total.toLocaleString(),
          icon: Package,
          trend: "+12%",
          color: "from-blue-500 to-cyan-500",
        },
        {
          label: "Total Faulty",
          value: stats.faulty.toLocaleString(),
          icon: AlertTriangle,
          trend: "-3%",
          color: "from-red-500 to-rose-500",
        },
        {
          label: "Departments",
          value: stats.deps.toString(),
          icon: Building2,
          trend: "0",
          color: "from-violet-500 to-purple-500",
        },
        {
          label: "Pending Reports",
          value: stats.pending.toString(),
          icon: AlertOctagon,
          trend: "+2",
          color: "from-amber-500 to-orange-500",
        },
      ]
    : [
        {
          label: "Total Assets",
          value: stats.total.toLocaleString(),
          icon: Package,
          trend: "+12%",
          color: "from-blue-500 to-cyan-500",
        },
        {
          label: "Faulty Assets",
          value: stats.faulty.toLocaleString(),
          icon: AlertTriangle,
          trend: "-3%",
          color: "from-red-500 to-rose-500",
        },
        {
          label: "Under Repair",
          value: stats.repair.toLocaleString(),
          icon: Wrench,
          trend: "+5",
          color: "from-amber-500 to-orange-500",
        },
        {
          label: "Departments",
          value: stats.deps.toString(),
          icon: Building2,
          trend: "0",
          color: "from-violet-500 to-purple-500",
        },
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSenate ? "Senate Overview" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isSenate
              ? "Institution-wide visibility across all departments."
              : `Welcome back, ${currentUser?.name?.split(" ")[0]}. Here's what's happening.`}
          </p>
        </div>
        {isSenate && (
          <Button
            onClick={() => toast.success("Report exported (mock)")}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-1.5" /> Export Report
          </Button>
        )}
      </div>

      {/* Critical alert banner */}
      {isSenate && criticalDepts.length > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3 animate-fade-in">
          <AlertOctagon className="w-5 h-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-destructive">
              Critical fault rate detected
            </div>
            <div className="text-sm text-muted-foreground">
              {criticalDepts.map((d) => d.fullName).join(", ")}{" "}
              {criticalDepts.length === 1 ? "has" : "have"} more than 30%
              faulty assets.
            </div>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="card-elevated p-5 relative overflow-hidden">
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${k.color} opacity-10`}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${k.color} flex items-center justify-center text-white shadow-md`}
                >
                  <k.icon className="w-5 h-5" />
                </div>
                <StatusBadge className="bg-muted text-muted-foreground border-border text-[10px]">
                  {k.trend.startsWith("-") ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3" />
                  )}
                  {k.trend}
                </StatusBadge>
              </div>
              <div className="text-2xl font-bold tracking-tight">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card-elevated p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">
                {isSenate
                  ? "Asset health per department"
                  : "Assets per department"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Total assets grouped by department
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byDept} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="good"
                stackId="a"
                fill={ACCENT}
                name="Good"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="faulty"
                stackId="a"
                fill="hsl(0 84% 60%)"
                name="Faulty"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-elevated p-5">
          <div className="mb-4">
            <h3 className="font-semibold">Condition breakdown</h3>
            <p className="text-xs text-muted-foreground">Across all assets</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={conditionMix}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {conditionMix.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {conditionMix.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-semibold">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Line chart + activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card-elevated p-5 lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold">
              {isSenate
                ? "Monthly asset registrations"
                : "Fault reports — last 6 months"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isSenate
                ? "Growth in tracked inventory"
                : "Trend of newly reported faults"}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={isSenate ? monthlyAssets : monthlyFaults}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={ACCENT}
                strokeWidth={3}
                dot={{ fill: ACCENT, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent activity</h3>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
            {auditLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    log.changeType === "Added"
                      ? "bg-success"
                      : log.changeType === "Fault Reported"
                      ? "bg-destructive"
                      : "bg-warning"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{log.assetName}</div>
                  <div className="text-xs text-muted-foreground">
                    {log.changeType} ·{" "}
                    {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Department comparison table */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">
              {isSenate ? "Department comparison" : "Departments quick view"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isSenate
                ? "Sortable by health score"
                : "All departments at a glance"}
            </p>
          </div>
          {/* ✅ next/link instead of react-router-dom Link */}
          <Link
            href="/app/departments"
            className="text-xs text-accent font-medium hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b">
              <tr>
                <th className="text-left font-medium pb-3">Department</th>
                <th className="text-left font-medium pb-3">Code</th>
                <th className="text-right font-medium pb-3">Assets</th>
                <th className="text-right font-medium pb-3">Faults</th>
                <th className="text-right font-medium pb-3">Health</th>
                <th className="text-right font-medium pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {byDept.map((d) => (
                <tr
                  key={d.name}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 font-medium">{d.fullName}</td>
                  <td className="py-3 text-muted-foreground">{d.name}</td>
                  <td className="py-3 text-right">{d.total.toLocaleString()}</td>
                  <td className="py-3 text-right">{d.faulty}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full ${
                            d.health > 90
                              ? "bg-success"
                              : d.health > 70
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${d.health}%` }}
                        />
                      </div>
                      <span className="font-semibold w-9 text-right">
                        {d.health}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <StatusBadge
                      className={conditionColor(
                        d.faultRate > 30
                          ? "Faulty"
                          : d.faultRate > 10
                          ? "Fair"
                          : "Good"
                      )}
                    >
                      {d.faultRate > 30
                        ? "Critical"
                        : d.faultRate > 10
                        ? "Watch"
                        : "Healthy"}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}