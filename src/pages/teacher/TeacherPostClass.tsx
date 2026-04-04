import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, User, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

type LessonType = "vip" | "group";

interface PendingLesson {
  id: number;
  time: string;
  date: string;
  topic: string;
  stage: string;
  type: LessonType;
  students: string[];
  registered: boolean;
}

const PENDING_LESSONS: PendingLesson[] = [
  { id: 1, time: "09:00", date: "Hoje", topic: "Present Perfect", stage: "B1", type: "vip", students: ["João Santos"], registered: true },
  { id: 2, time: "10:30", date: "Hoje", topic: "Comparatives", stage: "A2", type: "vip", students: ["Ana Costa"], registered: false },
  { id: 3, time: "14:00", date: "Hoje", topic: "Group Conversation", stage: "B1", type: "group", students: ["Pedro Lima", "Camila Rocha", "Rafael Mendes", "Julia Almeida"], registered: false },
  { id: 4, time: "15:30", date: "Ontem", topic: "Kids Group — Animals", stage: "A1", type: "group", students: ["Mariana Souza", "Lucas Ferreira", "Sofia Oliveira"], registered: false },
];

const TeacherPostClass = () => {
  const navigate = useNavigate();
  const pending = PENDING_LESSONS.filter((l) => !l.registered);
  const completed = PENDING_LESSONS.filter((l) => l.registered);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-header">Pós-Aula</h1>
        <p className="page-subtitle">Registre os detalhes das aulas concluídas</p>
      </div>

      {/* Pending registration */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-destructive" />
          Pendentes de Registro ({pending.length})
        </h2>
        <div className="space-y-3">
          {pending.map((lesson) => {
            const isGroup = lesson.type === "group";
            return (
              <div
                key={lesson.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-semibold">{lesson.time}</p>
                  <p className="text-[10px] text-muted-foreground">{lesson.date}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{lesson.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {isGroup
                      ? `${lesson.students.length} alunos`
                      : lesson.students[0]}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">{lesson.stage}</Badge>
                <Badge variant="outline" className="text-xs gap-1">
                  {isGroup ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {isGroup ? "Grupo" : "VIP"}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => navigate(`/teacher/lesson/${lesson.id}`)}
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  Registrar Aula
                </Button>
              </div>
            );
          })}
          {pending.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Todas as aulas foram registradas ✓
            </p>
          )}
        </div>
      </div>

      {/* Already registered */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            Registradas ({completed.length})
          </h2>
          <div className="space-y-3">
            {completed.map((lesson) => {
              const isGroup = lesson.type === "group";
              return (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 opacity-70"
                >
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-semibold">{lesson.time}</p>
                    <p className="text-[10px] text-muted-foreground">{lesson.date}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{lesson.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {isGroup ? `${lesson.students.length} alunos` : lesson.students[0]}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{lesson.stage}</Badge>
                  <Badge className="text-xs bg-success text-success-foreground">Registrada</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherPostClass;
