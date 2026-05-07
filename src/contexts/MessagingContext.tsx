import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { UserRole } from "./AuthContext";

export interface ChatUser {
  id: string;
  name: string;
  role: UserRole;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  attachment?: { name: string; dataUrl: string; type: string };
  timestamp: number;
  readBy: string[];
}

export type AnnouncementAudience = "all" | "teachers" | "students";

export interface Announcement {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  imageUrl?: string;
  audience: AnnouncementAudience;
  pinned: boolean;
  timestamp: number;
  readBy: string[];
  likedBy: string[];
}

// Demo directory of users (matches AuthContext demo users + extras)
export const DIRECTORY: ChatUser[] = [
  { id: "1", name: "Admin", role: "admin" },
  { id: "2", name: "Prof. Maria Silva", role: "teacher" },
  { id: "t2", name: "Prof. Bruno Costa", role: "teacher" },
  { id: "3", name: "João Santos", role: "student" },
  { id: "s2", name: "Ana Oliveira", role: "student" },
  { id: "s3", name: "Carlos Lima", role: "student" },
];

export const conversationId = (a: string, b: string) => [a, b].sort().join("__");

interface Ctx {
  directory: ChatUser[];
  messages: Message[];
  announcements: Announcement[];
  sendMessage: (toId: string, fromId: string, text: string, attachment?: Message["attachment"]) => void;
  markConversationRead: (otherId: string, meId: string) => void;
  postAnnouncement: (a: Omit<Announcement, "id" | "timestamp" | "readBy" | "likedBy">) => void;
  togglePin: (id: string) => void;
  toggleLike: (id: string, meId: string) => void;
  deleteAnnouncement: (id: string) => void;
  markAnnouncementRead: (id: string, meId: string) => void;
  unreadMessagesFor: (meId: string) => number;
  unreadAnnouncementsFor: (meId: string) => number;
  visibleAnnouncementsFor: (role: UserRole) => Announcement[];
  conversationsFor: (meId: string) => { other: ChatUser; lastMessage?: Message; unread: number }[];
  allowedContactsFor: (me: ChatUser) => ChatUser[];
}

const MessagingContext = createContext<Ctx | undefined>(undefined);

const LS_M = "engage_messages_v1";
const LS_A = "engage_announcements_v1";

const seedMessages = (): Message[] => {
  const c1 = conversationId("2", "3");
  const c2 = conversationId("1", "2");
  return [
    { id: "m1", conversationId: c1, senderId: "3", text: "Hi teacher! Can we reschedule tomorrow's class?", timestamp: Date.now() - 3600_000, readBy: ["3"] },
    { id: "m2", conversationId: c1, senderId: "2", text: "Hi João! Sure, what time works for you?", timestamp: Date.now() - 3500_000, readBy: ["2"] },
    { id: "m3", conversationId: c2, senderId: "1", text: "Maria, please confirm next week's schedule.", timestamp: Date.now() - 7200_000, readBy: ["1"] },
  ];
};

const seedAnnouncements = (): Announcement[] => [
  {
    id: "a1",
    authorId: "1",
    authorName: "Admin",
    title: "Welcome to ENGage!",
    body: "Use this space to find platform updates, schedule changes and important reminders.",
    pinned: true,
    timestamp: Date.now() - 86400_000,
    readBy: [],
  },
];

export const MessagingProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try { const r = localStorage.getItem(LS_M); return r ? JSON.parse(r) : seedMessages(); } catch { return seedMessages(); }
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try { const r = localStorage.getItem(LS_A); return r ? JSON.parse(r) : seedAnnouncements(); } catch { return seedAnnouncements(); }
  });

  useEffect(() => { localStorage.setItem(LS_M, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem(LS_A, JSON.stringify(announcements)); }, [announcements]);

  // Cross-tab sync (near real-time)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_M && e.newValue) setMessages(JSON.parse(e.newValue));
      if (e.key === LS_A && e.newValue) setAnnouncements(JSON.parse(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const sendMessage: Ctx["sendMessage"] = useCallback((toId, fromId, text, attachment) => {
    if (!text.trim() && !attachment) return;
    const msg: Message = {
      id: crypto.randomUUID(),
      conversationId: conversationId(fromId, toId),
      senderId: fromId,
      text: text.trim(),
      attachment,
      timestamp: Date.now(),
      readBy: [fromId],
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const markConversationRead: Ctx["markConversationRead"] = useCallback((otherId, meId) => {
    const cid = conversationId(otherId, meId);
    setMessages((prev) => prev.map((m) =>
      m.conversationId === cid && !m.readBy.includes(meId) ? { ...m, readBy: [...m.readBy, meId] } : m
    ));
  }, []);

  const postAnnouncement: Ctx["postAnnouncement"] = useCallback((a) => {
    setAnnouncements((prev) => [{ ...a, id: crypto.randomUUID(), timestamp: Date.now(), readBy: [a.authorId] }, ...prev]);
  }, []);

  const togglePin: Ctx["togglePin"] = useCallback((id) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));
  }, []);

  const markAnnouncementRead: Ctx["markAnnouncementRead"] = useCallback((id, meId) => {
    setAnnouncements((prev) => prev.map((a) =>
      a.id === id && !a.readBy.includes(meId) ? { ...a, readBy: [...a.readBy, meId] } : a
    ));
  }, []);

  const unreadMessagesFor = useCallback((meId: string) =>
    messages.filter((m) => m.senderId !== meId && !m.readBy.includes(meId) &&
      m.conversationId.split("__").includes(meId)).length, [messages]);

  const unreadAnnouncementsFor = useCallback((meId: string) =>
    announcements.filter((a) => !a.readBy.includes(meId)).length, [announcements]);

  const allowedContactsFor = useCallback((me: ChatUser) => {
    return DIRECTORY.filter((u) => u.id !== me.id).filter((u) => {
      if (me.role === "admin") return true;
      if (me.role === "teacher") return u.role === "admin" || u.role === "student";
      // student
      return u.role === "admin" || u.role === "teacher";
    });
  }, []);

  const conversationsFor = useCallback((meId: string) => {
    const me = DIRECTORY.find((u) => u.id === meId);
    if (!me) return [];
    const contacts = allowedContactsFor(me);
    return contacts.map((other) => {
      const cid = conversationId(meId, other.id);
      const convo = messages.filter((m) => m.conversationId === cid);
      const lastMessage = convo[convo.length - 1];
      const unread = convo.filter((m) => m.senderId !== meId && !m.readBy.includes(meId)).length;
      return { other, lastMessage, unread };
    }).sort((a, b) => (b.lastMessage?.timestamp ?? 0) - (a.lastMessage?.timestamp ?? 0));
  }, [messages, allowedContactsFor]);

  return (
    <MessagingContext.Provider value={{
      directory: DIRECTORY, messages, announcements,
      sendMessage, markConversationRead, postAnnouncement, togglePin, markAnnouncementRead,
      unreadMessagesFor, unreadAnnouncementsFor, conversationsFor, allowedContactsFor,
    }}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const ctx = useContext(MessagingContext);
  if (!ctx) throw new Error("useMessaging must be used within MessagingProvider");
  return ctx;
};
