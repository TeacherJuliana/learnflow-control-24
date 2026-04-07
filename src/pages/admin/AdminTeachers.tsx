import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GraduationCap, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";

const AVAILABLE_STUDENTS = [
  "João Santos", "Ana Costa", "Pedro Lima", "Mariana Souza",
  "Lucas Ferreira", "Camila Rocha", "Rafael Mendes", "Julia Almeida",
];

const AVAILABLE_CLASSES = [
  "Turma A1 - Segunda 18h", "Turma A2 - Terça 19h", "Turma B1 - Quarta 17h",
  "Turma B2 - Quinta 20h", "Kids - Sábado 10h",
];

interface Teacher {
  id: number;
  name: string;
  email: string;
  hourlyRate: number;
  assignedStudents: string[];
  assignedClasses: string[];
}

const INITIAL_TEACHERS: Teacher[] = [
  { id: 1, name: "Prof. Maria Silva", email: "maria@escola.com", hourlyRate: 30, assignedStudents: ["João Santos", "Ana Costa", "Mariana Souza", "Camila Rocha"], assignedClasses: ["Turma A1 - Segunda 18h", "Turma B1 - Quarta 17h"] },
  { id: 2, name: "Prof. Carlos Souza", email: "carlos@escola.com", hourlyRate: 35, assignedStudents: ["Pedro Lima", "Lucas Ferreira", "Rafael Mendes"], assignedClasses: ["Turma A2 - Terça 19h", "Turma B2 - Quinta 20h", "Kids - Sábado 10h"] },
];

const EMPTY_FORM = { name: "", email: "", hourlyRate: 30, assignedStudents: [] as string[], assignedClasses: [] as string[] };

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(() =>
    teachers.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    ), [search, teachers]);

  const openNew = () => { setEditingId(null); setForm(EMPTY_FORM); setDialogOpen(true); };
  const openEdit = (t: Teacher) => {
    setEditingId(t.id);
    setForm({ name: t.name, email: t.email, hourlyRate: t.hourlyRate, assignedStudents: [...t.assignedStudents], assignedClasses: [...t.assignedClasses] });
    setDialogOpen(true);
  };

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      setTeachers((prev) => prev.map((t) => t.id === editingId ? { ...t, ...form } : t));
    } else {
      setTeachers((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) setTeachers((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Professores</h1>
          <p className="page-subtitle">{teachers.length} professores cadastrados</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" />
          Novo Professor
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar professor..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Turmas</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Alunos</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Valor/Hora</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.email}</p>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {t.assignedClasses.length === 0 ? (
                      <span className="text-xs text-muted-foreground">Nenhuma</span>
                    ) : t.assignedClasses.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <Badge variant="secondary" className="text-xs">{t.assignedStudents.length} alunos</Badge>
                </td>
                <td className="p-3">
                  <span className="font-medium">R${t.hourlyRate.toFixed(2)}</span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum professor encontrado</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Professor" : "Novo Professor"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Atualize os dados do professor." : "Cadastre um novo professor."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome do professor" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@escola.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Valor por Hora (R$)</label>
              <Input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Turmas Atribuídas</label>
              <div className="space-y-2 max-h-36 overflow-y-auto border rounded-md p-3">
                {AVAILABLE_CLASSES.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.assignedClasses.includes(c)}
                      onCheckedChange={() => setForm({ ...form, assignedClasses: toggleItem(form.assignedClasses, c) })}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Alunos Atribuídos</label>
              <div className="space-y-2 max-h-36 overflow-y-auto border rounded-md p-3">
                {AVAILABLE_STUDENTS.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.assignedStudents.includes(s)}
                      onCheckedChange={() => setForm({ ...form, assignedStudents: toggleItem(form.assignedStudents, s) })}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editingId ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir professor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O professor será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminTeachers;
