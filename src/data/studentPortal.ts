export type ClassStatus = "scheduled" | "present" | "absence" | "cancelled";
export type MaterialType = "reading" | "audio" | "video" | "worksheet" | "image" | "external";
export type StudentType = "vip" | "vip_kids" | "group" | "group_kids";

export type PackageStatus = "active" | "completed" | "pending";
export type NoticeCategory = "financeiro" | "agenda" | "materiais";

export interface StudentClass {
  id: number;
  startsAt: string;
  topic: string;
  teacher: string;
  meetingLabel: string;
  meetingUrl: string;
  status: ClassStatus;
}

export interface StudentMaterial {
  id: number;
  title: string;
  type: MaterialType;
  stage: string;
  topic: string;
  date: string;
  size: string;
  url?: string;
}

export interface StudentPackage {
  id: number;
  label: string;
  purchasedAt: string;
  classesTotal: number;
  amount: number;
  paymentMethod: string;
  status: PackageStatus;
}

export interface StudentNotice {
  id: number;
  title: string;
  message: string;
  category: NoticeCategory;
  createdAt: string;
  read: boolean;
}

export const PORTAL_REFERENCE_DATE = new Date("2026-04-02T12:00:00-03:00");

export const STUDENT_PROFILE = {
  name: "João Santos",
  email: "joao@escola.com",
  studentType: "vip" as StudentType,
  location: "Dublin, Irlanda",
  timezone: "Europe/Dublin",
  timezoneLabel: "Europe/Dublin · GMT+1",
  stage: "B1",
  teacher: "Prof. Maria Silva",
  teacherTimezone: "America/Sao_Paulo",
  teacherTimezoneLabel: "America/Sao_Paulo · GMT-3",
  modality: "Online individual",
  goal: "Conversação para reuniões e entrevistas",
  reminderPreference: "24h antes por WhatsApp",
};

export const STUDENT_CLASSES: StudentClass[] = [
  {
    id: 1,
    startsAt: "2026-04-03T18:00:00Z",
    topic: "Unit 5 — Present Perfect",
    teacher: "Prof. Maria Silva",
    meetingLabel: "Google Meet",
    meetingUrl: "#",
    status: "scheduled",
  },
  {
    id: 2,
    startsAt: "2026-04-07T18:00:00Z",
    topic: "Work Meetings Simulation",
    teacher: "Prof. Maria Silva",
    meetingLabel: "Google Meet",
    meetingUrl: "#",
    status: "scheduled",
  },
  {
    id: 3,
    startsAt: "2026-03-29T18:00:00Z",
    topic: "Unit 4 — Past Simple Review",
    teacher: "Prof. Maria Silva",
    meetingLabel: "Google Meet",
    meetingUrl: "#",
    status: "present",
  },
  {
    id: 4,
    startsAt: "2026-03-26T18:00:00Z",
    topic: "Irregular Verbs Practice",
    teacher: "Prof. Maria Silva",
    meetingLabel: "Google Meet",
    meetingUrl: "#",
    status: "absence",
  },
  {
    id: 5,
    startsAt: "2026-03-22T18:00:00Z",
    topic: "Unit 4 — Speaking Drill",
    teacher: "Prof. Maria Silva",
    meetingLabel: "Google Meet",
    meetingUrl: "#",
    status: "present",
  },
  {
    id: 6,
    startsAt: "2026-03-19T18:00:00Z",
    topic: "Pronunciation Clinic",
    teacher: "Prof. Maria Silva",
    meetingLabel: "Google Meet",
    meetingUrl: "#",
    status: "cancelled",
  },
  {
    id: 7,
    startsAt: "2026-03-15T18:00:00Z",
    topic: "Interview Answers",
    teacher: "Prof. Maria Silva",
    meetingLabel: "Google Meet",
    meetingUrl: "#",
    status: "present",
  },
  {
    id: 8,
    startsAt: "2026-03-12T18:00:00Z",
    topic: "Vocabulary — Travel",
    teacher: "Prof. Maria Silva",
    meetingLabel: "Google Meet",
    meetingUrl: "#",
    status: "present",
  },
  {
    id: 9,
    startsAt: "2026-03-08T18:00:00Z",
    topic: "Listening — Everyday Tasks",
    teacher: "Prof. Maria Silva",
    meetingLabel: "Google Meet",
    meetingUrl: "#",
    status: "absence",
  },
  {
    id: 10,
    startsAt: "2026-03-05T18:00:00Z",
    topic: "Stage Review",
    teacher: "Prof. Maria Silva",
    meetingLabel: "Google Meet",
    meetingUrl: "#",
    status: "present",
  },
];

