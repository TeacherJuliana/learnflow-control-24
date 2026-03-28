import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Users, Search, Plus, Filter } from "lucide-react";
import { useState, useMemo } from "react";

const ALL_STUDENTS = [
  { id: 1, name: "João Santos", email: "joao@email.com", teacher: "Prof. Maria", stage: "B1", status: "Ativo", modality: "VIP", age: 25, startDate: "2024-03-01", location: "São Paulo - SP (BRT)" },
  { id: 2, name: "Ana Costa", email: "ana@email.com", teacher: "Prof. Maria", stage: "A2", status: "Ativo", modality: "Turma", age: 30, startDate: "2024-01-15", location: "Lisboa - Portugal (WET)" },
  { id: 3, name: "Pedro Lima", email: "pedro@email.com", teacher: "Prof. Carlos", stage: "B2", status: "Ativo", modality: "VIP", age: 22, startDate: "2023-11-20", location: "Miami - EUA (EST)" },
  { id: 4, name: "Mariana Souza", email: "mariana@email.com", teacher: "Prof. Maria", stage: "A1", status: "Inativo", modality: "Kids", age: 28, startDate: "2024-02-10", location: "Rio de Janeiro - RJ (BRT)" },
  { id: 5, name: "Lucas Ferreira", email: "lucas@email.com", teacher: "Prof. Carlos", stage: "C1", status: "Ativo", modality: "Turma", age: 35, startDate: "2023-09-05", location: "Toronto - Canadá (EST)" },
  { id: 6, name: "Camila Rocha", email: "camila@email.com", teacher: "Prof. Maria", stage: "B1", status: "Ativo", modality: "Kids", age: 27, startDate: "2024-04-01", location: "Belo Horizonte - MG (BRT)" },
  { id: 7, name: "Rafael Mendes", email: "rafael@email.com", teacher: "Prof. Carlos", stage: "A2", status: "Ativo", modality: "VIP", age: 19, startDate: "2024-05-10", location: "Dublin - Irlanda (GMT)" },
  { id: 8, name: "Julia Almeida", email: "julia@email.com", teacher: "Prof. Maria", stage: "B2", status: "Inativo", modality: "Turma", age: 32, startDate: "2023-08-15", location: "Curitiba - PR (BRT)" },
];

const AdminStudents = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");

  const filtered = useMemo(() => {
    return ALL_STUDENTS.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesStage = stageFilter === "all" || s.stage === stageFilter;
      const matchesTeacher = teacherFilter === "all" || s.teacher === teacherFilter;
      return matchesSearch && matchesStatus && matchesStage && matchesTeacher;
    });
  }, [search, statusFilter, stageFilter, teacherFilter]);

  const stages = [...new Set(ALL_STUDENTS.map((s) => s.stage))].sort();
  const teachers = [...new Set(ALL_STUDENTS.map((s) => s.teacher))];

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setStageFilter("all");
    setTeacherFilter("all");
  };

  const hasFilters = search || statusFilter !== "all" || stageFilter !== "all" || teacherFilter !== "all";

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header">Alunos</h1>
          <p className="page-subtitle">{ALL_STUDENTS.length} alunos cadastrados</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Novo Aluno
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full md:w-[120px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {stages.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={teacherFilter} onValueChange={setTeacherFilter}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="Teacher" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {teachers.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <Filter className="w-4 h-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Results count */}
      {hasFilters && (
        <p className="text-xs text-muted-foreground mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Localização</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Teacher</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Stage</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Modalidade</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Início</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="p-3">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{s.teacher}</td>
                <td className="p-3">
                  <Badge variant="secondary" className="text-xs">{s.stage}</Badge>
                </td>
                <td className="p-3 hidden lg:table-cell">
                  <Badge variant="outline" className="text-xs">{s.modality}</Badge>
                </td>
                <td className="p-3">
                  <Badge variant={s.status === "Ativo" ? "default" : "secondary"} className="text-xs">
                    {s.status}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground text-xs hidden lg:table-cell">
                  {new Date(s.startDate).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum aluno encontrado</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
