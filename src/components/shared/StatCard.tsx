import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ label, value, icon, trend, trendUp }: StatCardProps) => (
  <div className="stat-card">
    <div className="flex items-center justify-between mb-3">
      <span className="text-muted-foreground">{icon}</span>
      {trend && (
        <span className={`text-xs font-medium ${trendUp ? "text-success" : "text-destructive"}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-semibold tracking-tight">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </div>
);

export default StatCard;
