import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { Users, DollarSign, BookOpen, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RECENT_STUDENTS = [
  { id: 1, name: "João Santos", teacher: "Prof. Maria", stage: "B1", status: "Ativo", modality: "Online", pending: false },
  { id: 2, name: "Ana Costa", teacher: "Prof. Maria", stage: "A2", status: "Ativo", modality: "Presencial", pending: true },
  { id: 3, name: "Pedro Lima", teacher: "Prof. Carlos", stage: "B2", status: "Ativo", modality: "Online", pending: false },
  { id: 4, name: "Mariana Souza", teacher: "Prof. Maria", stage: "A1", status: "Inativo", modality: "Online", pending: true },
  { id: 5, name: "Lucas Ferreira", teacher: "Prof. Carlos", stage: "C1", status: "Ativo", modality: "Presencial", pending: false },
];

const REVENUE_DATA = [
  { month: "Jan", value: "R$4.200" },
  { month: "Fev", value: "R$4.550" },
  { month: "Mar", value: "R$4.900" },
];

const AdminDashboard = () => (
  <DashboardLayout>
    <div className="mb-8">
      <h1 className="page-header">Dashboard</h1>
      <p className="page-subtitle">Visão geral da sua escola</p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Alunos ativos" value={18} icon={<Users className="w-4 h-4" />} trend="+2" trendUp />
      <StatCard label="Receita mensal" value="R$4.9k" icon={<DollarSign className="w-4 h-4" />} trend="+7.6%" trendUp />
      <StatCard label="Aulas este mês" value={72} icon={<BookOpen className="w-4 h-4" />} />
      <StatCard label="Frequência geral" value="91%" icon={<TrendingUp className="w-4 h-4" />} trend="-1%" trendUp={false} />
    </div>

    {/* Payments pending alert */}
    <div className="flex items-center gap-3 p-4 rounded-lg border border-warning/30 bg-warning/5 mb-8">
      <AlertCircle className="w-5 h-5 text-warning shrink-0" />
      <div>
        <p className="text-sm font-medium">2 pagamentos pendentes</p>
        <p className="text-xs text-muted-foreground">Ana Costa e Mariana Souza possuem faturas em aberto</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {/* Students table */}
      <div className="md:col-span-2">
        <h2 className="text-base font-semibold mb-4">Alunos</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Teacher</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Stage</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Pgto</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_STUDENTS.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground md:hidden">{s.teacher}</p>
                  </td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{s.teacher}</td>
                  <td className="p-3"><Badge variant="secondary" className="text-xs">{s.stage}</Badge></td>
                  <td className="p-3">
                    <Badge variant={s.status === "Ativo" ? "default" : "secondary"} className="text-xs">
                      {s.status}
                    </Badge>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {s.pending ? (
                      <Badge variant="destructive" className="text-xs">Pendente</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Em dia</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue summary */}
      <div>
        <h2 className="text-base font-semibold mb-4">Receita Recente</h2>
        <div className="space-y-3">
          {REVENUE_DATA.map((r) => (
            <div key={r.month} className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <span className="text-sm text-muted-foreground">{r.month}</span>
              <span className="font-semibold text-sm">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminDashboard;
