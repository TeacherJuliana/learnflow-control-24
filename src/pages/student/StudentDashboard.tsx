import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge"; 
import { BookOpen, Bell, CreditCard, Video, Package } from "lucide-react";
import {
  STUDENT_PROFILE,
  formatCurrency,
  formatDateTime,
  getActivePackage,
  getRemainingClasses,
  getStatusLabel,
  getUnreadNoticesCount,
  getUpcomingClasses, getClassHistory, getStatusLabel,
} from "@/data/studentPortal";

const StudentDashboard = () => {
  const upcomingClass = getUpcomingClasses()[0];
  const recentClasses = getClassHistory().slice(0, 4);
  const remainingClasses = getRemainingClasses();
  const activePackage = getActivePackage();
  const unreadNotices = getUnreadNoticesCount();

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-header">Olá, {STUDENT_PROFILE.name.split(" ")[0]} 👋</h1>
          <p className="page-subtitle">Seu pacote atual está quase no fim e a próxima aula já está organizada.</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-xs">
          {STUDENT_PROFILE.location} · {STUDENT_PROFILE.timezoneLabel}
        </Badge>
      </div>

      {upcomingClass && (
        <div className="rounded-lg border bg-card p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Próxima aula</p>
              <h2 className="text-lg font-semibold">{upcomingClass.topic}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {upcomingClass.teacher} · {formatDateTime(upcomingClass.startsAt)} · {upcomingClass.meetingLabel}
              </p>
            </div>
            <Button size="lg" className="gap-2" onClick={() => window.open(upcomingClass.meetingUrl, "_blank")}> 
              <Video className="w-4 h-4" />
              Entrar na aula
            </Button>
          </div>
        </div>
      )}

      {remainingClasses <= 1 && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 mb-8">
          <p className="text-sm font-medium text-foreground">Falta {remainingClasses} aula no pacote atual.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Você já pode renovar antecipadamente para não pausar as aulas quando o saldo acabar.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Aulas restantes" value={`${remainingClasses}/${activePackage.classesTotal}`} icon={<BookOpen className="w-4 h-4" />} />
        <StatCard label="Pacote" value={activePackage.label.split("·")[0].trim()} icon={<Package className="w-4 h-4" />} />
        <StatCard label="Avisos não lidos" value={unreadNotices} icon={<Bell className="w-4 h-4" />} />
        <StatCard label="Pacote ativo" value={formatCurrency(activePackage.amount)} icon={<CreditCard className="w-4 h-4" />} />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Histórico recente</h2>
        </div>
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
                {recentClasses.map((classItem) => {
                  const label = getStatusLabel(classItem.status);
                  const variant = classItem.status === "present" ? "default" : classItem.status === "absence" ? "destructive" : "secondary";

                  return (
                    <tr key={classItem.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3">{formatDateTime(classItem.startsAt)}</td>
                      <td className="p-3 font-medium">{classItem.topic}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{classItem.teacher}</td>
                      <td className="p-3">
                        <Badge variant={variant} className="text-xs">{label}</Badge>
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

export default StudentDashboard;
