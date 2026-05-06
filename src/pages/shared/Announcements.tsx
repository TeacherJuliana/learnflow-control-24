import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/contexts/MessagingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pin, Megaphone } from "lucide-react";

const Announcements = () => {
  const { user } = useAuth();
  const { announcements, postAnnouncement, togglePin, markAnnouncementRead } = useMessaging();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!user) return;
    announcements.forEach((a) => { if (!a.readBy.includes(user.id)) markAnnouncementRead(a.id, user.id); });
  }, [announcements, user, markAnnouncementRead]);

  if (!user) return null;
  const isAdmin = user.role === "admin";

  const handlePost = () => {
    if (!title.trim() || !body.trim()) return;
    postAnnouncement({ authorId: user.id, authorName: user.name, title, body, imageUrl: imageUrl || undefined, pinned: false });
    setTitle(""); setBody(""); setImageUrl("");
  };

  const sorted = [...announcements].sort((a, b) =>
    Number(b.pinned) - Number(a.pinned) || b.timestamp - a.timestamp
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-3">
        <Megaphone className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-sm text-muted-foreground">Updates and important notices</p>
        </div>
      </div>

      {isAdmin && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Post a new announcement</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
            <Textarea placeholder="Write your announcement..." value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={2000} />
            <Input placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            <Button onClick={handlePost} disabled={!title.trim() || !body.trim()}>Publish</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sorted.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No announcements yet</p>}
        {sorted.map((a) => (
          <Card key={a.id} className={a.pinned ? "border-primary/50" : ""}>
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  {a.pinned && <Badge variant="secondary" className="gap-1"><Pin className="w-3 h-3" /> Pinned</Badge>}
                  <CardTitle className="text-lg">{a.title}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {a.authorName} • {new Date(a.timestamp).toLocaleString()}
                </p>
              </div>
              {isAdmin && (
                <Button variant="ghost" size="sm" onClick={() => togglePin(a.id)}>
                  <Pin className="w-4 h-4 mr-1" /> {a.pinned ? "Unpin" : "Pin"}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="rounded-lg mb-3 max-h-80 w-full object-cover" />}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{a.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Announcements;
