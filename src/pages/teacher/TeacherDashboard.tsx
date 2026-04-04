import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { Users, Calendar, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const TODAY_CLASSES = [
  { id: 1, time: "09:00", student: "João Santos", stage: "B1", topic: "Present Perfect", done: true },
  { id: 2, time: "10:30", student: "Ana Costa", stage: "A2", topic: "Comparatives", done: false },
  { id: 3, time: "14:00", student: "Pedro Lima", stage: "B2", topic: "Conditionals", done: false },
  { id: 4, time: "15:30", student: "Mariana Souza", stage: "A1", topic: "Introductions", done: false },
];

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-header">Bom dia, Maria 👋</h1>
        <p className="page-subtitle">Sua agenda de hoje — {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Aulas hoje" value={4} icon={<Calendar className="w-4 h-4" />} />
        <StatCard label="Alunos ativos" value={12} icon={<Users className="w-4 h-4" />} />
        <StatCard label="Aulas este mês" value={34} icon={<BookOpen className="w-4 h-4" />} />
        <StatCard label="Frequência geral" value="94%" icon={<CheckCircle className="w-4 h-4" />} trend="+2%" trendUp />
      </div>


      {/* Today schedule */}
      <h2 className="text-base font-semibold mb-4">Agenda do Dia</h2>
      <div className="space-y-3">
        {TODAY_CLASSES.map((cls) => (
          <div key={cls.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <div className="text-center min-w-[50px]">
              <p className="text-sm font-semibold">{cls.time}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{cls.student}</p>
              <p className="text-xs text-muted-foreground">{cls.topic}</p>
            </div>
            <Badge variant="secondary" className="text-xs">{cls.stage}</Badge>
            {cls.done ? (
              <Badge className="text-xs bg-success text-success-foreground">Concluída</Badge>
            ) : (
              <Button size="sm" variant="outline" onClick={() => navigate(`/teacher/lesson/${cls.id}`)}>
                Registrar Aula
              </Button>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
