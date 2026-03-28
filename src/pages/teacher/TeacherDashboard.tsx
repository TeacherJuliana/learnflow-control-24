import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { Users, Calendar, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const TODAY_CLASSES = [
  { id: 1, time: "09:00", student: "João Santos", stage: "B1", topic: "Present Perfect", done: true },
  { id: 2, time: "10:30", student: "Ana Costa", stage: "A2", topic: "Comparatives", done: false },
  { id: 3, time: "14:00", student: "Pedro Lima", stage: "B2", topic: "Conditionals", done: false },
  { id: 4, time: "15:30", student: "Mariana Souza", stage: "A1", topic: "Introductions", done: false },
];

const TeacherDashboard = () => {
  const [showPostClass, setShowPostClass] = useState(false);
  const [selectedClass, setSelectedClass] = useState<typeof TODAY_CLASSES[0] | null>(null);
  const [postData, setPostData] = useState({ attendance: "present" as "present" | "absent" | "cancelled", page: "", notes: "" });

  const handlePostClass = (cls: typeof TODAY_CLASSES[0]) => {
    setSelectedClass(cls);
    setShowPostClass(true);
    setPostData({ attendance: "present", page: "", notes: "" });
  };

  const handleSave = () => {
    setShowPostClass(false);
    setSelectedClass(null);
  };

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

      {/* Post-class modal */}
      {showPostClass && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="bg-card rounded-xl border shadow-lg w-full max-w-md p-6 mx-4">
            <h3 className="font-semibold text-lg mb-1">Pós-Aula</h3>
            <p className="text-sm text-muted-foreground mb-5">{selectedClass.student} — {selectedClass.topic}</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Presença</label>
                <div className="flex gap-2">
                  <Button size="sm" variant={postData.attendance === "present" ? "default" : "outline"} onClick={() => setPostData(p => ({...p, attendance: "present"}))}>
                    Presente
                  </Button>
                  <Button size="sm" variant={postData.attendance === "absent" ? "destructive" : "outline"} onClick={() => setPostData(p => ({...p, attendance: "absent"}))}>
                    Ausente
                  </Button>
                  <Button size="sm" variant={postData.attendance === "cancelled" ? "secondary" : "outline"} onClick={() => setPostData(p => ({...p, attendance: "cancelled"}))}>
                    Cancelada
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  {postData.attendance === "present" && "Desconta 1 aula do pacote"}
                  {postData.attendance === "absent" && "Falta sem aviso — desconta 1 aula do pacote"}
                  {postData.attendance === "cancelled" && "Cancelamento com aviso — não desconta do pacote"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Página do Reading</label>
                <input
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                  placeholder="Ex: p. 42-45"
                  value={postData.page}
                  onChange={e => setPostData(p => ({...p, page: e.target.value}))}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Observação</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[80px] resize-none"
                  placeholder="Desempenho, dificuldades, próximos passos..."
                  value={postData.notes}
                  onChange={e => setPostData(p => ({...p, notes: e.target.value}))}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowPostClass(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

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
              <Button size="sm" variant="outline" onClick={() => handlePostClass(cls)}>
                Pós-Aula
              </Button>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
