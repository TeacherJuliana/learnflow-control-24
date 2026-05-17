import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MessageCircle, Users, GraduationCap, Baby, Mic, ArrowRight,
  Instagram, Sparkles, BookOpen, Heart,
  Briefcase, LifeBuoy, Star, ChevronLeft, ChevronRight, Quote, Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import teacherPortrait from "@/assets/juliana-profile.png";
import engageLogo from "@/assets/engage-logo.jpeg";

const WHATSAPP_LINK = "https://wa.me/5500000000000";
const INSTAGRAM_HANDLE = "@teacherjulianaandrade";
const INSTAGRAM_URL = "https://instagram.com/teacherjulianaandrade";

/* ---------------- Interest form (Dialog) ---------------- */
type InterestDialogProps = {
  trigger: React.ReactNode;
};

const InterestDialog = ({ trigger }: InterestDialogProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", city: "", phone: "", level: "", source: "", referral: "", reason: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({
        title: t({ pt: "Preencha nome e telefone", en: "Please fill name and phone" }),
        variant: "destructive",
      });
      return;
    }
    toast({
      title: t({ pt: "Recebemos seus dados! 💛", en: "We got your info! 💛" }),
      description: t({
        pt: "Em breve entraremos em contato. Quer adiantar? Fale com a gente no WhatsApp.",
        en: "We'll be in touch soon. Want to chat now? Message us on WhatsApp.",
      }),
    });
    setOpen(false);
    setForm({ name: "", city: "", phone: "", level: "", source: "", referral: "", reason: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {t({ pt: "Tem interesse?", en: "Interested?" })}
          </DialogTitle>
          <DialogDescription>
            {t({
              pt: "Deixe seus dados que entramos em contato com carinho.",
              en: "Leave your details and we'll reach out warmly.",
            })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 pt-2">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">{t({ pt: "Nome *", en: "Name *" })}</Label>
              <Input id="name" maxLength={100} value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">{t({ pt: "Telefone *", en: "Phone *" })}</Label>
              <Input id="phone" type="tel" maxLength={30} value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city">{t({ pt: "Cidade onde mora", en: "City you live in" })}</Label>
            <Input id="city" maxLength={100} value={form.city} onChange={(e) => set("city", e.target.value)} />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t({ pt: "Nível de inglês", en: "English level" })}</Label>
              <Select value={form.level} onValueChange={(v) => set("level", v)}>
                <SelectTrigger><SelectValue placeholder={t({ pt: "Selecione", en: "Select" })} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{t({ pt: "Iniciante", en: "Beginner" })}</SelectItem>
                  <SelectItem value="basic">{t({ pt: "Básico", en: "Basic" })}</SelectItem>
                  <SelectItem value="intermediate">{t({ pt: "Intermediário", en: "Intermediate" })}</SelectItem>
                  <SelectItem value="advanced">{t({ pt: "Avançado", en: "Advanced" })}</SelectItem>
                  <SelectItem value="unsure">{t({ pt: "Não sei dizer", en: "Not sure" })}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t({ pt: "Como chegou até nós?", en: "How did you find us?" })}</Label>
              <Select value={form.source} onValueChange={(v) => set("source", v)}>
                <SelectTrigger><SelectValue placeholder={t({ pt: "Selecione", en: "Select" })} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="referral">{t({ pt: "Indicação", en: "Referral" })}</SelectItem>
                  <SelectItem value="other">{t({ pt: "Outro", en: "Other" })}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="referral">{t({ pt: "Teve indicação? De quem?", en: "Were you referred? By whom?" })}</Label>
            <Input id="referral" maxLength={100} value={form.referral} onChange={(e) => set("referral", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason">{t({ pt: "Motivo para iniciar o inglês", en: "Why do you want to start English?" })}</Label>
            <Textarea id="reason" maxLength={500} rows={3} value={form.reason} onChange={(e) => set("reason", e.target.value)} />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button type="button" variant="outline" className="rounded-full gap-2" asChild>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                {t({ pt: "Mais informações no WhatsApp", en: "More info on WhatsApp" })}
              </a>
            </Button>
            <Button type="submit" className="rounded-full">
              {t({ pt: "Enviar", en: "Send" })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/* ---------------- Page ---------------- */
const LandingPage = () => {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const [active, setActive] = useState(0);

  const TEAM = [
    { name: "Mariana Lopes", role: t({ pt: "Especialista em conversação", en: "Conversation specialist" }), initials: "ML" },
    { name: "Bruno Carvalho", role: t({ pt: "Inglês para negócios", en: "Business English" }), initials: "BC" },
    { name: "Helena Costa", role: t({ pt: "Aulas KIDS", en: "KIDS classes" }), initials: "HC" },
  ];

  const SLIDES = [
    {
      eyebrow: t({ pt: "Sobre mim", en: "About me" }),
      title: t({ pt: "Oi, eu sou sua professora", en: "Hi, I'm your teacher" }),
      body: (
        <>
          <p className="text-muted-foreground leading-relaxed">
            {t({
              pt: <>Eu sou <span className="font-medium text-foreground">Juliana de Andrade</span>, o coração e a voz por trás da ENGage. Há mais de uma década ajudo alunos a pararem de traduzir na cabeça e começarem a <em>pensar</em> em inglês.</>,
              en: <>I'm <span className="font-medium text-foreground">Juliana de Andrade</span>, the heart and voice behind ENGage. For over a decade I've been helping students stop translating in their heads and start <em>thinking</em> in English.</>,
            })}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t({
              pt: "Minha jornada começou como uma aluna tímida — e é exatamente por isso que minhas aulas parecem menos uma palestra e mais uma conversa acolhedora. Cada aluno merece se sentir visto, ouvido e orgulhoso da sua evolução.",
              en: "My journey started as a shy learner myself — and that's exactly why my classes feel less like a lecture and more like a warm conversation. Every student deserves to feel seen, heard and proud of their progress.",
            })}
          </p>
          <p className="text-muted-foreground leading-relaxed italic">
            {t({ pt: "\"Idioma é íntimo. Aprender deveria ser assim também.\"", en: "\"Language is intimate. Learning it should feel that way too.\"" })}
          </p>
        </>
      ),
      visual: (
        <div className="relative aspect-[4/5] w-full max-w-sm mx-auto">
          <div className="absolute -inset-4 bg-primary-soft rounded-[2rem] -rotate-3" />
          <div className="absolute -inset-2 bg-blush rounded-[2rem] rotate-2" />
          <img src={teacherPortrait} alt="Juliana de Andrade" width={768} height={896} loading="lazy"
            className="relative rounded-[2rem] w-full h-full object-cover shadow-xl" />
        </div>
      ),
    },
    {
      eyebrow: t({ pt: "Nosso time", en: "Our team" }),
      title: t({ pt: "Conheça os teachers da ENGage", en: "Meet the ENGage teachers" }),
      body: (
        <>
          <p className="text-muted-foreground leading-relaxed">
            {t({
              pt: "Além da Juliana, contamos com três professores cuidadosamente escolhidos — cada um com uma especialidade diferente para que você encontre a combinação ideal.",
              en: "Beyond Juliana, we have three carefully chosen teachers — each with a different specialty so you can find the perfect match.",
            })}
          </p>
          <div className="space-y-3 pt-2">
            {TEAM.map((teacher) => (
              <div key={teacher.name} className="flex items-center gap-3 p-3 rounded-2xl bg-cream/60">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary-soft text-primary text-sm">{teacher.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-foreground">{teacher.name}</p>
                  <p className="text-xs text-muted-foreground">{teacher.role}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ),
      visual: (
        <div className="relative max-w-sm mx-auto">
          <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-blush via-cream to-primary-soft p-8 shadow-xl flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-medium">
                {t({ pt: "Teacher's team", en: "Teacher's team" })}
              </p>
              <p className="font-serif text-3xl mt-3 leading-tight">
                {t({ pt: <>Quatro vozes,<br /><em>uma missão.</em></>, en: <>Four voices,<br /><em>one mission.</em></> })}
              </p>
            </div>
            <div className="flex -space-x-3">
              {[...TEAM, { name: "Juliana de Andrade", initials: "JA", role: "" }].map((m) => (
                <Avatar key={m.name} className="h-12 w-12 border-2 border-white">
                  <AvatarFallback className="bg-white text-primary text-xs font-semibold">{m.initials}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      eyebrow: t({ pt: "Metodologia", en: "Methodology" }),
      title: t({ pt: "Inglês de verdade, ensinado com leveza", en: "Real English, gently taught" }),
      body: (
        <>
          <p className="text-muted-foreground leading-relaxed">
            {t({
              pt: "Cada aluno é único — seus objetivos, sua rotina e sua confiança moldam o jeito como trabalhamos juntos. Sem livros engessados, sem fórmulas prontas.",
              en: "Every learner is different — your goals, schedule and confidence level shape the way we work together. No rigid textbooks, no one-size-fits-all.",
            })}
          </p>
          <div className="space-y-3 pt-2">
            {(t({
              pt: [
                { t: "Falar desde o primeiro dia", d: "A conversa é o motor. Construímos fluência com diálogo real, não exercícios infinitos." },
                { t: "Ritmo personalizado", d: "As aulas se adaptam à sua semana, ao seu humor e às suas conquistas." },
                { t: "Inglês prático", d: "Viagem, trabalho, entrevistas, amizades — o inglês que você usa de verdade." },
              ],
              en: [
                { t: "Speak from day one", d: "Conversation is the engine. We build fluency through real dialogue, not endless drills." },
                { t: "Personalised pace", d: "Lessons adapt to your week, your mood and your milestones." },
                { t: "Practical English", d: "Travel, work, interviews, friendships — the English you actually live in." },
              ],
            }) as { t: string; d: string }[]).map((i) => (
              <div key={i.t} className="flex gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">{i.t}</p>
                  <p className="text-sm text-muted-foreground">{i.d}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ),
      visual: (
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {[
            { icon: Mic, label: t({ pt: "Fala", en: "Speaking" }) },
            { icon: BookOpen, label: t({ pt: "Conteúdo real", en: "Real content" }) },
            { icon: Heart, label: t({ pt: "Confiança", en: "Confidence" }) },
            { icon: Sparkles, label: t({ pt: "Fluência", en: "Fluency" }) },
          ].map((c) => (
            <div key={c.label} className="aspect-square rounded-3xl bg-gradient-to-br from-primary-soft to-cream flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <c.icon className="w-7 h-7 text-primary" />
              <span className="text-sm font-medium text-foreground">{c.label}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      eyebrow: t({ pt: "Modalidades", en: "Modalities" }),
      title: t({ pt: "Encontre o formato ideal para você", en: "Find the format that fits you" }),
      body: (
        <div className="space-y-4">
          {(t({
            pt: [
              { icon: GraduationCap, title: "VIP — Aulas 1:1", desc: "Aulas totalmente personalizadas. Seus objetivos, seu ritmo, sua agenda. Ideal para evoluir rápido." },
              { icon: Users, title: "Aulas em Grupo", desc: "Grupos pequenos e dinâmicos. Faça amizades, troque histórias e cresça em comunidade." },
              { icon: Baby, title: "KIDS", desc: "Sessões lúdicas e adequadas à idade onde as crianças se apaixonam pelo inglês brincando." },
            ],
            en: [
              { icon: GraduationCap, title: "VIP — 1:1 Classes", desc: "Fully personalised lessons. Your goals, your pace, your schedule. Ideal for fast progress." },
              { icon: Users, title: "Group Classes", desc: "Small, dynamic groups for interactive learning. Make friends, share stories and grow together." },
              { icon: Baby, title: "KIDS", desc: "Playful, age-appropriate sessions where children fall in love with English through games and stories." },
            ],
          }) as { icon: typeof Users; title: string; desc: string }[]).map((m) => (
            <div key={m.title} className="flex gap-4 p-4 rounded-2xl bg-cream/60 hover:bg-cream transition-colors">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                <m.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{m.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
      visual: (
        <div className="relative aspect-square w-full max-w-sm mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-blush to-cream rounded-[3rem] rotate-3" />
          <div className="absolute inset-6 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center">
            <div className="text-center space-y-3 px-6">
              <Sparkles className="w-10 h-10 text-primary mx-auto" />
              <p className="font-serif text-2xl">
                {t({ pt: <>Três caminhos,<br />uma jornada</>, en: <>Three paths,<br />one journey</> })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t({ pt: "Escolha o que faz sentido hoje — troque quando quiser.", en: "Choose what feels right today — switch anytime." })}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      eyebrow: t({ pt: "O que está incluso", en: "What's included" }),
      title: t({ pt: "Tudo o que você precisa para evoluir", en: "Everything you need to thrive" }),
      body: (
        <div className="grid sm:grid-cols-2 gap-4">
          {(t({
            pt: [
              { icon: BookOpen, t: "Acesso à plataforma", d: "Sua dashboard com aulas, progresso e materiais." },
              { icon: Sparkles, t: "Materiais extras", d: "PDFs, áudios e exercícios entre as aulas." },
              { icon: Briefcase, t: "Preparação para entrevistas", d: "Coaching para emprego, visto, au pair e universidade." },
              { icon: LifeBuoy, t: "Suporte contínuo", d: "Me mande mensagem entre as aulas — estou aqui pelas dúvidas." },
              { icon: Heart, t: "Comunidade", d: "Um círculo acolhedor de alunos torcendo por você." },
              { icon: Star, t: "Eventos exclusivos", d: "Clubes de conversação, noites temáticas e clubes de leitura." },
            ],
            en: [
              { icon: BookOpen, t: "Platform access", d: "Your own dashboard with classes, progress and materials." },
              { icon: Sparkles, t: "Extra materials", d: "Curated PDFs, audios and exercises between lessons." },
              { icon: Briefcase, t: "Interview prep", d: "Job, visa, au pair and university interview coaching." },
              { icon: LifeBuoy, t: "Ongoing support", d: "Message me between classes — I'm here for the doubts." },
              { icon: Heart, t: "Community", d: "A warm circle of learners cheering you on." },
              { icon: Star, t: "Exclusive events", d: "Live conversation clubs, themed nights and book chats." },
            ],
          }) as { icon: typeof BookOpen; t: string; d: string }[]).map((f) => (
            <div key={f.t} className="p-4 rounded-2xl border border-border/60 bg-white/60 hover:bg-white transition-colors">
              <f.icon className="w-5 h-5 text-primary mb-2" />
              <p className="font-medium text-sm text-foreground">{f.t}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      ),
      visual: (
        <div className="relative max-w-sm mx-auto">
          <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-cream to-primary-soft p-8 shadow-xl flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-medium">
                {t({ pt: "Tudo em um", en: "All in one" })}
              </p>
              <p className="font-serif text-3xl mt-3 leading-tight">
                {t({ pt: <>Uma<br />experiência<br /><em>completa.</em></>, en: <>A complete<br />learning<br /><em>experience.</em></> })}
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-white/70 rounded-full w-full" />
              <div className="h-2 bg-white/70 rounded-full w-4/5" />
              <div className="h-2 bg-white/70 rounded-full w-3/5" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 7000);
    return () => clearInterval(id);
  }, [SLIDES.length]);

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + SLIDES.length) % SLIDES.length);

  const TESTIMONIALS = t({
    pt: [
      { name: "Camila R.", text: "A ENGage transformou meu jeito de aprender inglês. Em poucos meses já falo com confiança." },
      { name: "Pedro M.", text: "As aulas da Juliana são acolhedoras e divertidas. Eu espero ansioso por cada uma." },
      { name: "Ana L.", text: "Minha filha adora as aulas KIDS — corre para o computador toda semana!" },
    ],
    en: [
      { name: "Camila R.", text: "ENGage changed how I learn English. In a few months I'm speaking with real confidence." },
      { name: "Pedro M.", text: "Juliana's classes are warm and fun. I actually look forward to every lesson." },
      { name: "Ana L.", text: "My daughter adores the KIDS classes — she runs to her laptop every week!" },
    ],
  });

  const INSTAGRAM_POSTS = [
    { gradient: "from-primary-soft via-blush to-cream", caption: t({ pt: "5 frases para sua entrevista", en: "5 phrases for your next interview" }) },
    { gradient: "from-cream to-primary-soft", caption: t({ pt: "Palavra da semana ✨", en: "Word of the week ✨" }) },
    { gradient: "from-blush to-sand", caption: t({ pt: "Bastidores", en: "Behind the scenes" }) },
    { gradient: "from-sand to-cream", caption: t({ pt: "Aluno em destaque 💛", en: "Student spotlight 💛" }) },
    { gradient: "from-primary-soft to-sand", caption: t({ pt: "Dica de pronúncia", en: "Pronunciation tip" }) },
    { gradient: "from-cream via-blush to-primary-soft", caption: t({ pt: "Conversa real em inglês", en: "Real talk in English" }) },
  ];

  const LangToggle = () => (
    <div className="inline-flex items-center rounded-full border border-border/60 bg-white/70 backdrop-blur p-0.5 text-xs">
      <button
        onClick={() => setLang("pt")}
        className={`px-2.5 py-1 rounded-full transition-colors ${lang === "pt" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        aria-label="Português"
      >PT</button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        aria-label="English"
      >EN</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="absolute top-0 inset-x-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src={engageLogo} alt="ENGage" className="h-10 w-10 object-contain rounded-full" />
            <div className="leading-tight">
              <p className="font-serif text-xl tracking-tight">EN<span className="text-primary">gage</span></p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Juliana de Andrade</p>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              {t({ pt: "Entrar", en: "Sign in" })}
            </Button>
            <InterestDialog
              trigger={
                <Button size="sm" className="rounded-full">
                  {t({ pt: "Inscreva-se", en: "Join now" })}
                </Button>
              }
            />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-background to-primary-soft/40" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary-soft rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-blush rounded-full blur-3xl opacity-50" />

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-7 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-border/60 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            {t({ pt: "Inglês que parece um abraço", en: "English that feels like home" })}
          </span>
          <div className="flex justify-center">
            <img src={engageLogo} alt="ENGage — Juliana de Andrade" className="h-28 w-28 md:h-32 md:w-32 object-contain rounded-full shadow-md" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
            {t({
              pt: <>Fale inglês<br /><span className="italic text-primary">com confiança.</span></>,
              en: <>Speak English<br /><span className="italic text-primary">with confidence.</span></>,
            })}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t({
              pt: "Aulas personalizadas para adultos e crianças. Acolhedoras, reais e feitas para o jeito que você vive.",
              en: "Personalised English classes for adults and children. Warm, real and made for the way you actually live.",
            })}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <InterestDialog
              trigger={
                <Button size="lg" className="rounded-full gap-2 px-7 shadow-md">
                  <Heart className="w-4 h-4" />
                  {t({ pt: "Tem interesse?", en: "Interested?" })}
                </Button>
              }
            />
            <Button variant="ghost" size="lg" className="rounded-full gap-2" onClick={() => navigate("/login")}>
              {t({ pt: "Acessar a plataforma", en: "Enter the platform" })}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
            {t({ pt: "Conheça a ENGage", en: "Discover ENGage" })}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">{t({ pt: "Um olhar mais de perto", en: "A closer look" })}</h2>
        </div>

        <div className="relative rounded-[2rem] bg-gradient-to-br from-cream/80 to-white border border-border/60 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-14 min-h-[560px] items-center">
            <div key={`text-${active}-${lang}`} className="space-y-5 animate-fade-in order-2 md:order-1">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">{SLIDES[active].eyebrow}</p>
              <h3 className="font-serif text-3xl md:text-4xl leading-tight">{SLIDES[active].title}</h3>
              <div className="space-y-3">{SLIDES[active].body}</div>
            </div>
            <div key={`vis-${active}-${lang}`} className="animate-fade-in order-1 md:order-2">
              {SLIDES[active].visual}
            </div>
          </div>

          <div className="flex items-center justify-between px-6 md:px-10 pb-6">
            <div className="flex gap-2">
              {SLIDES.map((s, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={s.eyebrow}
                  className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => go(-1)} aria-label="Previous">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => go(1)} aria-label="Next">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-background to-cream/50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
              {t({ pt: "Palavras carinhosas", en: "Kind words" })}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">
              {t({ pt: "Histórias dos nossos alunos", en: "Stories from our students" })}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tst) => (
              <Card key={tst.name} className="rounded-3xl border-border/60 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-8 pb-7 space-y-4">
                  <Quote className="w-6 h-6 text-primary/60" />
                  <p className="text-sm text-foreground leading-relaxed">"{tst.text}"</p>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs bg-primary-soft text-primary">
                        {tst.name.split(" ").map((w) => w[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{tst.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium flex items-center gap-2">
              <Instagram className="w-4 h-4" /> {t({ pt: "Acompanhe", en: "Follow along" })}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">{INSTAGRAM_HANDLE}</h2>
            <p className="text-muted-foreground text-sm max-w-md">
              {t({ pt: "Dicas diárias, bastidores, conquistas dos alunos e um toque de magia.", en: "Daily tips, behind the scenes, student wins and a little bit of magic." })}
            </p>
          </div>
          <Button variant="outline" className="rounded-full self-start md:self-auto" asChild>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <Instagram className="w-4 h-4" /> {t({ pt: "Seguir no Instagram", en: "Follow on Instagram" })}
            </a>
          </Button>
        </div>

        <div className="rounded-3xl border border-border/60 overflow-hidden bg-cream/30">
          <iframe
            src="https://www.instagram.com/teacherjulianaandrade/embed"
            className="w-full h-[600px] md:h-[700px]"
            frameBorder="0"
            scrolling="no"
            allowTransparency
            title="Instagram @teacherjulianaandrade"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-primary-soft via-blush to-cream p-12 md:p-16 text-center space-y-6 shadow-sm">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight">
            {t({
              pt: <>Pronta para se apaixonar<br /><span className="italic">pelo inglês?</span></>,
              en: <>Ready to fall in love<br /><span className="italic">with English?</span></>,
            })}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t({
              pt: "Deixe seus dados e vamos planejar sua primeira aula juntas. Sem pressão — só um oi acolhedor.",
              en: "Leave your details and let's plan your first class together. No pressure — just a warm hello.",
            })}
          </p>
          <InterestDialog
            trigger={
              <Button size="lg" className="rounded-full gap-2 px-8 shadow-md">
                <Heart className="w-5 h-5" />
                {t({ pt: "Tem interesse?", en: "Interested?" })}
              </Button>
            }
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground space-y-4">
        <p className="font-serif text-lg text-foreground">EN<span className="text-primary">gage</span></p>
        <div className="flex items-center justify-center gap-3">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Languages className="w-3 h-3" />
          <LangToggle />
        </div>
        <p>© {new Date().getFullYear()} ENGage — Juliana de Andrade — {t({ pt: "Feito com carinho.", en: "Made with love." })}</p>
      </footer>
    </div>
  );
};

export default LandingPage;
