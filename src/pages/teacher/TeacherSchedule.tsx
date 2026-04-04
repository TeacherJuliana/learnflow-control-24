import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Clock, MapPin, Video } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

interface ClassItem {
  id: number;
  time: string;
  duration: string;
  student: string;
  stage: string;
  topic: string;
  modality: "Online" | "Presencial";
  done: boolean;
}

const WEEKLY_SCHEDULE: Record<string, ClassItem[]> = {
  Segunda: [
    { id: 1, time: "09:00", duration: "60min", student: "João Santos", stage: "B1", topic: "Present Perfect", modality: "Online", done: true },
    { id: 2, time: "10:30", duration: "60min", student: "Ana Costa", stage: "A2", topic: "Comparatives", modality: "Presencial", done: false },
    { id: 3, time: "14:00", duration: "45min", student: "Pedro Lima", stage: "B2", topic: "Conditionals", modality: "Online", done: false },
  ],
  Terça: [
    { id: 4, time: "08:00", duration: "60min", student: "Mariana Souza", stage: "A1", topic: "Introductions", modality: "Presencial", done: false },
    { id: 5, time: "11:00", duration: "60min", student: "Lucas Ferreira", stage: "C1", topic: "Advanced Writing", modality: "Online", done: false },
  ],
  Quarta: [
    { id: 6, time: "09:00", duration: "60min", student: "João Santos", stage: "B1", topic: "Past Narratives", modality: "Online", done: false },
    { id: 7, time: "10:30", duration: "45min", student: "Camila Rocha", stage: "B1", topic: "Vocabulary", modality: "Online", done: false },
    { id: 8, time: "14:00", duration: "60min", student: "Rafael Mendes", stage: "A2", topic: "Questions", modality: "Presencial", done: false },
    { id: 9, time: "16:00", duration: "60min", student: "Julia Almeida", stage: "B2", topic: "Reported Speech", modality: "Online", done: false },
  ],
  Quinta: [
    { id: 10, time: "08:00", duration: "60min", student: "Ana Costa", stage: "A2", topic: "Superlatives", modality: "Presencial", done: false },
    { id: 11, time: "10:00", duration: "45min", student: "Pedro Lima", stage: "B2", topic: "Phrasal Verbs", modality: "Online", done: false },
    { id: 12, time: "15:00", duration: "60min", student: "Mariana Souza", stage: "A1", topic: "Numbers & Colors", modality: "Presencial", done: false },
  ],
  Sexta: [
    { id: 13, time: "09:00", duration: "60min", student: "Lucas Ferreira", stage: "C1", topic: "Debate Practice", modality: "Online", done: false },
    { id: 14, time: "11:00", duration: "60min", student: "Camila Rocha", stage: "B1", topic: "Reading Practice", modality: "Online", done: false },
  ],
};

const TeacherSchedule = () => {
  const [view, setView] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState(WEEKDAYS[0]);
  const navigate = useNavigate();

  const todayClasses = WEEKLY_SCHEDULE[selectedDay] || [];
  const totalWeek = Object.values(WEEKLY_SCHEDULE).reduce((sum, d) => sum + d.length, 0);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Agenda</h1>
          <p className="page-subtitle">{totalWeek} aulas esta semana</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "week" | "day")}>
            <TabsList>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="day">Dia</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {view === "week" ? (
        /* Weekly view */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {WEEKDAYS.map((day) => {
            const classes = WEEKLY_SCHEDULE[day] || [];
            return (
              <div key={day} className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">{day}</h3>
                  <span className="text-xs text-muted-foreground">{classes.length} aulas</span>
                </div>
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/teacher/lesson/${cls.id}`)}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-medium">{cls.time}</span>
                      <span className="text-xs text-muted-foreground">({cls.duration})</span>
                    </div>
                    <p className="text-sm font-medium truncate">{cls.student}</p>
                    <p className="text-xs text-muted-foreground truncate">{cls.topic}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{cls.stage}</Badge>
                      {cls.modality === "Online" ? (
                        <Video className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
                {classes.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">Sem aulas</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Day view */
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const idx = WEEKDAYS.indexOf(selectedDay);
                setSelectedDay(WEEKDAYS[Math.max(0, idx - 1)]);
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {WEEKDAYS.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(day)}
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const idx = WEEKDAYS.indexOf(selectedDay);
                setSelectedDay(WEEKDAYS[Math.min(WEEKDAYS.length - 1, idx + 1)]);
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <h2 className="text-base font-semibold mb-4">{selectedDay} — {todayClasses.length} aulas</h2>

          <div className="space-y-3">
            {todayClasses.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-semibold">{cls.time}</p>
                  <p className="text-[10px] text-muted-foreground">{cls.duration}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{cls.student}</p>
                  <p className="text-xs text-muted-foreground">{cls.topic}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{cls.stage}</Badge>
                <Badge variant="outline" className="text-xs gap-1">
                  {cls.modality === "Online" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                  {cls.modality}
                </Badge>
                {cls.done ? (
                  <Badge className="text-xs bg-success text-success-foreground">Concluída</Badge>
                ) : (
                  <Button size="sm" variant="outline">Pós-Aula</Button>
                )}
              </div>
            ))}
            {todayClasses.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <p className="text-sm">Sem aulas neste dia</p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherSchedule;