export const MATERIAL_STAGES = [
  "Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5", "Stage 6",
  "Stage 7", "Stage 8", "Stage 9", "Stage 10", "Stage 11", "Stage 12",
  "Extra",
] as const;

export type MaterialStage = (typeof MATERIAL_STAGES)[number];

export const STUDENT_MATERIALS: StudentMaterial[] = [
  { id: 1, title: "Present Perfect - Text", type: "reading", stage: "Stage 5", topic: "Present Perfect", date: "2026-03-20", size: "2.4 MB" },
  { id: 2, title: "Comparatives Worksheet", type: "worksheet", stage: "Stage 3", topic: "Comparatives", date: "2026-03-18", size: "1.1 MB" },
  { id: 3, title: "Listening - Daily Routines", type: "audio", stage: "Stage 2", topic: "Daily Routines", date: "2026-03-15", size: "5.8 MB" },
  { id: 4, title: "Conditionals Explained", type: "video", stage: "Stage 7", topic: "Conditionals", date: "2026-03-12", size: "45 MB" },
  { id: 5, title: "Vocabulary - Travel", type: "reading", stage: "Stage 4", topic: "Vocabulary", date: "2026-03-10", size: "1.8 MB" },
  { id: 6, title: "Grammar Exercises - Unit 5", type: "worksheet", stage: "Stage 5", topic: "Mixed Grammar", date: "2026-03-08", size: "890 KB" },
  { id: 7, title: "Pronunciation Guide", type: "audio", stage: "Stage 1", topic: "Pronunciation", date: "2026-03-05", size: "3.2 MB" },
  { id: 8, title: "Speaking Practice - Interviews", type: "video", stage: "Stage 6", topic: "Speaking", date: "2026-03-01", size: "62 MB" },
  { id: 9, title: "Flashcards - Animals", type: "image", stage: "Stage 1", topic: "Vocabulary", date: "2026-03-22", size: "4.1 MB" },
  { id: 10, title: "Notebook LM - Unit 5 Review", type: "external", stage: "Stage 5", topic: "Mixed Grammar", date: "2026-03-25", size: "—", url: "https://notebooklm.google.com/example" },
  { id: 11, title: "Alphabet & Greetings", type: "reading", stage: "Stage 1", topic: "Basics", date: "2026-02-10", size: "1.2 MB" },
  { id: 12, title: "Numbers & Colors", type: "worksheet", stage: "Stage 1", topic: "Basics", date: "2026-02-12", size: "980 KB" },
  { id: 13, title: "Simple Present Intro", type: "video", stage: "Stage 2", topic: "Simple Present", date: "2026-02-15", size: "38 MB" },
  { id: 14, title: "Prepositions of Place", type: "reading", stage: "Stage 3", topic: "Prepositions", date: "2026-02-18", size: "1.5 MB" },
  { id: 15, title: "Past Simple Stories", type: "audio", stage: "Stage 4", topic: "Past Simple", date: "2026-02-20", size: "4.7 MB" },
  { id: 16, title: "Future Tenses Overview", type: "video", stage: "Stage 6", topic: "Future Tenses", date: "2026-02-22", size: "52 MB" },
  { id: 17, title: "Phrasal Verbs List", type: "reading", stage: "Stage 8", topic: "Phrasal Verbs", date: "2026-02-25", size: "2.1 MB" },
  { id: 18, title: "Reported Speech Drill", type: "worksheet", stage: "Stage 9", topic: "Reported Speech", date: "2026-02-28", size: "1.3 MB" },
  { id: 19, title: "Advanced Listening", type: "audio", stage: "Stage 10", topic: "Listening Skills", date: "2026-03-02", size: "6.4 MB" },
  { id: 20, title: "Debate Preparation", type: "reading", stage: "Stage 11", topic: "Argumentation", date: "2026-03-04", size: "2.8 MB" },
  { id: 21, title: "Proficiency Mock Test", type: "worksheet", stage: "Stage 12", topic: "Mixed Skills", date: "2026-03-06", size: "3.5 MB" },
  { id: 22, title: "Idioms & Expressions", type: "reading", stage: "Extra", topic: "Culture", date: "2026-03-09", size: "1.9 MB" },
  { id: 23, title: "Movie Listening Activity", type: "video", stage: "Extra", topic: "Entertainment", date: "2026-03-11", size: "75 MB" },
  { id: 24, title: "Song Lyrics Exercise", type: "worksheet", stage: "Extra", topic: "Music", date: "2026-03-14", size: "650 KB" },
];

