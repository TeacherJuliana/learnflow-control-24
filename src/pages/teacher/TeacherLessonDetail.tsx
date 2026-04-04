import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Users, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type AttendanceStatus = "present" | "absent" | "cancelled";
type LessonType = "vip" | "group";

interface StudentAttendance {
  id: number;
  name: string;
  status: AttendanceStatus;
}

interface LessonData {
  id: number;
  time: string;
  date: string;
  topic: string;
  stage: string;
  type: LessonType;
  students: { id: number; name: string }[];
}

const MOCK_LESSONS: Record<string, LessonData> = {
  "1": {
    id: 1, time: "09:00", date: "Segunda", topic: "Present Perfect", stage: "B1",
    type: "vip", students: [{ id: 1, name: "João Santos" }],
  },
  "2": {
    id: 2, time: "10:30", date: "Segunda", topic: "Comparatives", stage: "A2",
    type: "vip", students: [{ id: 2, name: "Ana Costa" }],
  },
  "3": {
    id: 3, time: "14:00", date: "Quarta", topic: "Group Conversation", stage: "B1",
    type: "group",
    students: [
      { id: 3, name: "Pedro Lima" },
      { id: 4, name: "Camila Rocha" },
      { id: 5, name: "Rafael Mendes" },
      { id: 6, name: "Julia Almeida" },
    ],
  },
  "4": {
    id: 4, time: "15:30", date: "Quinta", topic: "Kids Group — Animals", stage: "A1",
    type: "group",
    students: [
      { id: 7, name: "Mariana Souza" },
      { id: 8, name: "Lucas Ferreira" },
      { id: 9, name: "Sofia Oliveira" },
    ],
  },
};

const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string; variant: "default" | "destructive" | "secondary" }[] = [
  { value: "present", label: "Presente", variant: "default" },
  { value: "absent", label: "Ausente", variant: "destructive" },
  { value: "cancelled", label: "Cancelada", variant: "secondary" },
];

const TeacherLessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = MOCK_LESSONS[lessonId || "1"];

  const [lastPage, setLastPage] = useState("");
  const [reading, setReading] = useState("");
  const [dictation, setDictation] = useState("");
  const [extra, setExtra] = useState("");
  const [saved, setSaved] = useState(false);

  // VIP: single attendance; Group: per-student
  const [vipAttendance, setVipAttendance] = useState<AttendanceStatus>("present");
  const [groupAttendance, setGroupAttendance] = useState<StudentAttendance[]>(
    lesson?.students.map((s) => ({ ...s, status: "present" as AttendanceStatus })) || []
  );

  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center text-muted-foreground">
          <p>Aula não encontrada.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const updateGroupAttendance = (studentId: number, status: AttendanceStatus) => {
    setGroupAttendance((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isGroup = lesson.type === "group";

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{lesson.topic}</h1>
            <Badge variant="secondary">{lesson.stage}</Badge>
            <Badge variant="outline" className="gap-1 text-xs">
              {isGroup ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {isGroup ? "Grupo" : "VIP"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {lesson.date} · {lesson.time}
            {isGroup && ` · ${lesson.students.length} alunos`}
            {!isGroup && ` · ${lesson.students[0].name}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lesson Content Fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-5 rounded-lg border bg-card">
            <h2 className="text-sm font-semibold mb-4">Registro da Aula</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Última Página / Conteúdo</label>
                <Input
                  placeholder="Ex: p. 42-45, Unit 5"
                  value={lastPage}
                  onChange={(e) => setLastPage(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Reading</label>
                <Input
                  placeholder="Ex: Text p. 38, Article 3"
                  value={reading}
                  onChange={(e) => setReading(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium block mb-1.5">Dictation</label>
              <Input
                placeholder="Ex: 10 words — Unit 5 vocabulary"
                value={dictation}
                onChange={(e) => setDictation(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">
                Extra <span className="text-muted-foreground font-normal">(notas detalhadas)</span>
              </label>
              <Textarea
                placeholder="Material adicional, atividades extras, explicações, observações sobre desempenho..."
                className="min-h-[140px]"
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right: Attendance */}
        <div className="space-y-5">
          <div className="p-5 rounded-lg border bg-card">
            <h2 className="text-sm font-semibold mb-4">
              {isGroup ? "Presença por Aluno" : "Presença"}
            </h2>

            {isGroup ? (
              <div className="space-y-3">
                {groupAttendance.map((student) => (
                  <div key={student.id} className="p-3 rounded-md border bg-background">
                    <p className="text-sm font-medium mb-2">{student.name}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {ATTENDANCE_OPTIONS.map((opt) => (
                        <Button
                          key={opt.value}
                          size="sm"
                          variant={student.status === opt.value ? opt.variant : "outline"}
                          className="text-xs h-7"
                          onClick={() => updateGroupAttendance(student.id, opt.value)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-sm mb-2">{lesson.students[0].name}</p>
                <div className="flex gap-2">
                  {ATTENDANCE_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      size="sm"
                      variant={vipAttendance === opt.value ? opt.variant : "outline"}
                      onClick={() => setVipAttendance(opt.value)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {vipAttendance === "present" && "Desconta 1 aula do pacote"}
                  {vipAttendance === "absent" && "Falta sem aviso — desconta 1 aula do pacote"}
                  {vipAttendance === "cancelled" && "Cancelamento com aviso — não desconta do pacote"}
                </p>
              </div>
            )}
          </div>

          {/* Save button */}
          <Button className="w-full gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            {saved ? "Salvo ✓" : "Salvar Registro"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherLessonDetail;
