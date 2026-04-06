import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Search, BookOpen, Headphones, Video, File, Image, ExternalLink, ChevronLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { STUDENT_MATERIALS, MATERIAL_STAGES, type MaterialType, type MaterialStage, getUpcomingClasses } from "@/data/studentPortal";

const TYPE_CONFIG: Record<MaterialType, { label: string; icon: React.ElementType; color: string }> = {
  reading: { label: "Reading", icon: BookOpen, color: "bg-primary/10 text-primary" },
  audio: { label: "Áudio", icon: Headphones, color: "bg-success/10 text-success" },
  video: { label: "Vídeo", icon: Video, color: "bg-warning/10 text-warning" },
  worksheet: { label: "Exercício", icon: File, color: "bg-destructive/10 text-destructive" },
  image: { label: "Imagem", icon: Image, color: "bg-primary/10 text-primary" },
  external: { label: "Material Externo", icon: ExternalLink, color: "bg-accent text-accent-foreground" },
};

const STAGE_EMOJI: Record<string, string> = {
  "Stage 1": "🌱", "Stage 2": "🌿", "Stage 3": "🍀", "Stage 4": "🌳",
  "Stage 5": "⭐", "Stage 6": "🔥", "Stage 7": "🚀", "Stage 8": "💎",
  "Stage 9": "🏆", "Stage 10": "👑", "Stage 11": "🎯", "Stage 12": "🎓",
  "Extra": "📦",
};

const StudentMaterials = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStage, setSelectedStage] = useState<MaterialStage | null>(null);
  const nextClass = getUpcomingClasses()[0];

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MATERIAL_STAGES.forEach((s) => {
      counts[s] = STUDENT_MATERIALS.filter((m) => m.stage === s).length;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    return STUDENT_MATERIALS.filter((m) => {
      const matchesStage = selectedStage ? m.stage === selectedStage : true;
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.topic.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "all" || m.type === activeTab;
      return matchesStage && matchesSearch && matchesTab;
    });
  }, [search, activeTab, selectedStage]);

  // Stage selection view
  if (!selectedStage) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="page-header">Materiais</h1>
          <p className="page-subtitle">Selecione seu stage para encontrar os materiais</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Biblioteca</p>
            <p className="text-2xl font-semibold mt-2">{STUDENT_MATERIALS.length} itens</p>
            <p className="text-sm text-muted-foreground mt-1">Organizados em {MATERIAL_STAGES.length} stages</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Próxima aula</p>
            <p className="text-base font-semibold mt-2">{nextClass?.topic ?? "Sem aula agendada"}</p>
            <p className="text-sm text-muted-foreground mt-1">Use os materiais para chegar preparado.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIAL_STAGES.map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className="flex items-center gap-4 p-5 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all text-left group"
            >
              <span className="text-2xl">{STAGE_EMOJI[stage] ?? "📘"}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm group-hover:text-primary transition-colors">{stage}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stageCounts[stage]} {stageCounts[stage] === 1 ? "material" : "materiais"}
                </p>
              </div>
              <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  // Materials list for selected stage
  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => { setSelectedStage(null); setSearch(""); setActiveTab("all"); }} className="mb-3 -ml-2 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4 mr-1" /> Todos os stages
        </Button>
        <h1 className="page-header flex items-center gap-3">
          <span className="text-2xl">{STAGE_EMOJI[selectedStage] ?? "📘"}</span>
          {selectedStage}
        </h1>
        <p className="page-subtitle">{filtered.length} materiais disponíveis</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar material..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Type tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="audio">Áudio</TabsTrigger>
          <TabsTrigger value="video">Vídeo</TabsTrigger>
          <TabsTrigger value="worksheet">Exercícios</TabsTrigger>
          <TabsTrigger value="image">Imagens</TabsTrigger>
          <TabsTrigger value="external">Externos</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Materials list */}
      <div className="grid gap-3">
        {filtered.map((material) => {
          const config = TYPE_CONFIG[material.type];
          const Icon = config.icon;
          return (
            <div key={material.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{material.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{material.topic}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{new Date(material.date).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">{config.label}</Badge>
              <span className="text-xs text-muted-foreground hidden sm:block w-16 text-right">{material.size}</span>
              {material.type === "external" && material.url ? (
                <Button size="sm" variant="ghost" aria-label={`Abrir ${material.title}`} onClick={() => window.open(material.url, "_blank")}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              ) : (
                <Button size="sm" variant="ghost" aria-label={`Baixar ${material.title}`}>
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum material encontrado neste stage</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentMaterials;
