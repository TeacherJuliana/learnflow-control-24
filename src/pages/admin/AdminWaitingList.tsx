import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Clock, Search, Plus, Filter, UserPlus } from "lucide-react";
import { useState, useMemo } from "react";

interface WaitingStudent {
  id: number;
  name: string;
  referral: string;
  referralSource: string;
  location: string;
  contact: string;
  contactType: "Telefone" | "Instagram";
  modality: "VIP" | "Turma" | "Kids";
  level: string;
  availability: string;
  goal: "Trabalho" | "Viagem" | "Outros";
  quotedPrice: string;
  observation: string;
  status: "Esperando" | "Ativo" | "Desistiu";
  createdAt: string;
}

const INITIAL_LIST: WaitingStudent[] = [
  {
    id: 1, name: "Fernanda Oliveira", referral: "João Santos", referralSource: "Indicação de aluno",
    location: "São Paulo - SP", contact: "@fernanda.oli", contactType: "Instagram",
    modality: "VIP", level: "A1 - Iniciante", availability: "Seg e Qua 19h-20h",
    goal: "Trabalho", quotedPrice: "R$ 280/mês", observation: "Trabalha em multinacional, precisa urgente",
    status: "Esperando", createdAt: "2024-06-01",
  },
  {
    id: 2, name: "Bruno Martins", referral: "Ana Costa", referralSource: "Indicação de aluno",
    location: "Rio de Janeiro - RJ", contact: "(21) 99999-1234", contactType: "Telefone",
    modality: "Turma", level: "A2 - Básico", availability: "Ter e Qui 18h-19h, Sáb 10h-11h",
    goal: "Viagem", quotedPrice: "R$ 200/mês", observation: "Viagem marcada para dezembro",
    status: "Esperando", createdAt: "2024-06-10",
  },
  {
    id: 3, name: "Sofia Lima", referral: "Mãe - Patrícia Lima", referralSource: "Instagram",
    location: "Belo Horizonte - MG", contact: "@sofia.lima", contactType: "Instagram",
    modality: "Kids", level: "Starter", availability: "Seg a Sex 14h-15h",
    goal: "Outros", quotedPrice: "R$ 250/mês", observation: "Criança de 8 anos, mãe quer começar o quanto antes",
    status: "Ativo", createdAt: "2024-05-20",
  },
  {
    id: 4, name: "Ricardo Alves", referral: "-", referralSource: "Google",
    location: "Curitiba - PR", contact: "(41) 98888-5678", contactType: "Telefone",
    modality: "VIP", level: "B1 - Intermediário", availability: "Seg 7h-8h ou Qua 7h-8h",
    goal: "Trabalho", quotedPrice: "R$ 320/mês", observation: "Horário premium, valor diferenciado",
    status: "Esperando", createdAt: "2024-06-15",
  },
];

const EMPTY_FORM: Omit<WaitingStudent, "id" | "createdAt"> = {
  name: "", referral: "", referralSource: "", location: "", contact: "",
  contactType: "Telefone", modality: "VIP", level: "", availability: "",
  goal: "Trabalho", quotedPrice: "", observation: "", status: "Esperando",
};