export const STUDENT_PACKAGES: StudentPackage[] = [
  {
    id: 1,
    label: "Pacote Intensivo · 8 aulas",
    purchasedAt: "2026-03-03",
    classesTotal: 8,
    amount: 680,
    paymentMethod: "Pix",
    status: "active",
  },
  {
    id: 2,
    label: "Pacote Base · 4 aulas",
    purchasedAt: "2026-01-15",
    classesTotal: 4,
    amount: 360,
    paymentMethod: "Pix",
    status: "completed",
  },
  {
    id: 3,
    label: "Reserva antecipada · 8 aulas",
    purchasedAt: "2026-04-10",
    classesTotal: 8,
    amount: 680,
    paymentMethod: "Pix",
    status: "pending",
  },
];

export const STUDENT_NOTICES: StudentNotice[] = [
  {
    id: 1,
    title: "Renovação recomendada",
    message: "Seu pacote está com 1 aula restante. Você já pode pagar o próximo pacote com antecedência.",
    category: "financeiro",
    createdAt: "2026-04-01T10:00:00-03:00",
    read: false,
  },
  {
    id: 2,
    title: "Aula reagendada",
    message: "A aula de Pronunciation Clinic foi cancelada com aviso prévio e não será cobrada.",
    category: "agenda",
    createdAt: "2026-03-19T12:00:00-03:00",
    read: true,
  },
  {
    id: 3,
    title: "Novo material disponível",
    message: "O material Grammar Exercises - Unit 5 foi liberado para preparar a próxima aula.",
    category: "materiais",
    createdAt: "2026-03-08T09:00:00-03:00",
    read: false,
  },
];

export const BILLABLE_STATUSES: ClassStatus[] = ["present", "absence"];

export const getUpcomingClasses = () =>
  STUDENT_CLASSES.filter(
    (classItem) => classItem.status === "scheduled" && new Date(classItem.startsAt) >= PORTAL_REFERENCE_DATE,
  ).sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));

export const getClassHistory = () =>
  STUDENT_CLASSES.filter(
    (classItem) => classItem.status !== "scheduled" || new Date(classItem.startsAt) < PORTAL_REFERENCE_DATE,
  ).sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt));

export const getBillableClassCount = () =>
  STUDENT_CLASSES.filter((classItem) => BILLABLE_STATUSES.includes(classItem.status)).length;

export const getPresentClassCount = () =>
  STUDENT_CLASSES.filter((classItem) => classItem.status === "present").length;

export const getAbsenceClassCount = () =>
  STUDENT_CLASSES.filter((classItem) => classItem.status === "absence").length;

export const getCancelledClassCount = () =>
  STUDENT_CLASSES.filter((classItem) => classItem.status === "cancelled").length;

export const getActivePackage = () => STUDENT_PACKAGES.find((pkg) => pkg.status === "active") ?? STUDENT_PACKAGES[0];

export const getRemainingClasses = () => Math.max(getActivePackage().classesTotal - getBillableClassCount(), 0);

export const getAttendanceRate = () => {
  const billableClasses = getBillableClassCount();
  if (!billableClasses) return 0;
  return Math.round((getPresentClassCount() / billableClasses) * 100);
};

export const getUnreadNoticesCount = () => STUDENT_NOTICES.filter((notice) => !notice.read).length;

export const getCurrentPackageProgress = () =>
  Math.round((getBillableClassCount() / getActivePackage().classesTotal) * 100);

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: options?.year ?? undefined,
    ...options,
  }).format(new Date(value));

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export const formatTimeInTimezone = (timeZone: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(PORTAL_REFERENCE_DATE);

export const getStatusLabel = (status: ClassStatus) => {
  switch (status) {
    case "scheduled":
      return "Agendada";
    case "present":
      return "Presente";
    case "absence":
      return "Falta";
    case "cancelled":
      return "Cancelada";
  }
};

export const canCancelClasses = (type: StudentType) => type === "vip" || type === "vip_kids";
