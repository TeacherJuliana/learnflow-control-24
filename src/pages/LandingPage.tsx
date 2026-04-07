import { useNavigate } from "react-router-dom";
import { MessageCircle, Users, GraduationCap, Baby, CalendarCheck, Mic, ArrowRight, Instagram, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const WHATSAPP_LINK = "https://wa.me/5500000000000?text=Olá! Gostaria de saber mais sobre as aulas de inglês.";

const SOCIAL_LINKS = [
  { icon: Instagram, href: "https://instagram.com/", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com/", label: "YouTube" },
];

const TESTIMONIALS = [
  {
    name: "Camila R.",
    text: "As aulas VIP mudaram minha forma de aprender inglês. Em poucos meses já consigo me comunicar com confiança!",
  },
  {
    name: "Pedro M.",
    text: "A turma é super dinâmica e o professor torna tudo mais fácil. Recomendo demais!",
  },
  {
    name: "Ana L.",
    text: "Meu filho adora as aulas Kids! Ele aprende brincando e já fala várias palavras em inglês.",
  },
  {
    name: "Rafael S.",
    text: "Flexibilidade de horários e método focado na conversação. Exatamente o que eu precisava.",
  },
];

const STEPS = [
  { icon: Users, title: "Escolha sua modalidade", desc: "VIP, turma ou kids" },
  { icon: CalendarCheck, title: "Defina seus horários", desc: "Flexibilidade total para sua rotina" },
  { icon: Mic, title: "Comece a se comunicar", desc: "Desde a primeira aula" },
];

const CLASS_TYPES = [
  {
    icon: GraduationCap,
    title: "Aulas VIP",
    desc: "Aulas individuais focadas nas suas necessidades e objetivos pessoais.",
  },
  {
    icon: Users,
    title: "Aulas em turma",
    desc: "Aprenda em grupo com interação, dinâmicas e conversação entre colegas.",
  },
  {
    icon: Baby,
    title: "Aulas para crianças",
    desc: "Metodologia lúdica e divertida para crianças aprenderem inglês naturalmente.",
  },
];

const TEAM = [
  {
    name: "Teacher Principal",
    role: "Fundador & Professor",
    desc: "Apaixonado por ensinar inglês de forma prática e comunicativa.",
    initials: "TP",
  },
  {
    name: "Maria Silva",
    role: "Professora",
    desc: "Especialista em conversação e preparação para exames internacionais.",
    initials: "MS",
  },
  {
    name: "Carlos Mendes",
    role: "Professor Kids",
    desc: "Educador infantil com foco em aprendizado lúdico e criativo.",
    initials: "CM",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Comece sua jornada no inglês
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aulas de inglês personalizadas para adultos e crianças. Aprenda a se comunicar de verdade, no seu ritmo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2 text-base px-8" asChild>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                Entre em contato pelo WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 text-base" onClick={() => navigate("/login")}>
              Entrar na plataforma
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Class Types */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Nossas aulas</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {CLASS_TYPES.map((ct) => (
            <Card key={ct.title} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <ct.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{ct.title}</h3>
                <p className="text-sm text-muted-foreground">{ct.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.title} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">O que nossos alunos dizem</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {t.name.split(" ").map((w) => w[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{t.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Conheça nossa equipe</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-sm">
            Somos uma equipe apaixonada por ensinar idiomas de forma leve, prática e focada na comunicação real. Nosso objetivo é ajudar você a se sentir confiante para usar o inglês no seu dia a dia.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <Card key={member.name} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-8 pb-6 space-y-3">
                  <Avatar className="h-16 w-16 mx-auto">
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">Pronto para começar?</h2>
        <p className="text-muted-foreground">Entre em contato agora e agende sua primeira aula.</p>
        <Button size="lg" className="gap-2 text-base px-8" asChild>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-5 h-5" />
            Entre em contato pelo WhatsApp
          </a>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-xs text-muted-foreground space-y-4">
        <div className="flex items-center justify-center gap-4">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <p>© {new Date().getFullYear()} EduFlow — Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
