import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MessageCircle, Users, GraduationCap, Baby, Mic, ArrowRight,
  Instagram, Facebook, Youtube, Sparkles, BookOpen, Heart,
  Briefcase, LifeBuoy, Star, ChevronLeft, ChevronRight, Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import teacherPortrait from "@/assets/teacher-portrait.jpg";

const WHATSAPP_LINK = "https://wa.me/5500000000000?text=Hi! I'd love to know more about ENGage classes.";
const INSTAGRAM_HANDLE = "@engage.english";

const SOCIAL_LINKS = [
  { icon: Instagram, href: "https://instagram.com/", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com/", label: "YouTube" },
];

type Slide = {
  eyebrow: string;
  title: string;
  body: React.ReactNode;
  visual: React.ReactNode;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "About me",
    title: "Hi, I'm your teacher",
    body: (
      <>
        <p className="text-muted-foreground leading-relaxed">
          I'm <span className="font-medium text-foreground">Sophia</span>, the heart and voice
          behind ENGage. For over a decade I've been helping students stop translating in
          their heads and start <em>thinking</em> in English.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          My journey started as a shy learner myself — and that's exactly why my classes
          feel less like a lecture and more like a warm conversation. I believe every
          student deserves to feel seen, heard and proud of their progress.
        </p>
        <p className="text-muted-foreground leading-relaxed italic">
          "Language is intimate. Learning it should feel that way too."
        </p>
      </>
    ),
    visual: (
      <div className="relative aspect-[4/5] w-full max-w-sm mx-auto">
        <div className="absolute -inset-4 bg-primary-soft rounded-[2rem] -rotate-3" />
        <div className="absolute -inset-2 bg-blush rounded-[2rem] rotate-2" />
        <img
          src={teacherPortrait}
          alt="Sophia, founder of ENGage"
          width={768}
          height={896}
          loading="lazy"
          className="relative rounded-[2rem] w-full h-full object-cover shadow-xl"
        />
      </div>
    ),
  },
  {
    eyebrow: "Methodology",
    title: "Real English, gently taught",
    body: (
      <>
        <p className="text-muted-foreground leading-relaxed">
          Every learner is different — your goals, schedule and confidence level shape
          the way we work together. No rigid textbooks, no one-size-fits-all.
        </p>
        <div className="space-y-3 pt-2">
          {[
            { t: "Speak from day one", d: "Conversation is the engine. We build fluency through real dialogue, not endless drills." },
            { t: "Personalised pace", d: "Lessons adapt to your week, your mood and your milestones." },
            { t: "Practical English", d: "Travel, work, interviews, dating, friendships — the English you actually live in." },
          ].map((i) => (
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
          { icon: Mic, label: "Speaking" },
          { icon: BookOpen, label: "Real content" },
          { icon: Heart, label: "Confidence" },
          { icon: Sparkles, label: "Fluency" },
        ].map((c, i) => (
          <div
            key={c.label}
            className="aspect-square rounded-3xl bg-gradient-to-br from-primary-soft to-cream flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <c.icon className="w-7 h-7 text-primary" />
            <span className="text-sm font-medium text-foreground">{c.label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    eyebrow: "Modalities",
    title: "Find the format that fits you",
    body: (
      <div className="space-y-4">
        {[
          {
            icon: GraduationCap,
            title: "VIP — 1:1 Classes",
            desc: "Fully personalised lessons. Your goals, your pace, your schedule. Ideal for fast progress and focused practice.",
          },
          {
            icon: Users,
            title: "Group Classes",
            desc: "Small, dynamic groups for interactive learning. Make friends, share stories and grow together.",
          },
          {
            icon: Baby,
            title: "KIDS",
            desc: "Playful, age-appropriate sessions where children fall in love with English through games and stories.",
          },
        ].map((m) => (
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
            <p className="font-serif text-2xl">Three paths,<br/>one journey</p>
            <p className="text-xs text-muted-foreground">Choose what feels right today — switch anytime.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "What's included",
    title: "Everything you need to thrive",
    body: (
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: BookOpen, t: "Platform access", d: "Your own dashboard with classes, progress and materials." },
          { icon: Sparkles, t: "Extra materials", d: "Curated PDFs, audios and exercises between lessons." },
          { icon: Briefcase, t: "Interview prep", d: "Job, visa, au pair and university interview coaching." },
          { icon: LifeBuoy, t: "Ongoing support", d: "Message me between classes — I'm here for the doubts." },
          { icon: Heart, t: "Community", d: "A warm circle of learners cheering you on." },
          { icon: Star, t: "Exclusive events", d: "Live conversation clubs, themed nights and book chats." },
        ].map((f) => (
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
            <p className="text-xs uppercase tracking-widest text-primary font-medium">All in one</p>
            <p className="font-serif text-3xl mt-3 leading-tight">
              A complete<br />learning<br /><em>experience.</em>
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

const TESTIMONIALS = [
  { name: "Camila R.", text: "ENGage changed how I learn English. In a few months I'm speaking with real confidence." },
  { name: "Pedro M.", text: "Sophia's classes are warm and fun. I actually look forward to every lesson." },
  { name: "Ana L.", text: "My daughter adores the KIDS classes — she runs to her laptop every week!" },
];

const INSTAGRAM_POSTS = [
  { gradient: "from-primary-soft via-blush to-cream", caption: "5 phrases for your next interview" },
  { gradient: "from-cream to-primary-soft", caption: "Word of the week ✨" },
  { gradient: "from-blush to-sand", caption: "Behind the scenes" },
  { gradient: "from-sand to-cream", caption: "Student spotlight 💛" },
  { gradient: "from-primary-soft to-sand", caption: "Pronunciation tip" },
  { gradient: "from-cream via-blush to-primary-soft", caption: "Real talk in English" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 7000);
    return () => clearInterval(id);
  }, []);

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + SLIDES.length) % SLIDES.length);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="absolute top-0 inset-x-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="font-serif text-2xl tracking-tight">
            EN<span className="text-primary">gage</span>
          </a>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign in</Button>
            <Button size="sm" className="rounded-full" asChild>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">Join now</a>
            </Button>
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
            English that feels like home
          </span>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
            Speak English<br />
            <span className="italic text-primary">with confidence.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Personalised English classes for adults and children. Warm, real and made for the way you actually live.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="lg" className="rounded-full gap-2 px-7 shadow-md" asChild>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </Button>
            <Button variant="ghost" size="lg" className="rounded-full gap-2" onClick={() => navigate("/login")}>
              Enter the platform
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Discover ENGage</p>
          <h2 className="font-serif text-3xl md:text-4xl">A closer look</h2>
        </div>

        <div className="relative rounded-[2rem] bg-gradient-to-br from-cream/80 to-white border border-border/60 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-14 min-h-[560px] items-center">
            <div key={`text-${active}`} className="space-y-5 animate-fade-in order-2 md:order-1">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                {SLIDES[active].eyebrow}
              </p>
              <h3 className="font-serif text-3xl md:text-4xl leading-tight">
                {SLIDES[active].title}
              </h3>
              <div className="space-y-3">{SLIDES[active].body}</div>
            </div>
            <div key={`vis-${active}`} className="animate-fade-in order-1 md:order-2">
              {SLIDES[active].visual}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-6 md:px-10 pb-6">
            <div className="flex gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.eyebrow}
                  onClick={() => setActive(i)}
                  aria-label={`Go to ${s.eyebrow}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-8 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                  }`}
                />
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
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Kind words</p>
            <h2 className="font-serif text-3xl md:text-4xl">Stories from our students</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="rounded-3xl border-border/60 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-8 pb-7 space-y-4">
                  <Quote className="w-6 h-6 text-primary/60" />
                  <p className="text-sm text-foreground leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs bg-primary-soft text-primary">
                        {t.name.split(" ").map((w) => w[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{t.name}</span>
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
              <Instagram className="w-4 h-4" /> Follow along
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">{INSTAGRAM_HANDLE}</h2>
            <p className="text-muted-foreground text-sm max-w-md">Daily tips, behind the scenes, student wins and a little bit of magic.</p>
          </div>
          <Button variant="outline" className="rounded-full self-start md:self-auto" asChild>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-4 h-4" /> Follow on Instagram
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {INSTAGRAM_POSTS.map((p, i) => (
            <a
              key={i}
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden block"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} transition-transform duration-500 group-hover:scale-110`} />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center p-4">
                <div className="text-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Instagram className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs font-medium">{p.caption}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-primary-soft via-blush to-cream p-12 md:p-16 text-center space-y-6 shadow-sm">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight">
            Ready to fall in love<br /><span className="italic">with English?</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Send a message and let's plan your first class together. No pressure — just a warm hello.
          </p>
          <Button size="lg" className="rounded-full gap-2 px-8 shadow-md" asChild>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              Start the conversation
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground space-y-4">
        <p className="font-serif text-lg text-foreground">EN<span className="text-primary">gage</span></p>
        <div className="flex items-center justify-center gap-3">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <s.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
        <p>© {new Date().getFullYear()} ENGage — Made with love.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
