import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays, CheckCircle2, CircleOff, CreditCard, Video,
} from "lucide-react";
import {
  formatDateTime,
  getAbsenceClassCount,
  getBillableClassCount,
  getCancelledClassCount,
  getRemainingClasses,
  getStatusLabel,
  getUpcomingClasses,
  getClassHistory,
} from "@/data/studentPortal";

const StudentClasses = () => {
  const upcomingClasses = getUpcomingClasses();
  const history = getClassHistory();
  

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-header">Aulas</h1>
        <p className="page-subtitle">Agenda, histórico e regras de desconto do seu pacote.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Próximas aulas" value={upcomingClasses.length} icon={<CalendarDays className="w-4 h-4" />} />
        <StatCard label="Aulas cobradas" value={getBillableClassCount()} icon={<CreditCard className="w-4 h-4" />} />
        <StatCard label="Faltas" value={getAbsenceClassCount()} icon={<CircleOff className="w-4 h-4" />} />
        <StatCard label="Canceladas" value={getCancelledClassCount()} icon={<CheckCircle2 className="w-4 h-4" />} />
      </div>

      <div className="mb-8">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Próximas aulas</h2>
            <Badge variant="secondary">Saldo atual: {getRemainingClasses()}</Badge>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="rounded-lg border bg-background p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{classItem.topic}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDateTime(classItem.startsAt)} · {classItem.teacher} · {classItem.meetingLabel}
                  </p>
                </div>
                <Button className="gap-2" onClick={() => window.open(classItem.meetingUrl, "_blank")}>
                  <Video className="w-4 h-4" />
                  Entrar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold mb-4">Histórico</h2>
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
              {history.map((classItem) => {
                const variant = classItem.status === "present" ? "default" : classItem.status === "absence" ? "destructive" : "secondary";

                return (
                  <tr key={classItem.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3">{formatDateTime(classItem.startsAt)}</td>
                    <td className="p-3 font-medium">{classItem.topic}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{classItem.teacher}</td>
                    <td className="p-3">
                      <Badge variant={variant} className="text-xs">{getStatusLabel(classItem.status)}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentClasses;