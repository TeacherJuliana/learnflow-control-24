import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lock, CheckCircle2, XCircle, ChevronLeft, Trophy, AlertTriangle } from "lucide-react";
import { MATERIAL_STAGES, type MaterialStage } from "@/data/studentPortal";
import {
  INITIAL_ATTEMPTS, PASSING_SCORE,
  getStageStatus, getBestScore, getTestForStage, gradeTest,
  type TestAttempt, type StageTest
} from "@/data/testSystem";

const STAGE_EMOJI: Record<string, string> = {
  "Stage 1": "🌱", "Stage 2": "🌿", "Stage 3": "🍀", "Stage 4": "🌳",
  "Stage 5": "⭐", "Stage 6": "🔥", "Stage 7": "🚀", "Stage 8": "💎",
  "Stage 9": "🏆", "Stage 10": "👑", "Stage 11": "🎯", "Stage 12": "🎓",
  "Extra": "📦",
};

const STUDENT_ID = "joao";

const StudentTests = () => {
  const [attempts, setAttempts] = useState<TestAttempt[]>(INITIAL_ATTEMPTS);
  const [activeTest, setActiveTest] = useState<StageTest | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState<{ score: number; passed: boolean } | null>(null);

  const testableStages = MATERIAL_STAGES.filter((s) => s !== "Extra");

  const passedCount = useMemo(() =>
    testableStages.filter((s) => getStageStatus(s, attempts, STUDENT_ID) === "passed").length
  , [attempts, testableStages]);

  const startTest = (stage: MaterialStage) => {
    const test = getTestForStage(stage);
    if (!test) return;
    setActiveTest(test);
    setAnswers({});
    setShowResult(null);
  };

  const submitTest = () => {
    if (!activeTest) return;
    const score = gradeTest(activeTest, answers);
    const passed = score >= PASSING_SCORE;
    const stageAttempts = attempts.filter((a) => a.stage === activeTest.stage && a.studentId === STUDENT_ID);
    const newAttempt: TestAttempt = {
      id: Date.now(),
      testId: activeTest.id,
      studentId: STUDENT_ID,
      stage: activeTest.stage,
      answers,
      score,
      passed,
      attemptNumber: stageAttempts.length + 1,
      submittedAt: new Date().toISOString(),
    };
    setAttempts((prev) => [...prev, newAttempt]);
    setShowResult({ score, passed });
  };

  if (activeTest && !showResult) {
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = activeTest.questions.length;
    return (
      <DashboardLayout>
        <Button variant="ghost" size="sm" onClick={() => setActiveTest(null)} className="mb-3 -ml-2 text-muted-foreground">
          <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <h1 className="page-header mb-1">{activeTest.title}</h1>
        <p className="page-subtitle mb-4">{answeredCount}/{totalQuestions} respondidas • Mínimo {PASSING_SCORE}% para passar</p>
        <Progress value={(answeredCount / totalQuestions) * 100} className="h-2 mb-6" />

        <div className="space-y-6">
          {activeTest.questions.map((q, idx) => (
            <div key={q.id} className="rounded-lg border bg-card p-5">
              <p className="font-medium text-sm mb-3">{idx + 1}. {q.question}</p>
              <Badge variant="secondary" className="mb-3 text-xs">{q.points} pts • {q.type === "multiple_choice" ? "Múltipla escolha" : "Resposta aberta"}</Badge>
              {q.type === "multiple_choice" && q.options ? (
                <RadioGroup value={answers[q.id] ?? ""} onValueChange={(val) => setAnswers((p) => ({ ...p, [q.id]: val }))}>
                  {q.options.map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <RadioGroupItem value={opt} id={`q${q.id}-${opt}`} />
                      <Label htmlFor={`q${q.id}-${opt}`} className="text-sm cursor-pointer">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Textarea
                  placeholder="Escreva sua resposta..."
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                  rows={3}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={submitTest} disabled={answeredCount === 0}>Enviar Teste</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (activeTest && showResult) {
    return (
      <DashboardLayout>
        <Dialog open onOpenChange={() => { setActiveTest(null); setShowResult(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {showResult.passed ? <Trophy className="w-5 h-5 text-yellow-500" /> : <AlertTriangle className="w-5 h-5 text-destructive" />}
                {showResult.passed ? "Parabéns! 🎉" : "Tente novamente"}
              </DialogTitle>
              <DialogDescription>
                {showResult.passed
                  ? "Você desbloqueou o próximo stage!"
                  : `Você precisa de ${PASSING_SCORE}% para passar. Tente novamente.`}
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-4">
              <p className="text-4xl font-bold">{showResult.score}%</p>
              <Badge variant={showResult.passed ? "default" : "destructive"} className="mt-2">
                {showResult.passed ? "Aprovado" : "Reprovado"}
              </Badge>
            </div>
            <div className="flex gap-2 justify-end">
              {!showResult.passed && (
                <Button variant="outline" onClick={() => { setAnswers({}); setShowResult(null); }}>Tentar Novamente</Button>
              )}
              <Button onClick={() => { setActiveTest(null); setShowResult(null); }}>Voltar</Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="opacity-50 pointer-events-none">
          <h1 className="page-header">Testes por Stage</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-header">Testes por Stage</h1>
        <p className="page-subtitle">Complete cada teste com no mínimo {PASSING_SCORE}% para desbloquear o próximo stage</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Progresso Geral</p>
          <p className="text-2xl font-semibold mt-2">{passedCount}/12 stages</p>
          <Progress value={(passedCount / 12) * 100} className="h-2 mt-2" />
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Nota mínima</p>
          <p className="text-2xl font-semibold mt-2">{PASSING_SCORE}%</p>
          <p className="text-sm text-muted-foreground mt-1">para aprovação em cada stage</p>
        </div>
      </div>

      <div className="grid gap-3">
        {testableStages.map((stage) => {
          const status = getStageStatus(stage, attempts, STUDENT_ID);
          const best = getBestScore(attempts, STUDENT_ID, stage);
          const stageAttemptCount = attempts.filter((a) => a.stage === stage && a.studentId === STUDENT_ID).length;
          const isLocked = status === "locked";

          return (
            <div
              key={stage}
              className={`flex items-center gap-4 p-5 rounded-lg border bg-card transition-colors ${isLocked ? "opacity-50" : "hover:bg-accent/50"}`}
            >
              <span className="text-2xl">{STAGE_EMOJI[stage] ?? "📘"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{stage}</p>
                  {status === "passed" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {status === "failed" && <XCircle className="w-4 h-4 text-destructive" />}
                  {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {status === "locked" && <span className="text-xs text-muted-foreground">Complete o stage anterior para desbloquear</span>}
                  {status === "unlocked" && <span className="text-xs text-muted-foreground">Disponível — Faça o teste</span>}
                  {(status === "passed" || status === "failed") && (
                    <>
                      <Badge variant={status === "passed" ? "default" : "destructive"} className="text-xs">
                        {status === "passed" ? "Aprovado" : "Reprovado"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Melhor: {best}%</span>
                      <span className="text-xs text-muted-foreground">• {stageAttemptCount} tentativa(s)</span>
                    </>
                  )}
                </div>
              </div>
              {!isLocked && (
                <Button size="sm" variant={status === "passed" ? "outline" : "default"} onClick={() => startTest(stage)}>
                  {status === "passed" ? "Refazer" : status === "failed" ? "Tentar Novamente" : "Fazer Teste"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default StudentTests;
