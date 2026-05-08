import { useAuth } from "@/contexts/AuthContext";
import { useMessaging, Announcement } from "@/contexts/MessagingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Pin, ArrowRight, Globe, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const audienceMeta = {
  all: { label: "Todos", icon: Globe, color: "bg-primary/10 text-primary" },
  teachers: { label: "Teachers", icon: GraduationCap, color: "bg-blue-500/10 text-blue-600" },
  students: { label: "Alunos", icon: Users, color: "bg-pink-500/10 text-pink-600" },
} as const;

const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "agora";
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(ts).toLocaleDateString("pt-BR");
};

const RecentAnnouncements = ({ limit = 3 }: { limit?: number }) => {
  const { user } = useAuth();
  const { visibleAnnouncementsFor, markAnnouncementRead } = useMessaging();
  const navigate = useNavigate();

  if (!user) return null;

  const visible = visibleAnnouncementsFor(user.role);
  const sorted = [...visible]
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.timestamp - a.timestamp)
    .slice(0, limit);

  const handleClick = (a: Announcement) => {
    if (!a.readBy.includes(user.id)) markAnnouncementRead(a.id, user.id);
    navigate("/announcements");
  };

  if (sorted.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Mural</h2>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={() => navigate("/announcements")}>
          Ver todos <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="space-y-3">
        {sorted.map((a) => {
          const meta = audienceMeta[a.audience];
          const Icon = meta.icon;
          const unread = !a.readBy.includes(user.id);

          return (
            <Card
              key={a.id}
              className={`overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${
                a.pinned ? "border-primary/30 bg-primary/[0.02]" : ""
              } ${unread ? "ring-1 ring-primary/20" : ""}`}
              onClick={() => handleClick(a)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                    {a.authorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{a.authorName}</span>
                      <span className="text-xs text-muted-foreground">• {timeAgo(a.timestamp)}</span>
                      <Badge variant="secondary" className={`gap-1 text-[10px] px-1.5 py-0 ${meta.color} border-0`}>
                        <Icon className="w-3 h-3" /> {meta.label}
                      </Badge>
                      {a.pinned && (
                        <Badge variant="outline" className="gap-1 text-[10px] px-1.5 py-0">
                          <Pin className="w-3 h-3" /> Fixado
                        </Badge>
                      )}
                      {unread && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm leading-snug">{a.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                      {a.body}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAnnouncements;
