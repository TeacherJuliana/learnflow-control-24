import { MATERIAL_STAGES, type MaterialStage } from "./studentPortal";

export type QuestionType = "multiple_choice" | "open";

export interface TestQuestion {
  id: number;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string; // for multiple_choice
  points: number;
}

export interface StageTest {
  id: number;
  stage: MaterialStage;
  title: string;
  questions: TestQuestion[];
  passingScore: number; // percentage, default 70
}

export interface TestAttempt {
  id: number;
  testId: number;
  studentId: string;
  stage: MaterialStage;
  answers: Record<number, string>; // questionId -> answer
  score: number; // percentage
  passed: boolean;
  attemptNumber: number;
  submittedAt: string;
  gradedAt?: string;
  manualOverride?: boolean;
}

export const PASSING_SCORE = 70;

// Sample tests for each stage
export const STAGE_TESTS: StageTest[] = [
  {
    id: 1, stage: "Stage 1", title: "Stage 1 — Basics Test", passingScore: PASSING_SCORE,
    questions: [
      { id: 1, question: "What is the correct greeting for the morning?", type: "multiple_choice", options: ["Good night", "Good morning", "Good evening", "Good afternoon"], correctAnswer: "Good morning", points: 10 },
      { id: 2, question: "Choose the correct article: ___ apple", type: "multiple_choice", options: ["A", "An", "The", "No article"], correctAnswer: "An", points: 10 },
      { id: 3, question: "What color is the sky on a clear day?", type: "multiple_choice", options: ["Red", "Green", "Blue", "Yellow"], correctAnswer: "Blue", points: 10 },
      { id: 4, question: "Which number comes after 'twelve'?", type: "multiple_choice", options: ["Eleven", "Thirteen", "Fourteen", "Ten"], correctAnswer: "Thirteen", points: 10 },
      { id: 5, question: "Write a sentence introducing yourself in English.", type: "open", points: 10 },
    ],
  },
  {
    id: 2, stage: "Stage 2", title: "Stage 2 — Simple Present Test", passingScore: PASSING_SCORE,
    questions: [
      { id: 6, question: "She ___ to school every day.", type: "multiple_choice", options: ["go", "goes", "going", "gone"], correctAnswer: "goes", points: 10 },
      { id: 7, question: "They ___ breakfast at 7 AM.", type: "multiple_choice", options: ["has", "have", "having", "had"], correctAnswer: "have", points: 10 },
      { id: 8, question: "Which sentence is correct?", type: "multiple_choice", options: ["He don't like coffee.", "He doesn't likes coffee.", "He doesn't like coffee.", "He not like coffee."], correctAnswer: "He doesn't like coffee.", points: 10 },
      { id: 9, question: "I ___ English on Mondays.", type: "multiple_choice", options: ["study", "studies", "studying", "studied"], correctAnswer: "study", points: 10 },
      { id: 10, question: "Describe your daily routine using 3 sentences in Simple Present.", type: "open", points: 10 },
    ],
  },
  {
    id: 3, stage: "Stage 3", title: "Stage 3 — Comparatives Test", passingScore: PASSING_SCORE,
    questions: [
      { id: 11, question: "This book is ___ than that one.", type: "multiple_choice", options: ["more interesting", "interestinger", "most interesting", "interesting"], correctAnswer: "more interesting", points: 10 },
      { id: 12, question: "My house is ___ than yours.", type: "multiple_choice", options: ["big", "bigger", "biggest", "more big"], correctAnswer: "bigger", points: 10 },
      { id: 13, question: "She runs ___ than her brother.", type: "multiple_choice", options: ["fast", "faster", "fastest", "more fast"], correctAnswer: "faster", points: 10 },
      { id: 14, question: "Which is the superlative of 'good'?", type: "multiple_choice", options: ["gooder", "goodest", "best", "better"], correctAnswer: "best", points: 10 },
      { id: 15, question: "Compare two cities you know using comparatives.", type: "open", points: 10 },
    ],
  },
  {
    id: 4, stage: "Stage 4", title: "Stage 4 — Past Simple Test", passingScore: PASSING_SCORE,
    questions: [
      { id: 16, question: "She ___ to the store yesterday.", type: "multiple_choice", options: ["go", "goes", "went", "going"], correctAnswer: "went", points: 10 },
      { id: 17, question: "They ___ a movie last night.", type: "multiple_choice", options: ["watch", "watched", "watching", "watches"], correctAnswer: "watched", points: 10 },
      { id: 18, question: "I ___ (not) see him at the party.", type: "multiple_choice", options: ["didn't", "don't", "doesn't", "wasn't"], correctAnswer: "didn't", points: 10 },
      { id: 19, question: "What is the past tense of 'eat'?", type: "multiple_choice", options: ["eated", "ate", "eaten", "eating"], correctAnswer: "ate", points: 10 },
      { id: 20, question: "Write about what you did last weekend using Past Simple.", type: "open", points: 10 },
    ],
  },
  {
    id: 5, stage: "Stage 5", title: "Stage 5 — Present Perfect Test", passingScore: PASSING_SCORE,
    questions: [
      { id: 21, question: "I ___ already ___ lunch.", type: "multiple_choice", options: ["have / eaten", "has / eat", "have / ate", "had / eating"], correctAnswer: "have / eaten", points: 10 },
      { id: 22, question: "She ___ never ___ to Paris.", type: "multiple_choice", options: ["has / been", "have / been", "has / be", "have / gone"], correctAnswer: "has / been", points: 10 },
      { id: 23, question: "We ___ here since 2020.", type: "multiple_choice", options: ["lived", "have lived", "living", "lives"], correctAnswer: "have lived", points: 10 },
      { id: 24, question: "Which word completes: 'Have you ___ finished?'", type: "multiple_choice", options: ["yet", "already", "since", "for"], correctAnswer: "already", points: 10 },
      { id: 25, question: "Write 3 things you have already done today.", type: "open", points: 10 },
    ],
  },
  ...([6, 7, 8, 9, 10, 11, 12] as const).map((n) => ({
    id: n,
    stage: `Stage ${n}` as MaterialStage,
    title: `Stage ${n} Test`,
    passingScore: PASSING_SCORE,
    questions: [
      { id: n * 100 + 1, question: `Stage ${n} — Question 1`, type: "multiple_choice" as QuestionType, options: ["A", "B", "C", "D"], correctAnswer: "A", points: 10 },
      { id: n * 100 + 2, question: `Stage ${n} — Question 2`, type: "multiple_choice" as QuestionType, options: ["A", "B", "C", "D"], correctAnswer: "B", points: 10 },
      { id: n * 100 + 3, question: `Stage ${n} — Question 3`, type: "multiple_choice" as QuestionType, options: ["A", "B", "C", "D"], correctAnswer: "C", points: 10 },
      { id: n * 100 + 4, question: `Stage ${n} — Question 4`, type: "multiple_choice" as QuestionType, options: ["A", "B", "C", "D"], correctAnswer: "D", points: 10 },
      { id: n * 100 + 5, question: `Stage ${n} — Open question: Explain in your own words.`, type: "open" as QuestionType, points: 10 },
    ],
  })),
];

