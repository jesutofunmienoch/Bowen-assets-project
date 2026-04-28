import { Condition, Severity } from "@/store/useStore";
import { cn } from "@/lib/utils";

export const conditionColor = (c: Condition) => {
  switch (c) {
    case "Good": return "bg-success/10 text-success border-success/30";
    case "Fair": return "bg-warning/10 text-warning border-warning/30";
    case "Faulty": return "bg-destructive/10 text-destructive border-destructive/30";
    case "Decommissioned": return "bg-muted text-muted-foreground border-border";
  }
};

export const severityColor = (s: Severity) => {
  switch (s) {
    case "Low": return "bg-info/10 text-info border-info/30";
    case "Medium": return "bg-warning/10 text-warning border-warning/30";
    case "High": return "bg-orange-500/10 text-orange-600 border-orange-500/30";
    case "Critical": return "bg-destructive/10 text-destructive border-destructive/30";
  }
};

export const StatusBadge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border", className)}>
    {children}
  </span>
);

export const formatNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
