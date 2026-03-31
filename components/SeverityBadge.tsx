import { AlertTriangle, AlertCircle, Info, Skull } from "lucide-react";

type Severity = "low" | "medium" | "high" | "nuclear";

const severityConfig: Record<Severity, { label: string, color: string, icon: any }> = {
  low: {
    label: "Safe",
    color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    icon: Info,
  },
  medium: {
    label: "Careful",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    icon: AlertCircle,
  },
  high: {
    label: "Risky",
    color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    icon: AlertTriangle,
  },
  nuclear: {
    label: "DANGER",
    color: "bg-red-100 text-red-700 border-red-200 animate-pulse dark:bg-red-900/40 dark:text-red-400 dark:border-red-800",
    icon: Skull,
  },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon size={14} />
      {config.label.toUpperCase()}
    </span>
  );
}
