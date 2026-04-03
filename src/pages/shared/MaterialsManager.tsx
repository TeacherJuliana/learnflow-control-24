import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText, Download, Search, BookOpen, Headphones, Video, File, Image,
  ExternalLink, Plus, Upload, Trash2, X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { type MaterialType, type StudentMaterial } from "@/data/studentPortal";

const TYPE_CONFIG: Record<MaterialType, { label: string; icon: React.ElementType; color: string }> = {
  reading: { label: "Reading", icon: BookOpen, color: "bg-primary/10 text-primary" },
  audio: { label: "Áudio", icon: Headphones, color: "bg-success/10 text-success" },
  video: { label: "Vídeo", icon: Video, color: "bg-warning/10 text-warning" },
  worksheet: { label: "Exercício", icon: File, color: "bg-destructive/10 text-destructive" },
  image: { label: "Imagem", icon: Image, color: "bg-primary/10 text-primary" },
  external: { label: "Material Externo", icon: ExternalLink, color: "bg-accent text-accent-foreground" },
};

const MOCK_STUDENTS = [
  { id: 1, name: "João Santos" },
  { id: 2, name: "Ana Costa" },
  { id: 3, name: "Pedro Lima" },
  { id: 4, name: "Mariana Souza" },
  { id: 5, name: "Lucas Ferreira" },
];

const INITIAL_MATERIALS: StudentMaterial[] = [
  { id: 1, title: "Present Perfect - Text", type: "reading", stage: "B1", topic: "Present Perfect", date: "2026-03-20", size: "2.4 MB" },
  { id: 2, title: "Comparatives Worksheet", type: "worksheet", stage: "A2", topic: "Comparatives", date: "2026-03-18", size: "1.1 MB" },
  { id: 3, title: "Listening - Daily Routines", type: "audio", stage: "A2", topic: "Daily Routines", date: "2026-03-15", size: "5.8 MB" },
  { id: 4, title: "Conditionals Explained", type: "video", stage: "B2", topic: "Conditionals", date: "2026-03-12", size: "45 MB" },
  { id: 5, title: "Flashcards - Animals", type: "image", stage: "A2", topic: "Vocabulary", date: "2026-03-22", size: "4.1 MB" },
  { id: 6, title: "Notebook LM - Unit 5 Review", type: "external", stage: "B1", topic: "Mixed Grammar", date: "2026-03-25", size: "—", url: "https://notebooklm.google.com/example" },
];

type FormData = {
  title: string;
  type: MaterialType;
  stage: string;
  topic: string;
  url: string;
  studentId: string;
};

const EMPTY_FORM: FormData = { title: "", type: "reading", stage: "", topic: "", url: "", studentId: "all" };

const MaterialsManager = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [materials, setMaterials] = useState<StudentMaterial[]>(INITIAL_MATERIALS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.topic.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "all" || m.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [search, activeTab, materials]);

  const handleAdd = () => {
    if (!form.title.trim() || !form.stage.trim() || !form.topic.trim()) return;
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
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-header">Gerenciar Materiais</h1>
          <p className="page-subtitle">Adicione, edite e organize os materiais dos alunos</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Novo Material
        </Button>
      </div>

      {/* Add material modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="bg-card rounded-xl border shadow-lg w-full max-w-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">Novo Material</h3>
              <Button size="icon" variant="ghost" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Título *</label>
                <Input
                  placeholder="Ex: Present Perfect - Text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Tipo *</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value as MaterialType)}
                  >
                    {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Stage *</label>
                  <Input
                    placeholder="Ex: B1"
                    value={form.stage}
                    onChange={(e) => updateField("stage", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">Tópico *</label>
                <Input
                  placeholder="Ex: Present Perfect"
                  value={form.topic}
                  onChange={(e) => updateField("topic", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">Aluno</label>
                <select
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                  value={form.studentId}
                  onChange={(e) => updateField("studentId", e.target.value)}
                >
                  <option value="all">Todos os alunos</option>
                  {MOCK_STUDENTS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {form.type === "external" ? (
                <div>
                  <label className="text-sm font-medium block mb-1.5">Link externo (Notebook LM) *</label>
                  <Input
                    placeholder="https://notebooklm.google.com/..."
                    value={form.url}
                    onChange={(e) => updateField("url", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">O aluno verá um botão para abrir o link em nova aba.</p>
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

            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleAdd}
                disabled={!form.title.trim() || !form.stage.trim() || !form.topic.trim() || (form.type === "external" && !form.url.trim())}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar material..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Tabs */}
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
                  <span className="text-xs text-muted-foreground">
                    {new Date(material.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">{material.stage}</Badge>
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
            <p className="text-sm">Nenhum material encontrado</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MaterialsManager;
