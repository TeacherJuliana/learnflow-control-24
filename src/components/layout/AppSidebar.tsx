import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, BookOpen, CreditCard, BarChart3,
  Calendar, ClipboardCheck, LogOut, GraduationCap, FileText,
  Bell, Settings, Clock, User
} from "lucide-react";

const NAV_ITEMS: Record<UserRole, { label: string; path: string; icon: React.ElementType }[]> = {
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Alunos", path: "/admin/students", icon: Users },
    { label: "Lista de Espera", path: "/admin/waiting-list", icon: Clock },
    { label: "Teachers", path: "/admin/teachers", icon: GraduationCap },
    { label: "Materiais", path: "/admin/materials", icon: FileText },
    { label: "Financeiro", path: "/admin/finance", icon: CreditCard },
    { label: "Relatórios", path: "/admin/reports", icon: BarChart3 },
    { label: "Configurações", path: "/admin/settings", icon: Settings },
  ],
  teacher: [
    { label: "Dashboard", path: "/teacher", icon: LayoutDashboard },
    { label: "Agenda", path: "/teacher/schedule", icon: Calendar },
    { label: "Alunos", path: "/teacher/students", icon: Users },
    { label: "Materiais", path: "/teacher/materials", icon: FileText },
    { label: "Pós-Aula", path: "/teacher/post-class", icon: ClipboardCheck },
  ],
  student: [
    { label: "Dashboard", path: "/student", icon: LayoutDashboard },
    { label: "Aulas", path: "/student/classes", icon: BookOpen },
    { label: "Materiais", path: "/student/materials", icon: FileText },
    { label: "Avisos", path: "/student/notices", icon: Bell },
    { label: "Pagamentos", path: "/student/payments", icon: CreditCard },
    { label: "Perfil", path: "/student/profile", icon: User },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  teacher: "Teacher",
  student: "Aluno",
};

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = NAV_ITEMS[user.role];

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]">
      <div className="p-5 border-b border-[hsl(var(--sidebar-border))]">
        <h1 className="text-lg font-bold text-[hsl(var(--sidebar-fg-active))] tracking-tight">
          EduFlow
        </h1>
        <p className="text-xs text-[hsl(var(--sidebar-fg))] mt-0.5">{ROLE_LABELS[user.role]}</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-link w-full ${isActive ? "sidebar-link-active" : "sidebar-link-inactive"}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--sidebar-accent))] flex items-center justify-center text-xs font-semibold text-[hsl(var(--sidebar-fg-active))]">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[hsl(var(--sidebar-fg-active))] truncate">{user.name}</p>
            <p className="text-xs text-[hsl(var(--sidebar-fg))] truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="sidebar-link sidebar-link-inactive w-full"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
