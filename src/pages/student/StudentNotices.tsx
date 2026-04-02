import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CalendarClock, CreditCard, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { STUDENT_NOTICES, type StudentNotice, formatDateTime } from "@/data/studentPortal";

const StudentNotices = () => {
  const [filter, setFilter] = useState("all");
  const [notices, setNotices] = useState<StudentNotice[]>(STUDENT_NOTICES);

  const filtered = useMemo(() => {
    if (filter === "unread") return notices.filter((notice) => !notice.read);
    return notices;
  }, [filter, notices]);

  const toggleRead = (noticeId: number) => {
    setNotices((current) => current.map((notice) => (
      notice.id === noticeId ? { ...notice, read: !notice.read } : notice
    )));
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-header">Avisos</h1>
        <p className="page-subtitle">Lembretes importantes sobre pacote, agenda e materiais.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <p className="text-2xl font-semibold mt-3">{notices.filter((notice) => !notice.read).length}</p>
          <p className="text-sm text-muted-foreground">avisos ainda não lidos</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <p className="text-2xl font-semibold mt-3">{notices.filter((notice) => notice.category === "financeiro").length}</p>
          <p className="text-sm text-muted-foreground">avisos financeiros</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <p className="text-2xl font-semibold mt-3">{notices.filter((notice) => notice.category === "materiais").length}</p>
          <p className="text-sm text-muted-foreground">avisos de materiais</p>
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="unread">Não lidos</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3">
        {filtered.map((notice) => {
          const icon = notice.category === "financeiro" ? <CreditCard className="w-4 h-4" /> : notice.category === "agenda" ? <CalendarClock className="w-4 h-4" /> : <FileText className="w-4 h-4" />;

          return (
            <div key={notice.id} className="rounded-lg border bg-card p-4 flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-3 max-w-3xl">
                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{notice.title}</p>
                    {!notice.read && <Badge>Não lido</Badge>}
                    <Badge variant="secondary" className="capitalize">{notice.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{notice.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{formatDateTime(notice.createdAt)}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => toggleRead(notice.id)}>
                {notice.read ? "Marcar como não lido" : "Marcar como lido"}
              </Button>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default StudentNotices;