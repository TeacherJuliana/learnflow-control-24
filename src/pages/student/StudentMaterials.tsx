import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Search, BookOpen, Headphones, Video, File } from "lucide-react";
import { useState, useMemo } from "react";

type MaterialType = "reading" | "audio" | "video" | "worksheet";

interface Material {
  id: number;
  title: string;
  type: MaterialType;
  stage: string;
  topic: string;
  date: string;
  size: string;
}

const MATERIALS: Material[] = [
  { id: 1, title: "Present Perfect - Text", type: "reading", stage: "B1", topic: "Present Perfect", date: "2024-03-20", size: "2.4 MB" },
  { id: 2, title: "Comparatives Worksheet", type: "worksheet", stage: "A2", topic: "Comparatives", date: "2024-03-18", size: "1.1 MB" },
  { id: 3, title: "Listening - Daily Routines", type: "audio", stage: "A2", topic: "Daily Routines", date: "2024-03-15", size: "5.8 MB" },
  { id: 4, title: "Conditionals Explained", type: "video", stage: "B2", topic: "Conditionals", date: "2024-03-12", size: "45 MB" },
  { id: 5, title: "Vocabulary - Travel", type: "reading", stage: "B1", topic: "Vocabulary", date: "2024-03-10", size: "1.8 MB" },
  { id: 6, title: "Grammar Exercises - Unit 5", type: "worksheet", stage: "B1", topic: "Mixed Grammar", date: "2024-03-08", size: "890 KB" },
  { id: 7, title: "Pronunciation Guide", type: "audio", stage: "A2", topic: "Pronunciation", date: "2024-03-05", size: "3.2 MB" },
  { id: 8, title: "Speaking Practice - Interviews", type: "video", stage: "B1", topic: "Speaking", date: "2024-03-01", size: "62 MB" },
];

const TYPE_CONFIG: Record<MaterialType, { label: string; icon: React.ElementType; color: string }> = {
  reading: { label: "Reading", icon: BookOpen, color: "bg-primary/10 text-primary" },
  audio: { label: "Áudio", icon: Headphones, color: "bg-success/10 text-success" },
  video: { label: "Vídeo", icon: Video, color: "bg-warning/10 text-warning" },
  worksheet: { label: "Exercício", icon: File, color: "bg-destructive/10 text-destructive" },
};

const StudentMaterials = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(() => {
    return MATERIALS.filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.topic.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "all" || m.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [search, activeTab]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-header">Materiais</h1>
        <p className="page-subtitle">Seus recursos de estudo organizados</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="audio">Áudio</TabsTrigger>
          <TabsTrigger value="video">Vídeo</TabsTrigger>
          <TabsTrigger value="worksheet">Exercícios</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Materials grid */}
      <div className="grid gap-3">
        {filtered.map((material) => {
          const config = TYPE_CONFIG[material.type];
          const Icon = config.icon;
          return (
            <div
              key={material.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{material.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{material.topic}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(material.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">{material.stage}</Badge>
              <span className="text-xs text-muted-foreground hidden sm:block w-16 text-right">{material.size}</span>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum material encontrado</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentMaterials;
