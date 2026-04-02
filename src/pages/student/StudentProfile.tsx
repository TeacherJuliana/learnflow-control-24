import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock3, Globe, GraduationCap, MessageSquare } from "lucide-react";
import { STUDENT_PROFILE, formatTimeInTimezone } from "@/data/studentPortal";

const StudentProfile = () => {
  const studentTime = formatTimeInTimezone(STUDENT_PROFILE.timezone);
  const teacherTime = formatTimeInTimezone(STUDENT_PROFILE.teacherTimezone);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-header">Perfil</h1>
        <p className="page-subtitle">Informações pessoais, fuso horário e contexto das aulas.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
            <div>
              <h2 className="text-lg font-semibold">{STUDENT_PROFILE.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{STUDENT_PROFILE.email}</p>
            </div>
            <Badge variant="secondary">{STUDENT_PROFILE.stage}</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-background p-4">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium mt-3">Localização</p>
              <p className="text-sm text-muted-foreground mt-1">{STUDENT_PROFILE.location}</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <Clock3 className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium mt-3">Fuso do aluno</p>
              <p className="text-sm text-muted-foreground mt-1">{STUDENT_PROFILE.timezoneLabel}</p>
              <p className="text-xs text-muted-foreground mt-2">Agora: {studentTime}</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium mt-3">Teacher</p>
              <p className="text-sm text-muted-foreground mt-1">{STUDENT_PROFILE.teacher}</p>
              <p className="text-xs text-muted-foreground mt-2">Fuso do teacher: {teacherTime}</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium mt-3">Lembrete padrão</p>
              <p className="text-sm text-muted-foreground mt-1">{STUDENT_PROFILE.reminderPreference}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-5">
            <h2 className="text-base font-semibold mb-3">Resumo pedagógico</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Modalidade:</span> {STUDENT_PROFILE.modality}</p>
              <p><span className="font-medium text-foreground">Objetivo:</span> {STUDENT_PROFILE.goal}</p>
              <p><span className="font-medium text-foreground">Stage atual:</span> {STUDENT_PROFILE.stage}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5">
            <h2 className="text-base font-semibold mb-3">Importante sobre agenda</h2>
            <p className="text-sm text-muted-foreground mb-4">
              O fuso do aluno fica visível para ajudar o time a organizar horários e cobranças corretamente.
            </p>
            <Button variant="secondary">Solicitar atualização cadastral</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;