import { useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging, conversationId, DIRECTORY } from "@/contexts/MessagingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Search, Send, MessageCircle } from "lucide-react";

const formatTime = (ts: number) => {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString())
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
};

const Inbox = () => {
  const { user } = useAuth();
  const { messages, conversationsFor, sendMessage, markConversationRead, allowedContactsFor } = useMessaging();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!user) return null;
  const me = { id: user.id, name: user.name, role: user.role };
  const conversations = conversationsFor(user.id);
  const filtered = conversations.filter((c) => {
    if (filter === "unread" && c.unread === 0) return false;
    if (search && !c.other.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeContact = activeId ? DIRECTORY.find((u) => u.id === activeId) : null;
  const activeMessages = useMemo(() => {
    if (!activeId) return [];
    const cid = conversationId(user.id, activeId);
    return messages.filter((m) => m.conversationId === cid).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, activeId, user.id]);

  useEffect(() => {
    if (activeId) markConversationRead(activeId, user.id);
  }, [activeId, activeMessages.length, markConversationRead, user.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeMessages.length]);

  const handleSend = () => {
    if (!activeId || !text.trim()) return;
    sendMessage(activeId, user.id, text);
    setText("");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeId) return;
    if (file.size > 2 * 1024 * 1024) { alert("File must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      sendMessage(activeId, user.id, "", { name: file.name, dataUrl: reader.result as string, type: file.type });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <p className="text-sm text-muted-foreground">Direct messages with {allowedContactsFor(me).length} contacts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-220px)] border rounded-lg overflow-hidden bg-card">
        {/* Sidebar list */}
        <div className="border-r flex flex-col">
          <div className="p-3 space-y-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
              <Button size="sm" variant={filter === "unread" ? "default" : "outline"} onClick={() => setFilter("unread")}>Unread</Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && <p className="p-4 text-sm text-muted-foreground">No conversations</p>}
            {filtered.map((c) => (
              <button
                key={c.other.id}
                onClick={() => setActiveId(c.other.id)}
                className={`w-full text-left px-3 py-3 border-b hover:bg-accent flex items-center gap-3 ${activeId === c.other.id ? "bg-accent" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {c.other.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <p className="text-sm font-medium truncate">{c.other.name}</p>
                    {c.lastMessage && <span className="text-[10px] text-muted-foreground shrink-0">{formatTime(c.lastMessage.timestamp)}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.lastMessage?.text || (c.lastMessage?.attachment ? "📎 attachment" : <span className="italic">{c.other.role}</span>)}
                  </p>
                </div>
                {c.unread > 0 && <Badge className="ml-2">{c.unread}</Badge>}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex flex-col min-w-0">
          {!activeContact ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {activeContact.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{activeContact.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{activeContact.role}</p>
                </div>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
                {activeMessages.length === 0 && <p className="text-center text-sm text-muted-foreground">No messages yet. Say hi 👋</p>}
                {activeMessages.map((m) => {
                  const mine = m.senderId === user.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${mine ? "bg-primary text-primary-foreground" : "bg-background border"}`}>
                        {m.text && <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>}
                        {m.attachment && (
                          m.attachment.type.startsWith("image/") ? (
                            <img src={m.attachment.dataUrl} alt={m.attachment.name} className="max-w-full rounded mt-1" />
                          ) : (
                            <a href={m.attachment.dataUrl} download={m.attachment.name} className="underline text-xs flex items-center gap-1 mt-1">
                              <Paperclip className="w-3 h-3" /> {m.attachment.name}
                            </a>
                          )
                        )}
                        <div className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/70" : "text-muted-foreground"} flex justify-end gap-1`}>
                          {formatTime(m.timestamp)}
                          {mine && <span>{m.readBy.includes(activeContact.id) ? "✓✓" : "✓"}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t flex gap-2 items-end">
                <input ref={fileRef} type="file" hidden onChange={handleFile} accept="image/*,.pdf,.doc,.docx" />
                <Button variant="ghost" size="icon" onClick={() => fileRef.current?.click()}>
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Write a message..."
                />
                <Button onClick={handleSend} disabled={!text.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inbox;
