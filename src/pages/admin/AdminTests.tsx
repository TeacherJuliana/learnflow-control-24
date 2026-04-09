import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Pencil, Trash2, Eye, CheckCircle2, Unlock } from "lucide-react";
import { MATERIAL_STAGES, type MaterialStage } from "@/data/studentPortal";
import {
  STAGE_TESTS, INITIAL_ATTEMPTS, PASSING_SCORE,
  type StageTest, type TestQuestion, type TestAttempt, type QuestionType,
  getBestScore
} from "@/data/testSystem";

const MOCK_STUDENTS = [
  { id: "joao", name: "João Santos" },
  { id: "maria", name: "Maria Oliveira" },
  { id: "pedro", name: "Pedro Costa" },
];

const EMPTY_QUESTION: TestQuestion = { id: 0, question: "", type: "multiple_choice", options: ["", "", "", ""], correctAnswer: "", points: 10 };

const AdminTests = () => {
  const [tests, setTests] = useState<StageTest[]>(STAGE_TESTS);
  const [attempts, setAttempts] = useState<TestAttempt[]>(INITIAL_ATTEMPTS);
  const [activeTab, setActiveTab] = useState("tests");
  const [search, setSearch] = useState("");

  // Test editing state
  const [editingTest, setEditingTest] = useState<StageTest | null>(null);
  const [editQuestions, setEditQuestions] = useState<TestQuestion[]>([]);
  const [deleteTestId, setDeleteTestId] = useState<number | null>(null);

  // Student results viewing
  const [viewingStudent, setViewingStudent] = useState<string | null>(null);

  // Override dialog
  const [overrideAttempt, setOverrideAttempt] = useState<TestAttempt | null>(null);
  const [overrideScore, setOverrideScore] = useState("");

  const openEditTest = (test: StageTest) => {
    setEditingTest(test);
    setEditQuestions(JSON.parse(JSON.stringify(test.questions)));
  };

  const openNewTest = (stage: MaterialStage) => {
    const newTest: StageTest = {
      id: Date.now(),
      stage,
      title: `${stage} Test`,
      passingScore: PASSING_SCORE,
      questions: [{ ...EMPTY_QUESTION, id: Date.now() }],
    };
    setEditingTest(newTest);
    setEditQuestions(newTest.questions);
  };

  const addQuestion = () => {
    setEditQuestions((prev) => [...prev, { ...EMPTY_QUESTION, id: Date.now() }]);
  };

  const updateQuestion = (idx: number, patch: Partial<TestQuestion>) => {
    setEditQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  };

  const removeQuestion = (idx: number) => {
    setEditQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const saveTest = () => {
    if (!editingTest) return;
    const updated = { ...editingTest, questions: editQuestions };
    setTests((prev) => {
      const existing = prev.findIndex((t) => t.id === updated.id);
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = updated;
        return copy;
      }
      return [...prev, updated];
    });
    setEditingTest(null);
  };

  const handleDelete = () => {
    if (deleteTestId === null) return;
    setTests((prev) => prev.filter((t) => t.id !== deleteTestId));
    setDeleteTestId(null);
  };

  const handleOverride = () => {
    if (!overrideAttempt) return;
    const newScore = parseInt(overrideScore);
    if (isNaN(newScore) || newScore < 0 || newScore > 100) return;
    setAttempts((prev) =>
      prev.map((a) =>
        a.id === overrideAttempt.id
          ? { ...a, score: newScore, passed: newScore >= PASSING_SCORE, manualOverride: true }
          : a
      )
    );
    setOverrideAttempt(null);
    setOverrideScore("");
  };

  const manualUnlock = (studentId: string, stage: MaterialStage) => {
    const newAttempt: TestAttempt = {
      id: Date.now(),
      testId: 0,
      studentId,
      stage,
      answers: {},
      score: 100,
      passed: true,
      attemptNumber: 0,
      submittedAt: new Date().toISOString(),
      manualOverride: true,
    };
    setAttempts((prev) => [...prev, newAttempt]);
  };

  const testableStages = MATERIAL_STAGES.filter((s) => s !== "Extra");

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-header">Gestão de Testes</h1>
        <p className="page-subtitle">Criar, editar testes e acompanhar resultados dos alunos</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tests">Testes</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        {/* Tests Tab */}
        <TabsContent value="tests">
          <div className="space-y-3">
            {testableStages.map((stage) => {
              const test = tests.find((t) => t.stage === stage);
              return (
                <div key={stage} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{stage}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {test ? `${test.questions.length} questões • Mínimo ${test.passingScore}%` : "Sem teste cadastrado"}
                    </p>
                  </div>
                  {test ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditTest(test)}>
                        <Pencil className="w-3 h-3 mr-1" /> Editar
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteTestId(test.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => openNewTest(stage)}>
                      <Plus className="w-3 h-3 mr-1" /> Criar Teste
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar aluno..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>

          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  {testableStages.map((s) => (
                    <TableHead key={s} className="text-center text-xs">{s.replace("Stage ", "S")}</TableHead>
                  ))}
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STUDENTS.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())).map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium text-sm">{student.name}</TableCell>
                    {testableStages.map((stage) => {
                      const best = getBestScore(attempts, student.id, stage);
                      const passed = attempts.some((a) => a.studentId === student.id && a.stage === stage && a.passed);
                      return (
                        <TableCell key={stage} className="text-center">
                          {best !== null ? (
                            <Badge variant={passed ? "default" : "destructive"} className="text-xs">
                              {best}%
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      <Button size="sm" variant="ghost" onClick={() => setViewingStudent(student.id)}>
                        <Eye className="w-3 h-3 mr-1" /> Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Test Dialog */}
      <Dialog open={!!editingTest} onOpenChange={(open) => !open && setEditingTest(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTest?.stage} — Editar Teste</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input value={editingTest?.title ?? ""} onChange={(e) => setEditingTest((p) => p ? { ...p, title: e.target.value } : p)} />
            </div>
            <div>
              <Label>Nota mínima (%)</Label>
              <Input type="number" value={editingTest?.passingScore ?? 70} onChange={(e) => setEditingTest((p) => p ? { ...p, passingScore: parseInt(e.target.value) || 70 } : p)} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Questões ({editQuestions.length})</Label>
                <Button size="sm" variant="outline" onClick={addQuestion}><Plus className="w-3 h-3 mr-1" /> Adicionar</Button>
              </div>
              {editQuestions.map((q, idx) => (
                <div key={idx} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Questão {idx + 1}</span>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeQuestion(idx)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                  <Textarea
                    placeholder="Pergunta..."
                    value={q.question}
                    onChange={(e) => updateQuestion(idx, { question: e.target.value })}
                    rows={2}
                  />
                  <div className="flex gap-3 items-center">
                    <Label className="text-xs">Tipo:</Label>
                    <Select
                      value={q.type}
                      onValueChange={(val: QuestionType) => updateQuestion(idx, { type: val, options: val === "multiple_choice" ? ["", "", "", ""] : undefined, correctAnswer: val === "multiple_choice" ? "" : undefined })}
                    >
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">Múltipla escolha</SelectItem>
                        <SelectItem value="open">Aberta</SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="text-xs">Pontos:</Label>
                    <Input type="number" value={q.points} onChange={(e) => updateQuestion(idx, { points: parseInt(e.target.value) || 10 })} className="w-20" />
                  </div>
                  {q.type === "multiple_choice" && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <Input
                            placeholder={`Opção ${optIdx + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(q.options ?? [])];
                              newOpts[optIdx] = e.target.value;
                              updateQuestion(idx, { options: newOpts });
                            }}
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            variant={q.correctAnswer === opt && opt ? "default" : "outline"}
                            onClick={() => updateQuestion(idx, { correctAnswer: opt })}
                            disabled={!opt}
                            className="text-xs shrink-0"
                          >
                            {q.correctAnswer === opt && opt ? <CheckCircle2 className="w-3 h-3" /> : "Correta"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditingTest(null)}>Cancelar</Button>
              <Button onClick={saveTest}>Salvar Teste</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteTestId !== null} onOpenChange={(open) => !open && setDeleteTestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir teste?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Student detail dialog */}
      <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Histórico — {MOCK_STUDENTS.find((s) => s.id === viewingStudent)?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {testableStages.map((stage) => {
              const stageAttempts = attempts
                .filter((a) => a.studentId === viewingStudent && a.stage === stage)
                .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
              const passed = stageAttempts.some((a) => a.passed);

              return (
                <div key={stage} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{stage}</span>
                      {passed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </div>
                    {!passed && viewingStudent && (
                      <Button size="sm" variant="outline" onClick={() => manualUnlock(viewingStudent, stage)}>
                        <Unlock className="w-3 h-3 mr-1" /> Desbloquear
                      </Button>
                    )}
                  </div>
                  {stageAttempts.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhuma tentativa</p>
                  ) : (
                    <div className="space-y-1">
                      {stageAttempts.map((a) => (
                        <div key={a.id} className="flex items-center gap-2 text-xs">
                          <Badge variant={a.passed ? "default" : "destructive"} className="text-xs">{a.score}%</Badge>
                          <span className="text-muted-foreground">
                            Tentativa {a.attemptNumber} • {new Date(a.submittedAt).toLocaleDateString("pt-BR")}
                          </span>
                          {a.manualOverride && <Badge variant="secondary" className="text-xs">Manual</Badge>}
                          <Button size="sm" variant="ghost" className="ml-auto text-xs h-6" onClick={() => { setOverrideAttempt(a); setOverrideScore(String(a.score)); }}>
                            Alterar nota
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Override score dialog */}
      <Dialog open={!!overrideAttempt} onOpenChange={(open) => !open && setOverrideAttempt(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Alterar Nota</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Nova nota (%)</Label>
            <Input type="number" min={0} max={100} value={overrideScore} onChange={(e) => setOverrideScore(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOverrideAttempt(null)}>Cancelar</Button>
              <Button onClick={handleOverride}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminTests;
