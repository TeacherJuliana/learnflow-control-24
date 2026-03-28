import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { BookOpen, Clock, Trophy, CreditCard, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UPCOMING_CLASS = {
  teacher: "Prof. Maria Silva",
  date: "Hoje, 15:00",
  topic: "Unit 5 — Present Perfect",
  link: "#",
};

const RECENT_CLASSES = [
  { id: 1, date: "25 Mar", topic: "Unit 4 — Past Simple", teacher: "Prof. Maria", status: "Presente" },
  { id: 2, date: "22 Mar", topic: "Unit 4 — Irregular Verbs", teacher: "Prof. Maria", status: "Presente" },
  { id: 3, date: "20 Mar", topic: "Unit 3 — Review", teacher: "Prof. Maria", status: "Cancelada" },
];

const StudentDashboard = () => (
  <DashboardLayout>
    <div className="mb-8">
      <h1 className="page-header">Olá, João 👋</h1>
      <p className="page-subtitle">Aqui está o resumo das suas aulas</p>
    </div>

    {/* Next class card */}
    <div className="rounded-lg border bg-card p-6 mb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Próxima Aula</p>
          <h2 className="text-lg font-semibold">{UPCOMING_CLASS.topic}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {UPCOMING_CLASS.teacher} · {UPCOMING_CLASS.date}
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Video className="w-4 h-4" />
          Entrar na Aula
        </Button>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Aulas restantes" value="3/8" icon={<BookOpen className="w-4 h-4" />} />
      <StatCard label="Frequência" value="92%" icon={<Clock className="w-4 h-4" />} trend="+3%" trendUp />
      <StatCard label="Stage" value="B1" icon={<Trophy className="w-4 h-4" />} />
      <StatCard label="Pacote" value="R$680" icon={<CreditCard className="w-4 h-4" />} />
    </div>

    {/* Recent classes */}
    <div>
      <h2 className="text-base font-semibold mb-4">Histórico de Aulas</h2>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Tópico</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Teacher</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_CLASSES.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3">{c.date}</td>
                <td className="p-3 font-medium">{c.topic}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{c.teacher}</td>
                <td className="p-3">
                  <Badge variant={c.status === "Presente" ? "default" : c.status === "Cancelada" ? "secondary" : "destructive"} className="text-xs">
                    {c.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

export default StudentDashboard;
