import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, BookOpen, Calendar, Search, User, Users, X,
} from "lucide-react";
import { useMemo, useState } from "react";

type StudentType = "vip" | "kids" | "group";

interface TeacherStudent {
  id: number;
  name: string;
  type: StudentType;
  stage: string;
  nextLesson?: string;
  packageTotal: number;
  packageUsed: number;
  history: { date: string; topic: string; status: "present" | "absent" | "cancelled" }[];
  notes: string;
}

interface TeacherGroup {
  id: number;
  name: string;
  type: "group";
  stage: string;
  nextLesson?: string;
  students: { id: number; name: string }[];
  history: { date: string; topic: string }[];
}

type ListItem = (TeacherStudent & { kind: "student" }) | (TeacherGroup & { kind: "group" });

const MOCK_STUDENTS: TeacherStudent[] = [
  { id: 1, name: "João Santos", type: "vip", stage: "B1", nextLesson: "07/04 · 18:00", packageTotal: 8, packageUsed: 6, history: [
    { date: "29/03", topic: "Unit 4 — Past Simple Review", status: "present" },
    { date: "26/03", topic: "Irregular Verbs Practice", status: "absent" },
    { date: "22/03", topic: "Unit 4 — Speaking Drill", status: "present" },
  ], notes: "Foco em conversação para entrevistas. Progresso constante." },
  { id: 2, name: "Ana Costa", type: "vip", stage: "A2", nextLesson: "08/04 · 10:30", packageTotal: 8, packageUsed: 3, history: [
    { date: "01/04", topic: "Comparatives", status: "present" },
    { date: "25/03", topic: "Superlatives", status: "present" },
  ], notes: "Aluna dedicada, boa evolução na leitura." },
  { id: 3, name: "Mariana Souza", type: "kids", stage: "A1", nextLesson: "09/04 · 15:30", packageTotal: 4, packageUsed: 2, history: [
    { date: "02/04", topic: "Animals & Colors", status: "present" },
    { date: "26/03", topic: "Numbers 1-20", status: "present" },
  ], notes: "Muito participativa, gosta de atividades com imagens." },
  { id: 4, name: "Lucas Ferreira", type: "kids", stage: "A1", nextLesson: "09/04 · 15:30", packageTotal: 4, packageUsed: 1, history: [
    { date: "02/04", topic: "Animals & Colors", status: "absent" },
  ], notes: "Precisa de mais estímulo com jogos." },
];

const MOCK_GROUPS: TeacherGroup[] = [
  { id: 101, name: "Brooklyn99", type: "group", stage: "B1", nextLesson: "09/04 · 14:00", students: [
    { id: 3, name: "Pedro Lima" }, { id: 4, name: "Camila Rocha" }, { id: 5, name: "Rafael Mendes" }, { id: 6, name: "Julia Almeida" },
  ], history: [
    { date: "02/04", topic: "Group Conversation — Travel" },
    { date: "26/03", topic: "Debate — Technology" },
  ] },
  { id: 102, name: "Kids Explorers", type: "group", stage: "A1", nextLesson: "10/04 · 16:00", students: [
    { id: 7, name: "Mariana Souza" }, { id: 8, name: "Lucas Ferreira" }, { id: 9, name: "Sofia Oliveira" },
  ], history: [
    { date: "03/04", topic: "Kids Group — Animals" },
    { date: "27/03", topic: "Kids Group — Family" },
  ] },
];

const TYPE_CONFIG: Record<StudentType, { label: string; color: string }> = {
  vip: { label: "VIP", color: "bg-primary/10 text-primary" },
  kids: { label: "Kids", color: "bg-accent text-accent-foreground" },
  group: { label: "Grupo", color: "bg-secondary text-secondary-foreground" },
};