const AdminWaitingList = () => {
  const [list, setList] = useState<WaitingStudent[]>(INITIAL_LIST);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalityFilter, setModalityFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(() => {
    return list.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contact.toLowerCase().includes(search.toLowerCase()) ||
        s.referral.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesModality = modalityFilter === "all" || s.modality === modalityFilter;
      return matchesSearch && matchesStatus && matchesModality;
    });
  }, [list, search, statusFilter, modalityFilter]);

  const hasFilters = search || statusFilter !== "all" || modalityFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setModalityFilter("all");
  };

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (student: WaitingStudent) => {
    const { id, createdAt, ...rest } = student;
    setForm(rest);
    setEditingId(id);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId !== null) {
      setList((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s))
      );
    } else {
      setList((prev) => [
        ...prev,
        { ...form, id: Date.now(), createdAt: new Date().toISOString().split("T")[0] },
      ]);
    }
    setDialogOpen(false);
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const statusColor = (status: string) => {
    if (status === "Ativo") return "default" as const;
    if (status === "Desistiu") return "destructive" as const;
    return "secondary" as const;
  };

  const waitingCount = list.filter((s) => s.status === "Esperando").length;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Lista de Espera</h1>
          <p className="page-subtitle">
            {waitingCount} aguardando · {list.length} total
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" />
          Novo Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, contato ou indicação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Esperando">Esperando</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Desistiu">Desistiu</SelectItem>
          </SelectContent>
        </Select>
        <Select value={modalityFilter} onValueChange={setModalityFilter}>
          <SelectTrigger className="w-full md:w-[140px]">
            <SelectValue placeholder="Modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
            <SelectItem value="Turma">Turma</SelectItem>
            <SelectItem value="Kids">Kids</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <Filter className="w-4 h-4" />
            Limpar
          </Button>
        )}
      </div>

      {hasFilters && (
        <p className="text-xs text-muted-foreground mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Indicação</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Contato</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Modalidade</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Nível</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden xl:table-cell">Objetivo</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden xl:table-cell">Valor</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => openEdit(s)}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="p-3">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.location}</p>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <p className="text-sm">{s.referral}</p>
                    <p className="text-xs text-muted-foreground">{s.referralSource}</p>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    <p className="text-sm">{s.contact}</p>
                    <p className="text-xs text-muted-foreground">{s.contactType}</p>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{s.modality}</Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    <Badge variant="secondary" className="text-xs">{s.level}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs hidden xl:table-cell">{s.goal}</td>
                  <td className="p-3 text-sm hidden xl:table-cell font-medium">{s.quotedPrice}</td>
                  <td className="p-3">
                    <Badge variant={statusColor(s.status)} className="text-xs">{s.status}</Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhum lead encontrado</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Lead" : "Novo Lead"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome do aluno *</Label>
              <Input value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Nome completo" />
            </div>
            <div className="space-y-2">
              <Label>Quem indicou</Label>
              <Input value={form.referral} onChange={(e) => updateForm("referral", e.target.value)} placeholder="Nome de quem indicou" />
            </div>
            <div className="space-y-2">
              <Label>Origem da indicação</Label>
              <Select value={form.referralSource} onValueChange={(v) => updateForm("referralSource", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Indicação de aluno">Indicação de aluno</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cidade / Local</Label>
              <Input value={form.location} onChange={(e) => updateForm("location", e.target.value)} placeholder="São Paulo - SP" />
            </div>
            <div className="space-y-2">
              <Label>Contato</Label>
              <Input value={form.contact} onChange={(e) => updateForm("contact", e.target.value)} placeholder="Telefone ou @instagram" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de contato</Label>
              <Select value={form.contactType} onValueChange={(v) => updateForm("contactType", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Telefone">Telefone</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Modalidade</Label>
              <Select value={form.modality} onValueChange={(v) => updateForm("modality", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Turma">Turma</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nível</Label>
              <Select value={form.level} onValueChange={(v) => updateForm("level", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="A1 - Iniciante">A1 - Iniciante</SelectItem>
                  <SelectItem value="A2 - Básico">A2 - Básico</SelectItem>
                  <SelectItem value="B1 - Intermediário">B1 - Intermediário</SelectItem>
                  <SelectItem value="B2 - Pré-avançado">B2 - Pré-avançado</SelectItem>
                  <SelectItem value="C1 - Avançado">C1 - Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Disponibilidade</Label>
              <Input value={form.availability} onChange={(e) => updateForm("availability", e.target.value)} placeholder="Ex: Seg e Qua 19h-20h, Sáb 10h" />
            </div>
            <div className="space-y-2">
              <Label>Objetivo</Label>
              <Select value={form.goal} onValueChange={(v) => updateForm("goal", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trabalho">Trabalho</SelectItem>
                  <SelectItem value="Viagem">Viagem</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor passado</Label>
              <Input value={form.quotedPrice} onChange={(e) => updateForm("quotedPrice", e.target.value)} placeholder="R$ 280/mês" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Observação</Label>
              <Textarea value={form.observation} onChange={(e) => updateForm("observation", e.target.value)} placeholder="Notas sobre o lead..." rows={3} />
            </div>
            {editingId && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => updateForm("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Esperando">Esperando</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Desistiu">Desistiu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editingId ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminWaitingList;
