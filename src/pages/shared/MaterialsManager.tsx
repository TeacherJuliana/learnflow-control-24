import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  FileText, Download, Search, BookOpen, Headphones, Video, File, Image,
  ExternalLink, Plus, Upload, Trash2, ChevronLeft,
} from "lucide-react";
import { useState, useMemo } from "react";
import { MATERIAL_STAGES, type MaterialType, type MaterialStage, type StudentMaterial } from "@/data/studentPortal";

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

const INITIAL_MATERIALS: StudentMaterial[] = [
  { id: 1, title: "Present Perfect - Text", type: "reading", stage: "Stage 5", topic: "Present Perfect", date: "2026-03-20", size: "2.4 MB" },
  { id: 2, title: "Comparatives Worksheet", type: "worksheet", stage: "Stage 2", topic: "Comparatives", date: "2026-03-18", size: "1.1 MB" },
  { id: 3, title: "Listening - Daily Routines", type: "audio", stage: "Stage 2", topic: "Daily Routines", date: "2026-03-15", size: "5.8 MB" },
  { id: 4, title: "Conditionals Explained", type: "video", stage: "Stage 8", topic: "Conditionals", date: "2026-03-12", size: "45 MB" },
  { id: 5, title: "Flashcards - Animals", type: "image", stage: "Stage 1", topic: "Vocabulary", date: "2026-03-22", size: "4.1 MB" },
  { id: 6, title: "Notebook LM - Unit 5 Review", type: "external", stage: "Stage 5", topic: "Mixed Grammar", date: "2026-03-25", size: "—", url: "https://notebooklm.google.com/example" },
  { id: 7, title: "Verb To Be - Exercises", type: "worksheet", stage: "Stage 1", topic: "Verb To Be", date: "2026-03-10", size: "0.8 MB" },
  { id: 8, title: "Past Simple - Reading", type: "reading", stage: "Stage 3", topic: "Past Simple", date: "2026-03-08", size: "1.5 MB" },
  { id: 9, title: "Phrasal Verbs - Advanced", type: "reading", stage: "Stage 10", topic: "Phrasal Verbs", date: "2026-03-05", size: "3.2 MB" },
  { id: 10, title: "Pronunciation Guide", type: "audio", stage: "Extra", topic: "Pronunciation", date: "2026-03-01", size: "8.3 MB" },
];

type FormData = {
  title: string;
  type: MaterialType;
  stage: string;
  topic: string;
  url: string;
};

const EMPTY_FORM: FormData = { title: "", type: "reading", stage: "", topic: "", url: "" };

const MaterialsManager = () => {
  const [materials, setMaterials] = useState<StudentMaterial[]>(INITIAL_MATERIALS);
  const [selectedStage, setSelectedStage] = useState<MaterialStage | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MATERIAL_STAGES.forEach((s) => {
      counts[s] = materials.filter((m) => m.stage === s).length;
    });
    return counts;
  }, [materials]);

  const filtered = useMemo(() =>
    materials.filter((m) => {
      const matchesStage = selectedStage ? m.stage === selectedStage : true;
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.topic.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "all" || m.type === activeTab;
      return matchesStage && matchesSearch && matchesTab;
    }), [search, activeTab, selectedStage, materials]);

  const openNew = () => {
    setForm({ ...EMPTY_FORM, stage: selectedStage ?? "" });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    if (!form.title.trim() || !form.stage || !form.topic.trim()) return;
    const newMaterial: StudentMaterial = {
      id: Date.now(),
      title: form.title,
      type: form.type,
      stage: form.stage,
      topic: form.topic,
      date: new Date().toISOString().split("T")[0],
      size: form.type === "external" ? "—" : "—",
      url: form.type === "external" ? form.url : undefined,
    };
    setMaterials((prev) => [newMaterial, ...prev]);
    setForm(EMPTY_FORM);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  // ── Stage selection view ──
  if (!selectedStage) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-header">Gerenciar Materiais</h1>
            <p className="page-subtitle">Organize os materiais por stage para alunos e professores</p>
          </div>
          <Button onClick={openNew}>
            <Plus className="w-4 h-4" />
            Novo Material
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Biblioteca</p>
            <p className="text-2xl font-semibold mt-2">{materials.length} itens</p>
            <p className="text-sm text-muted-foreground mt-1">Organizados em {MATERIAL_STAGES.length} stages</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Tipos de conteúdo</p>
            <p className="text-2xl font-semibold mt-2">{Object.keys(TYPE_CONFIG).length} tipos</p>
            <p className="text-sm text-muted-foreground mt-1">Reading, Áudio, Vídeo, Exercícios, Imagens, Externos</p>
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

        {/* Add Dialog (from stage selection) */}
        <AddMaterialDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          form={form}
          setForm={setForm}
          onAdd={handleAdd}
        />
      </DashboardLayout>
    );
  }

  // ── Materials list for selected stage ──
  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => { setSelectedStage(null); setSearch(""); setActiveTab("all"); }} className="mb-3 -ml-2 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4 mr-1" /> Todos os stages
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-header flex items-center gap-3">
              <span className="text-2xl">{STAGE_EMOJI[selectedStage] ?? "📘"}</span>
              {selectedStage}
            </h1>
            <p className="page-subtitle">{filtered.length} materiais</p>
          </div>
          <Button onClick={openNew}>
            <Plus className="w-4 h-4" />
            Novo Material
          </Button>
        </div>
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
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label={`Excluir ${material.title}`} onClick={() => handleDelete(material.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
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

      {/* Add Dialog */}
      <AddMaterialDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        setForm={setForm}
        onAdd={handleAdd}
      />
    </DashboardLayout>
  );
};

// ── Shared Add Material Dialog ──
function AddMaterialDialog({
  open, onOpenChange, form, setForm, onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  onAdd: () => void;
}) {
  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Material</DialogTitle>
          <DialogDescription>Adicione um material ao stage selecionado.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Título *</label>
            <Input placeholder="Ex: Present Perfect - Text" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Tipo *</label>
              <Select value={form.type} onValueChange={(v) => updateField("type", v as MaterialType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Stage *</label>
              <Select value={form.stage} onValueChange={(v) => updateField("stage", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {MATERIAL_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>{STAGE_EMOJI[s]} {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Tópico *</label>
            <Input placeholder="Ex: Present Perfect" value={form.topic} onChange={(e) => updateField("topic", e.target.value)} />
          </div>
          {form.type === "external" ? (
            <div>
              <label className="text-sm font-medium block mb-1.5">Link externo (Notebook LM) *</label>
              <Input placeholder="https://notebooklm.google.com/..." value={form.url} onChange={(e) => updateField("url", e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">O aluno verá um botão para abrir em nova aba.</p>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium block mb-1.5">Arquivo</label>
              <div className="flex items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 cursor-pointer hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <Upload className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Arraste ou clique para enviar</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Upload real requer Lovable Cloud</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onAdd} disabled={!form.title.trim() || !form.stage || !form.topic.trim() || (form.type === "external" && !form.url.trim())}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MaterialsManager;