const TeacherStudents = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<ListItem | null>(null);

  const items: ListItem[] = useMemo(() => {
    const students: ListItem[] = MOCK_STUDENTS.map((s) => ({ ...s, kind: "student" as const }));
    const groups: ListItem[] = MOCK_GROUPS.map((g) => ({ ...g, kind: "group" as const }));
    let all = [...students, ...groups];

    if (typeFilter !== "all") {
      all = all.filter((item) => item.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      all = all.filter((item) => item.name.toLowerCase().includes(q));
    }
    return all;
  }, [search, typeFilter]);

  // Detail view
  if (selected) {
    return (
      <DashboardLayout>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{selected.name}</h1>
              <Badge className={`text-xs ${TYPE_CONFIG[selected.type].color}`}>
                {TYPE_CONFIG[selected.type].label}
              </Badge>
              <Badge variant="secondary">{selected.stage}</Badge>
            </div>
          </div>
        </div>

        {selected.kind === "student" ? (
          <StudentDetail student={selected} />
        ) : (
          <GroupDetail group={selected} />
        )}
      </DashboardLayout>
    );
  }

  // List view
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-header">Alunos & Turmas</h1>
        <p className="page-subtitle">Visão completa de todos os seus alunos e grupos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="kids">Kids</SelectItem>
            <SelectItem value="group">Grupo</SelectItem>
          </SelectContent>
        </Select>
        {(search || typeFilter !== "all") && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setTypeFilter("all"); }}>
            <X className="w-3.5 h-3.5 mr-1" /> Limpar
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-3">{items.length} resultado(s)</p>

      {/* List */}
      <div className="space-y-2">
        {items.map((item) => {
          const isGroup = item.kind === "group";
          return (
            <button
              key={`${item.kind}-${item.id}`}
              onClick={() => setSelected(item)}
              className="flex items-center gap-4 w-full text-left p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                {isGroup ? <Users className="w-4 h-4 text-muted-foreground" /> : <User className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.name}</p>
                {isGroup && (
                  <p className="text-xs text-muted-foreground">{(item as TeacherGroup & { kind: "group" }).students.length} alunos</p>
                )}
              </div>
              <Badge className={`text-xs ${TYPE_CONFIG[item.type].color}`}>
                {TYPE_CONFIG[item.type].label}
              </Badge>
              <Badge variant="secondary" className="text-xs">{item.stage}</Badge>
              {item.nextLesson && (
                <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.nextLesson}
                </span>
              )}
              {!isGroup && (
                <span className="text-xs text-muted-foreground hidden md:inline">
                  {(item as TeacherStudent & { kind: "student" }).packageUsed}/{(item as TeacherStudent & { kind: "student" }).packageTotal} aulas
                </span>
              )}
            </button>
          );
        })}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">Nenhum resultado encontrado.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

/* ---- Student Detail ---- */
const StudentDetail = ({ student }: { student: TeacherStudent & { kind: "student" } }) => {
  const remaining = student.packageTotal - student.packageUsed;
  const progress = Math.round((student.packageUsed / student.packageTotal) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        {/* Progress */}
        <div className="p-5 rounded-lg border bg-card">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Progresso do Pacote
          </h2>
          <div className="flex items-center gap-4 mb-2">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm font-medium">{student.packageUsed}/{student.packageTotal}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {remaining} aula{remaining !== 1 ? "s" : ""} restante{remaining !== 1 ? "s" : ""}
            {remaining <= 1 && <span className="text-destructive ml-1">· Renovação necessária</span>}
          </p>
        </div>

        {/* Lesson History */}
        <div className="p-5 rounded-lg border bg-card">
          <h2 className="text-sm font-semibold mb-3">Histórico de Aulas</h2>
          <div className="space-y-2">
            {student.history.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm">{h.topic}</p>
                  <p className="text-xs text-muted-foreground">{h.date}</p>
                </div>
                <Badge
                  variant={h.status === "present" ? "default" : h.status === "absent" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {h.status === "present" ? "Presente" : h.status === "absent" ? "Ausente" : "Cancelada"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-5">
        <div className="p-5 rounded-lg border bg-card">
          <h2 className="text-sm font-semibold mb-3">Notas do Professor</h2>
          <p className="text-sm text-muted-foreground">{student.notes}</p>
        </div>
        {student.nextLesson && (
          <div className="p-5 rounded-lg border bg-card">
            <h2 className="text-sm font-semibold mb-2">Próxima Aula</h2>
            <p className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {student.nextLesson}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---- Group Detail ---- */
const GroupDetail = ({ group }: { group: TeacherGroup & { kind: "group" } }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-5">
      {/* Students in group */}
      <div className="p-5 rounded-lg border bg-card">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" /> Alunos da Turma ({group.students.length})
        </h2>
        <div className="space-y-2">
          {group.students.map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-2 border-b last:border-0">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                {s.name.charAt(0)}
              </div>
              <p className="text-sm">{s.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Group History */}
      <div className="p-5 rounded-lg border bg-card">
        <h2 className="text-sm font-semibold mb-3">Histórico de Aulas</h2>
        <div className="space-y-2">
          {group.history.map((h, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="text-sm">{h.topic}</p>
                <p className="text-xs text-muted-foreground">{h.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {group.nextLesson && (
      <div className="space-y-5">
        <div className="p-5 rounded-lg border bg-card">
          <h2 className="text-sm font-semibold mb-2">Próxima Aula</h2>
          <p className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            {group.nextLesson}
          </p>
        </div>
      </div>
    )}
  </div>
);

export default TeacherStudents;
