import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging, AnnouncementAudience } from "@/contexts/MessagingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pin, Megaphone, Heart, Trash2, ImagePlus, Search, Users, GraduationCap, Globe } from "lucide-react";

const audienceMeta: Record<AnnouncementAudience, { label: string; icon: React.ElementType; color: string }> = {
  all: { label: "Everyone", icon: Globe, color: "bg-primary/10 text-primary" },
  teachers: { label: "Teachers only", icon: GraduationCap, color: "bg-blue-500/10 text-blue-600" },
  students: { label: "Students only", icon: Users, color: "bg-pink-500/10 text-pink-600" },
};

const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(ts).toLocaleDateString();
};

const Announcements = () => {
  const { user } = useAuth();
  const { visibleAnnouncementsFor, postAnnouncement, togglePin, toggleLike, deleteAnnouncement, markAnnouncementRead } = useMessaging();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audience, setAudience] = useState<AnnouncementAudience>("all");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pinned" | "unread">("all");

  const isAdmin = user?.role === "admin";
  const visible = user ? visibleAnnouncementsFor(user.role) : [];

  useEffect(() => {
    if (!user) return;
    visible.forEach((a) => { if (!a.readBy.includes(user.id)) markAnnouncementRead(a.id, user.id); });
  }, [visible, user, markAnnouncementRead]);

  const sorted = useMemo(() => {
    let list = [...visible];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q));
    }
    if (filter === "pinned") list = list.filter((a) => a.pinned);
    if (filter === "unread" && user) list = list.filter((a) => !a.readBy.includes(user.id));
    return list.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.timestamp - a.timestamp);
  }, [visible, search, filter, user]);

  if (!user) return null;

  const handlePost = () => {
    if (!title.trim() || !body.trim()) return;
    postAnnouncement({ authorId: user.id, authorName: user.name, title, body, imageUrl: imageUrl || undefined, audience, pinned: false });
    setTitle(""); setBody(""); setImageUrl(""); setAudience("all");
  };

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.readAsDataURL(f);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mural</h1>
            <p className="text-sm text-muted-foreground">Community feed and announcements</p>
          </div>
        </div>

        {isAdmin && (
          <Card className="mb-6 border-border/60">
            <CardContent className="pt-5 space-y-3">
              <Input placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
              <Textarea placeholder="What would you like to share?" value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={2000} />
              {imageUrl && (
                <div className="relative">
                  <img src={imageUrl} alt="preview" className="rounded-lg max-h-60 w-full object-cover" />
                  <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={() => setImageUrl("")}>Remove</Button>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
                  <span className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-md border hover:bg-muted">
                    <ImagePlus className="w-4 h-4" /> Image
                  </span>
                </label>
                <Select value={audience} onValueChange={(v) => setAudience(v as AnnouncementAudience)}>
                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌐 Everyone</SelectItem>
                    <SelectItem value="teachers">🎓 Teachers only</SelectItem>
                    <SelectItem value="students">👥 Students only</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handlePost} disabled={!title.trim() || !body.trim()} className="ml-auto">Publish</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search announcements..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pinned">Pinned</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {sorted.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">Nothing here yet</p>
          )}
          {sorted.map((a) => {
            const meta = audienceMeta[a.audience];
            const Icon = meta.icon;
            const liked = a.likedBy.includes(user.id);
            return (
              <Card key={a.id} className={`overflow-hidden transition-all hover:shadow-md ${a.pinned ? "border-primary/40 bg-primary/[0.02]" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                      {a.authorName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm">{a.authorName}</span>
                        <span className="text-xs text-muted-foreground">• {timeAgo(a.timestamp)}</span>
                        <Badge variant="secondary" className={`gap-1 ${meta.color} border-0`}>
                          <Icon className="w-3 h-3" /> {meta.label}
                        </Badge>
                        {a.pinned && (
                          <Badge variant="outline" className="gap-1"><Pin className="w-3 h-3" /> Pinned</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold mt-2 text-base">{a.title}</h3>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed mt-1 text-foreground/90">{a.body}</p>
                    </div>
                  </div>

                  {a.imageUrl && (
                    <img src={a.imageUrl} alt={a.title} className="rounded-lg mt-3 max-h-96 w-full object-cover" />
                  )}

                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/60">
                    <Button variant="ghost" size="sm" onClick={() => toggleLike(a.id, user.id)} className={liked ? "text-rose-500" : ""}>
                      <Heart className={`w-4 h-4 mr-1 ${liked ? "fill-current" : ""}`} />
                      {a.likedBy.length > 0 ? a.likedBy.length : ""}
                    </Button>
                    {isAdmin && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => togglePin(a.id)}>
                          <Pin className="w-4 h-4 mr-1" /> {a.pinned ? "Unpin" : "Pin"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteAnnouncement(a.id)} className="text-destructive hover:text-destructive ml-auto">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Announcements;