// Mock attempts — student "joao" passed stages 1-3
export const INITIAL_ATTEMPTS: TestAttempt[] = [
  { id: 1, testId: 1, studentId: "joao", stage: "Stage 1", answers: {}, score: 90, passed: true, attemptNumber: 1, submittedAt: "2026-02-15T10:00:00Z" },
  { id: 2, testId: 2, studentId: "joao", stage: "Stage 2", answers: {}, score: 80, passed: true, attemptNumber: 1, submittedAt: "2026-02-22T10:00:00Z" },
  { id: 3, testId: 3, studentId: "joao", stage: "Stage 3", answers: {}, score: 75, passed: true, attemptNumber: 1, submittedAt: "2026-03-01T10:00:00Z" },
  { id: 4, testId: 4, studentId: "joao", stage: "Stage 4", answers: {}, score: 55, passed: false, attemptNumber: 1, submittedAt: "2026-03-10T10:00:00Z" },
];

// Helper: get stages a student has unlocked
export const getUnlockedStages = (attempts: TestAttempt[], studentId: string): Set<MaterialStage> => {
  const unlocked = new Set<MaterialStage>();
  unlocked.add("Stage 1"); // Stage 1 always unlocked
  unlocked.add("Extra"); // Extra always unlocked

  for (let i = 1; i <= 12; i++) {
    const stage = `Stage ${i}` as MaterialStage;
    const passed = attempts.some((a) => a.studentId === studentId && a.stage === stage && a.passed);
    if (passed) {
      unlocked.add(stage);
      const next = `Stage ${i + 1}` as MaterialStage;
      if (i < 12) unlocked.add(next);
    } else {
      break;
    }
  }
  return unlocked;
};

export const getStageStatus = (
  stage: MaterialStage,
  attempts: TestAttempt[],
  studentId: string
): "locked" | "unlocked" | "passed" | "failed" => {
  if (stage === "Extra") return "unlocked";
  const stageAttempts = attempts.filter((a) => a.studentId === studentId && a.stage === stage);
  const passed = stageAttempts.some((a) => a.passed);
  if (passed) return "passed";

  const unlocked = getUnlockedStages(attempts, studentId);
  if (!unlocked.has(stage)) return "locked";

  const failed = stageAttempts.some((a) => !a.passed);
  if (failed) return "failed";

  return "unlocked";
};

export const getBestScore = (attempts: TestAttempt[], studentId: string, stage: MaterialStage): number | null => {
  const stageAttempts = attempts.filter((a) => a.studentId === studentId && a.stage === stage);
  if (!stageAttempts.length) return null;
  return Math.max(...stageAttempts.map((a) => a.score));
};

export const getLatestAttempt = (attempts: TestAttempt[], studentId: string, stage: MaterialStage): TestAttempt | null => {
  const stageAttempts = attempts
    .filter((a) => a.studentId === studentId && a.stage === stage)
    .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
  return stageAttempts[0] ?? null;
};

export const getTestForStage = (stage: MaterialStage): StageTest | undefined =>
  STAGE_TESTS.find((t) => t.stage === stage);

export const gradeTest = (test: StageTest, answers: Record<number, string>): number => {
  let earned = 0;
  let total = 0;
  for (const q of test.questions) {
    total += q.points;
    if (q.type === "multiple_choice" && answers[q.id] === q.correctAnswer) {
      earned += q.points;
    }
    // open questions are not auto-graded (score = 0 unless manually graded)
  }
  return total > 0 ? Math.round((earned / total) * 100) : 0;
};
